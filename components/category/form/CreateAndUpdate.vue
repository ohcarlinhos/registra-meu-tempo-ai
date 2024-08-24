<script lang="ts" setup>
import * as yup from "yup";
const categoryStore = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: CategoryForm;
  }>(),
  {}
);

/**
 * States
 */

const form = reactive<CategoryForm>({
  id: undefined,
  name: "",
  callback: undefined,
});

const submitIsDisabled = computed(() => {
  return form.name.length === 0 || form.name === props.editObject?.name;
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

const isFetch = ref(false);

const createAction = async () => {
  isFetch.value = true;

  try {
    await postCategory(form);

    if (form.callback) form.callback();

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const editAction = async (id: number) => {
  isFetch.value = true;

  try {
    await putCategory(id, form);

    if (form.callback) form.callback();

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
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

watch(
  () => props.editObject,
  (newObj) => {
    if (newObj) {
      form.id = newObj.id;
      form.name = newObj.name;
      form.callback = newObj.callback;
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2>{{ $t("form.category.create.title") }}</h2>

        <UButton
          color="gray"
          variant="ghost"
          icon="i-icon-park-outline-close-small"
          class="-my-1"
          @click="closeModal"
        />
      </div>
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <UFormGroup :label="$t('name')" name="name">
        <UInput
          v-model="form.name"
          :disabled="isFetch"
          maxlength="20"
          type="text"
          autofocus
        />
      </UFormGroup>

      <UButton
        :loading="isFetch"
        :disabled="submitIsDisabled"
        :label="props.editObject?.id ? $t('save') : $t('create')"
        type="submit"
        block
      />
    </UForm>
  </UCard>
</template>
