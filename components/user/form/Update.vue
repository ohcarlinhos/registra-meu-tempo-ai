<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const { mySelf } = storeToRefs(useUserStore());
const { fetchMySelf } = useUserStore();

const v = useUserValidation();

const isFetch = ref(false);
const oldEmail = ref("");

const formSchema = toTypedSchema(
  yup.object({
    name: v.name(),
    email: v.email(),
  })
);

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));

const submitAction = async (dto: UpdateUserDto) => {
  isFetch.value = true;

  try {
    await userApi().update(mySelf.value!.id, dto);

    if (oldEmail.value != dto.email) {
      OkToast(_$t("updateUserSuccessAndLogin"));
      return logout();
    } else {
      OkToast(_$t("updateUserSuccess"));
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

isFetch.value = true;

onMounted(async () => {
  await fetchMySelf((data) => {
    if (!data) return;

    oldEmail.value = data.email;
    isFetch.value = false;

    setValues({
      name: data.name,
      email: data.email,
    });
  });
});
</script>

<template>
  <GPanelCol custom-class="w-full">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ "Dados do usuário" }}
        </CardTitle>

        <CardDescription>
          Mantenha as informações da sua conta sempre atualizadas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="flex flex-col gap-2" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>{{ _$t("name") }}</FormLabel>
              <FormControl>
                <Input v-bind="componentField" :disabled="isFetch" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>{{ _$t("email") }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="email"
                  :disabled="isFetch"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" :disabled="isFetch" class="w-full mt-2">
            {{ "Atualizar dados do usuário" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </GPanelCol>
</template>
