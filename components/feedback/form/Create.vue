<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["close"]);

const props = withDefaults(
  defineProps<{
    callback?: Function;
    isForm?: boolean;
  }>(),
  {
    isForm: true,
  }
);

const { enableUserChallenge } = storeToRefs(useConfigStore());

const isFetch = ref(false);
const _tokenUserChallenge = ref();

const formSchema = toTypedSchema(
  yup.object({
    message: yup
      .string()
      .min(20, "A mensagem deve conter pelo menos 20 caracteres.")
      .max(500, "A mensagem deve ter o tamanho máximo de 500 caracteres.")
      .required("É obrigatório informar uma mensagem no seu feedback."),
  })
);

const {
  handleSubmit,
  values: formValues,
  resetForm,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => submitAction(value));

const close = (refresh = false) => {
  emit("close", refresh);
};

const submitAction = async (dto: { message: string }) => {
  isFetch.value = true;
  let submitIsOk = true;

  try {
    await postFeedback(dto.message, _tokenUserChallenge.value);

    OkToast("Feedback enviado com sucesso.");
    resetForm();
    close(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && props.callback) props.callback();
    isFetch.value = false;
  }
};

const submitIsDisabled = computed(() => {
  return (
    isFetch.value || (!_tokenUserChallenge.value && enableUserChallenge.value)
  );
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ "Feedback e Dúvidas" }}
      </CardTitle>

      <GCloseButton v-if="isForm" @close="close" />

      <CardDescription>
        Utilize esse formulário para deixar o seu comentário, dúvida ou pedir
        ajuda caso algo não esteja funcionando corretamente.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="message">
          <FormItem>
            <FormLabel>{{ "Mensagem" }}</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <section
          v-if="enableUserChallenge && formValues.message"
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
          {{ "Enviar" }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
