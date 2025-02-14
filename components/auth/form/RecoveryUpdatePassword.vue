<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const v = useUserValidation();

const props = defineProps<{
  code: string;
}>();

const isFetch = ref(false);

const formSchema = toTypedSchema(
  yup.object({
    email: v.email(),
    password: v.password(),
    confirmPassword: v.confirmPassword(),
    code: yup.string().required(),
  })
);

const submitAction = async (dto: RecoveryPasswordDto) => {
  try {
    isFetch.value = true;

    await userApi().recoveryPassword(dto);

    OkToast(_$t("updatePasswordSuccess"));
    useRouter().push({ name: "login" });
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));

setFieldValue("code", props.code);
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>
        {{ _$t("recoveryPassword") }}
      </CardTitle>

      <CardDescription>
        Salve sua senha em um aplicativo de persistir senhas ou escreva em um
        lugar e guarde de forma segura.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormLabel>{{ _$t("code") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" disabled />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ _$t("email") }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="email" autofocus />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>{{ _$t("newPassword") }}</FormLabel>
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

        <Button
          type="submit"
          :disabled="isFetch"
          :loading="isFetch"
          class="w-full mt-2"
        >
          {{ _$t("update") }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
