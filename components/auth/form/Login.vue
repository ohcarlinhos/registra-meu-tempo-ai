<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const { enableUserChallenge } = storeToRefs(useConfigStore());

const v = useUserValidation();

const userStore = useUserStore();
const { checkIfIsVerified } = userStore;

const { rfMock, rfMockEnable } = storeToRefs(useMockStore());

const _tokenUserChallenge = ref();
const isFetch = ref(false);

const submitAction = async (dto: LoginDto) => {
  const authStore = useAuthStore();
  const { authModal } = storeToRefs(authStore);
  const { closeAuthModal, setJwt } = authStore;

  try {
    isFetch.value = true;

    setJwt(await postLogin(dto, _tokenUserChallenge.value));

    OkToast(_$t("loginSuccess"));

    await checkIfIsVerified();

    const route = useRoute();
    const router = useRouter();

    if (route.query.backToAfter) {
      return router.push(`${route.query.backToAfter}`);
    }

    if (authModal.value.open) {
      closeAuthModal();
      return;
    }

    return router.push({ name: "record.panel" });
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
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>
        {{ _$t("access") }}
      </CardTitle>
      <CardDescription>
        Informe suas credenciais para acessar a ferramenta.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
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
          <NuxtTurnstile v-model="_tokenUserChallenge" />
        </section>

        <Button
          type="submit"
          :disabled="submitIsDisabled"
          :loading="isFetch"
          class="w-full mt-2"
        >
          {{ _$t("access") }}
        </Button>
      </form>
    </CardContent>

    <CardFooter>
      <section class="flex gap-5 justify-center w-full">
        <NuxtLink
          :to="{ name: 'register' }"
          class="hover:text-primary hover:underline text-sm"
        >
          {{ _$t("createAccount") }}
        </NuxtLink>

        <NuxtLink
          :to="{ name: 'recovery' }"
          class="hover:text-primary hover:underline text-sm"
        >
          {{ _$t("recoveryPassword") }}
        </NuxtLink>
      </section>
    </CardFooter>
  </Card>
</template>
