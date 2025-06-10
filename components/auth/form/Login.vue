<script lang="ts" setup>
const { openInPopup, fetch: fetchSession } = useUserSession();

import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const { enableUserChallenge } = storeToRefs(useConfigStore());

const v = useUserValidation();
const { rfMock, rfMockEnable } = storeToRefs(useMockStore());

const _tokenUserChallenge = ref();
const isFetch = ref(false);

const authStore = useAuthStore();
const { authModal } = storeToRefs(authStore);
const { closeAuthModal } = authStore;

const submitAction = async (dto: LoginDto) => {
  try {
    isFetch.value = true;

    await $fetch<JwtData>("/api/auth/login", {
      method: "POST",
      body: { ...dto, token: _tokenUserChallenge.value },
    });

    fetchSession();

    OkToast(_$t("loginSuccess"));

    const route = useRoute();
    const router = useRouter();

    if (route.query.backToAfter) {
      return router.push(`${route.query.backToAfter}`);
    }

    if (authModal.value.open) {
      closeAuthModal();
      return;
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const formSchema = toTypedSchema(
  yup.object({
    email: v.email(),
    password: v.password(),
  })
);

const {
  handleSubmit,
  values: formValues,
  setValues,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));

const submitIsDisabled = computed(() => {
  return (
    isFetch.value || (!_tokenUserChallenge.value && enableUserChallenge.value)
  );
});

if (rfMockEnable.value) {
  setValues({
    email: rfMock.value.email,
    password: rfMock.value.password,
  });
}

const { loggedIn } = useUserSession();

watch(
  () => loggedIn.value,
  (newValue) => {
    if (newValue && authModal.value.open) {
      closeAuthModal();
    }
  }
);
</script>

<template>
  <form class="flex flex-col gap-2" @submit="onSubmit">
    <!-- <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>{{ _$t("email") }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="email" />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>{{ _$t("password") }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="password" />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>

    <section
      v-if="enableUserChallenge && formValues.email && formValues.password"
      class="flex justify-center pt-1"
    >
      <NuxtTurnstile
        class="flex-1"
        v-model="_tokenUserChallenge"
        :options="{ size: 'flexible' }"
      />
    </section>

    <Button
      type="submit"
      :disabled="submitIsDisabled"
      :loading="isFetch"
      class="w-full mt-2"
    >
      {{ _$t("access") }}
    </Button> -->
    <!-- 
    <Separator label="Provedores" class="mt-6 mb-4" />

    <p class="text-xs text-center mb-2">
      Uma conta será criada automaticamente caso seja seu primeiro acesso.
    </p> -->

    <Button
      @click="openInPopup('/auth/google')"
      variant="outline"
      class="w-full p-5"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="M16.318 13.714v5.484h9.078c-.37 2.354-2.745 6.901-9.078 6.901c-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182C24.251 1.584 20.641.001 16.318.001c-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635c0-1.052-.115-1.854-.255-2.651z"
        />
      </svg>

      Acessar com Google
    </Button>

    <Button
      @click="openInPopup('/auth/github')"
      variant="outline"
      class="w-full p-5"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="M16 .396c-8.839 0-16 7.167-16 16c0 7.073 4.584 13.068 10.937 15.183c.803.151 1.093-.344 1.093-.772c0-.38-.009-1.385-.015-2.719c-4.453.964-5.391-2.151-5.391-2.151c-.729-1.844-1.781-2.339-1.781-2.339c-1.448-.989.115-.968.115-.968c1.604.109 2.448 1.645 2.448 1.645c1.427 2.448 3.744 1.74 4.661 1.328c.14-1.031.557-1.74 1.011-2.135c-3.552-.401-7.287-1.776-7.287-7.907c0-1.751.62-3.177 1.645-4.297c-.177-.401-.719-2.031.141-4.235c0 0 1.339-.427 4.4 1.641a15.4 15.4 0 0 1 4-.541c1.36.009 2.719.187 4 .541c3.043-2.068 4.381-1.641 4.381-1.641c.859 2.204.317 3.833.161 4.235c1.015 1.12 1.635 2.547 1.635 4.297c0 6.145-3.74 7.5-7.296 7.891c.556.479 1.077 1.464 1.077 2.959c0 2.14-.02 3.864-.02 4.385c0 .416.28.916 1.104.755c6.4-2.093 10.979-8.093 10.979-15.156c0-8.833-7.161-16-16-16z"
        />
      </svg>

      Acessar com GitHub
    </Button>
  </form>
</template>
