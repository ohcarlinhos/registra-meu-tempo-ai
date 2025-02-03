<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const authStore = useAuthStore();
const { authModal } = storeToRefs(authStore);
const { closeAuthModal, setJwt } = authStore;
const { enableUserChallenge } = storeToRefs(useConfigStore());

const userStore = useUserStore();
const { checkIfIsVerified } = userStore;

const { rfMock, rfMockEnable } = storeToRefs(useMockStore());

const _tokenUserChallenge = ref();
const isFetch = ref(false);

const submitAction = async (dto: LoginDto) => {
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
  z.object({
    email: z
      .string({ message: _$t("emailIsRequired") })
      .email(_$t("emailIsInvalid")),
    password: z
      .string({ message: _$t("passwordIsRequired") })
      .min(8, _$t("passwordMin"))
      .max(48, _$t("passwordMax"))
      .regex(/[0-9]/, _$t("passwordNeedANumber"))
      .regex(/[a-z]/, _$t("passwordNeedALow"))
      .regex(/[A-Z]/, _$t("passwordNeedAUpper"))
      .regex(/[^\w]/, _$t("passwordNeedASymbol")),
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
    !formValues.email ||
    !formValues.password ||
    (!_tokenUserChallenge.value && enableUserChallenge.value)
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
  <Card>
    <CardHeader>
      <CardTitle>
        {{ _$t("access") }}
      </CardTitle>
      <CardDescription>
        Informe suas credenciais para acessar a ferramenta.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="flex flex-col gap-2">
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

        <Button type="submit" :disabled="submitIsDisabled" class="w-full mt-2">
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
