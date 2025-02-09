<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const { mySelf } = storeToRefs(useUserStore());
const v = useUserValidation();

const isFetch = ref(false);

const formSchema = toTypedSchema(
  yup.object({
    oldPassword: v.oldPassword(),
    password: v.password(),
    confirmPassword: v.confirmPassword(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));

const submitAction = async (dto: UpdateUserPasswordDto) => {
  isFetch.value = true;

  try {
    await userApi().updatePassword(mySelf.value!.id, dto);
    resetForm();
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};
</script>

<template>
  <GPanelCol custom-class="w-full">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ "Senha" }}
        </CardTitle>

        <CardDescription>
          Utilize esse formulário para atualizar sua senha.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="flex flex-col gap-2" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="oldPassword">
            <FormItem>
              <FormLabel>{{ _$t("oldPassword") }}</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" />
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
              <FormLabel>{{ _$t("confirmNewPassword") }}</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" :disabled="isFetch" class="w-full mt-2">
            {{ "Atualizar senha" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </GPanelCol>
</template>
