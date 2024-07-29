<script lang="ts" setup>
import * as yup from "yup";
import { addMinutes } from "date-fns";
import { vMaska } from "maska/vue";

const { t } = useI18n();

const timeRecordStore = useTimeRecordStore();
const categoryStore = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimeRecordFormType;
    hideTimePeriods?: boolean;
    refreshTimeRecords?: boolean;
  }>(),
  {}
);

/**
 * States
 */

const status = reactive({
  fetching: false,
});

const form = reactive<TimeRecordFormType>({
  id: undefined,
  title: "",
  description: "",
  category: "",
  code: "",
  externalLink: "",
  categoryId: undefined,
  timePeriods: [],
  callback: undefined,
});

const newCategories = ref<string[]>([]);

watch(
  () => form.code,
  (newValue) => {
    form.code = newValue.replace(" ", "");
  }
);

/**
 * Validations
 */

// TODO: finalizar validações
const schema = yup.object({
  description: yup.string(),
  externalLink: yup.string(),
  code: yup.string(),
});

/**
 * Computeds
 */

const isEditMode = computed(() => {
  return Boolean(props.editObject && props.editObject.id);
});

const categories = computed(() => {
  return [
    ...newCategories.value,
    ...categoryStore.getAllCategories.map((c) => c.name),
  ];
});

const categoryValue = computed({
  get: () => form.category,

  set: async (label) => {
    const search = categories.value.find((category) => category === label);
    if (!search) newCategories.value.push(label);

    form.category = label;
  },
});

const addButtonIsDisabled = computed(() => {
  const initialValue = true;

  const allHasValue = form.timePeriods.reduce((acc, current) => {
    return !!current.start && !!current.end && acc;
  }, initialValue);

  return allHasValue === false;
});

const submitButtonIsDisabled = computed(() => {
  return form.timePeriods.length === 0 && !props.editObject?.id;
});

/**
 * Methods
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) timeRecordStore.refetchTimeRecords();
};

const addTimePeriodToForm = () => {
  const start =
    form.timePeriods.length === 0
      ? new Date()
      : addMinutes(form.timePeriods[form.timePeriods.length - 1].end, 15);

  const end = addMinutes(start, 25);

  form.timePeriods.push({ start, end });
};

const deleteTimePeriodFromForm = (index: number) => {
  form.timePeriods.splice(index, 1);
};

const handleCategory = async () => {
  if (newCategories.value.length && form.category === newCategories.value[0]) {
    const category = await postCategory({ name: newCategories.value[0] });
    newCategories.value.splice(0, 1);

    return category!.id;
  }

  if (form.category) {
    const category = categoryStore.getAllCategories.find(
      (category) => category.name === form.category
    );

    if (category) return category.id;
  }

  return undefined;
};

const submit = async () => {
  await schema.validate(await submitAction());
};

const createAction = async () => {
  try {
    const result = await postTimeRecord({
      ...form,
      categoryId: await handleCategory(),
    });

    if (form.callback) form.callback(result?.code);

    closeModal(props.refreshTimeRecords);
    OkToast(t("form.timeRecord.status.success.create"));
  } catch (error) {
    ErrorToast(error);
  }
};

const updateAction = async () => {
  try {
    const result = await putTimeRecord({
      ...form,
      id: form.id!,
      categoryId: await handleCategory(),
    });

    if (form.callback) form.callback(result?.code);

    closeModal(props.refreshTimeRecords);
    OkToast(t("form.timeRecord.status.success.update"));
  } catch (error) {
    ErrorToast(error);
  }
};

const submitAction = async () => {
  return isEditMode.value ? updateAction() : createAction();
};

/**
 * Lifeclycle
 */

onMounted(async () => {
  await categoryStore.fetchAllCategories(closeModal);

  if (props.editObject) {
    form.id = props.editObject.id;
    form.title = props.editObject.title;
    form.description = props.editObject.description;
    form.category = props.editObject.category;
    form.categoryId = props.editObject.categoryId;
    form.code = props.editObject.code;
    form.externalLink = props.editObject.externalLink;
    form.callback = props.editObject.callback;

    if (!props.hideTimePeriods) {
      form.timePeriods = props.editObject.timePeriods;
    }
  } else if (form.timePeriods.length === 0) {
    addTimePeriodToForm();
  }
});
</script>

<template>
  <UCard>
    <template #header>
      <h2>Registro de Tempo</h2>
      <GCloseButton @close="closeModal" />
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <div v-if="!hideTimePeriods" class="flex justify-between">
        <h3>{{ $t("periods") }}</h3>

        <UButton
          :label="$t('add')"
          :disabled="addButtonIsDisabled"
          size="sm"
          type="button"
          @click="addTimePeriodToForm"
        />
      </div>

      <div
        v-if="!hideTimePeriods"
        v-for="(_, index) in form.timePeriods"
        class="flex flex-row gap-4 relative dark:border-gray-800 border-b-2 pb-3"
      >
        <UFormGroup
          :label="$t('form.timeRecord.period.start')"
          :name="'start-' + index"
        >
          <GDatePicker
            v-model="form.timePeriods[index].start"
            :min="index !== 0 ? form.timePeriods[index - 1].end : ''"
            class="py-1"
            @change="form.timePeriods[index].end = $event"
          />
        </UFormGroup>

        <UFormGroup
          :label="$t('form.timeRecord.period.end')"
          :name="'end-' + index"
        >
          <GDatePicker
            v-model="form.timePeriods[index].end"
            :min="form.timePeriods[index].start"
            class="py-1"
          />
        </UFormGroup>

        <UButton
          icon="i-icon-park-outline-close-small"
          color="white"
          variant="solid"
          @click="deleteTimePeriodFromForm(index)"
        />
      </div>

      <UFormGroup :label="$t('form.timeRecord.title')" name="title">
        <UInput type="text" v-model="form.title" maxlength="120" />
      </UFormGroup>

      <UFormGroup
        :label="$t('form.timeRecord.code')"
        :required="isEditMode"
        name="title"
        description='Utilize o campo para identificar sua tarefa ou atividade. Ex: "TASK-1234".'
      >
        <UInput
          type="text"
          v-model="form.code"
          v-maska="{
            mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            tokens: {
              X: { pattern: /[a-zA-Z0-9-]/, transform: (v) => v.toLowerCase() },
            },
          }"
          :required="isEditMode"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('category')"
        name="category"
        class="z-100 relative"
      >
        <USelectMenu
          v-model="categoryValue"
          :options="categories"
          :clear-search-on-close="true"
          :ui-menu="{ height: 'max-h-40' }"
          show-create-option-when="always"
          searchable
          creatable
        >
          <template #option-create="{ option }">
            <span class="flex-shrink-0">
              {{ $t("form.timeRecord.selectCategoryAdd") }}
            </span>

            <span class="block truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup :label="$t('description')" name="description">
        <UTextarea v-model="form.description" maxlength="240" />
      </UFormGroup>

      <UFormGroup
        :label="$t('externalLink')"
        name="externalLink"
        description="Link externo para sua tarefa ou algo que queira fixar."
        maxlength="120"
      >
        <UInput type="text" v-model="form.externalLink" />
      </UFormGroup>

      <UButton
        :loading="status.fetching"
        :disabled="submitButtonIsDisabled"
        :label="$t('send')"
        block
        type="submit"
      />
    </UForm>
  </UCard>
</template>
