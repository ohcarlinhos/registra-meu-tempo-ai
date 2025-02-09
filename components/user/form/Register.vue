<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const v = useUserValidation();
const { enableUserChallenge } = storeToRefs(useConfigStore());

const isFetch = ref(false);
const _tokenUserChallenge = ref();

const { rfMock, rfMockEnable } = storeToRefs(useMockStore());

const submitAction = async (dto: CreateUserDto) => {
  try {
    isFetch.value = true;

    const result = await userApi().post(dto, _tokenUserChallenge.value);

    if (result) {
      OkToast(_$t("createUserSuccess"));
      useAuthStore().setJwt(result.jwt);
      useRouter().push({ name: "record.panel" });
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const formSchema = toTypedSchema(
  yup.object({
    name: v.name(),
    email: v.email(),
    password: v.password(),
    confirmPassword: v.confirmPassword(),
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
    name: rfMock.value.name,
    email: rfMock.value.email,
    password: rfMock.value.password,
    confirmPassword: rfMock.value.confirmPassword,
  });
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>
        {{ "Criar conta" }}
      </CardTitle>
      <CardDescription>
        Com uma conta você pode organizar seu tempo por tarefas, ver o total
        gasto e estatísticas.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ _$t("name") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

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

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>{{ _$t("confirmPassword") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="password" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <section
          v-if="
            enableUserChallenge &&
            formValues.email &&
            formValues.name &&
            formValues.password &&
            formValues.confirmPassword
          "
          class="flex justify-center pt-1"
        >
          <NuxtTurnstile v-model="_tokenUserChallenge" />
        </section>

        <Button type="submit" :disabled="submitIsDisabled" class="w-full mt-2">
          {{ _$t("toRecord") }}
        </Button>
      </form>
    </CardContent>

    <CardFooter>
      <section class="flex gap-5 justify-center w-full">
        <NuxtLink
          :to="{ name: 'login' }"
          class="hover:text-primary hover:underline text-sm"
        >
          {{ "Acessar conta" }}
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
