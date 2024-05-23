<script lang="ts" setup>
import * as yup from "yup";
const categoryStore = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: CategoryFormType;
  }>(),
  {}
);

/**
 * States
 */

const status = reactive({ fetching: false });

const form = reactive<CategoryFormType>({
  id: undefined,
  name: "",
  callback: undefined,
});

const submitButtonIsDisabled = computed(() => {
  return form.name.length === 0;
});

/**
 * Validations
 */

const schema = yup.object({
  name: yup.string(),
});

/**
 * Methods
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) categoryStore.refetch();
};

const submit = async () => {
  await schema.validate(await submitAction());
};

const createAction = async () => {
  try {
    await postCategory(form);

    if (form.callback) form.callback();

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  }
};

const editAction = async (id: number) => {
  // TODO
  console.log(props.editObject);
};

const submitAction = async () => {
  return props.editObject?.id
    ? editAction(props.editObject.id)
    : createAction();
};

/**
 * Lifeclycle
 */

onMounted(async () => {
  if (props.editObject) {
    form.id = props.editObject.id;
    form.name = props.editObject.name;
    form.callback = props.editObject.callback;
  }
});
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2>Registro de Tempo</h2>

        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="closeModal"
        />
      </div>
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <UFormGroup label="Nome" name="name">
        <UInput type="text" v-model="form.name" autofocus />
      </UFormGroup>

      <UButton
        :loading="status.fetching"
        :disabled="submitButtonIsDisabled"
        block
        type="submit"
        label="Enviar"
      />
    </UForm>
  </UCard>
</template>
