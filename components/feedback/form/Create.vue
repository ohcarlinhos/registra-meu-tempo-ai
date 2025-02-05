<script lang="ts" setup>
import * as yup from "yup";

const emit = defineEmits(["close"]);

const props = defineProps<{
  callback?: Function;
}>();

const { enableUserChallenge } = storeToRefs(useConfigStore());

const form = reactive({
  message: "",
});

const _tokenUserChallenge = ref();

const schema = yup.object({
  message: yup
    .string()
    .min(20, "A mensagem deve conter pelo menos 20 caracteres.")
    .max(500, "A mensagem deve ter o tamanho máximo de 500 caracteres.")
    .required("É obrigatório informar uma mensagem no seu feedback."),
});

const close = (refresh = false) => {
  emit("close", refresh);
};

const submit = async () => {
  schema.validate(form).then(async () => {
    await createAction();
  });
};

const isFetch = ref(false);

const createAction = async () => {
  isFetch.value = true;
  let submitIsOk = true;

  try {
    await postFeedback(form.message, _tokenUserChallenge.value);

    OkToast("Feedback enviado com sucesso.");
    close(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && props.callback) props.callback();
    isFetch.value = false;
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ "Feedback / Dúvida" }}
      </CardTitle>

      <GCloseButton @close="close" />
    </CardHeader>

    <CardContent>
      <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
        <UFormGroup label="Mensagem" name="message">
          <UTextarea v-model="form.message" autoresize />
        </UFormGroup>

        <section
          v-if="enableUserChallenge && form.message"
          class="flex justify-center pt-1"
        >
          <NuxtTurnstile v-model="_tokenUserChallenge" />
        </section>

        <UButton
          :loading="isFetch"
          :label="$t('send')"
          :disabled="
            !form.message || (!_tokenUserChallenge && enableUserChallenge)
          "
          block
          type="submit"
        />
      </UForm>
    </CardContent>
  </Card>
</template>
