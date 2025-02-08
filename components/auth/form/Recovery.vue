<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const authStore = useAuthStore();
const { authModal } = storeToRefs(authStore);

const v = useUserValidation();

const successEmailSend = ref(false);
const isFetch = ref(false);

const formSchema = toTypedSchema(
  yup.object({
    email: v.email(),
  })
);

const submitAction = async (dto: RecoveryDto) => {
  try {
    isFetch.value = true;

    const data = await userApi().requestRecoveryPasswordCode(dto);

    if (!!data && typeof data == "boolean") {
      successEmailSend.value = data;
    }

    OkToast(_$t("recoveryPasswordSuccess"));
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));
</script>

<template>
  <Card v-if="successEmailSend" class="w-full text-center pt-5">
    <CardContent>
      <p>{{ _$t("recoveryPasswordSuccess") }}</p>
    </CardContent>
  </Card>

  <Card v-else class="w-full">
    <CardHeader>
      <CardTitle>{{ "Recuperar senha" }}</CardTitle>
    </CardHeader>

    <CardContent>
      <form class="space-y-4" @submit="onSubmit">
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

        <Button type="submit" :disabled="isFetch" class="w-full mt-2">
          {{ _$t("toRecovery") }}
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
          :to="{ name: 'register' }"
          class="hover:text-primary hover:underline text-sm"
        >
          {{ _$t("createAccount") }}
        </NuxtLink>
      </section>
    </CardFooter>
  </Card>
</template>
