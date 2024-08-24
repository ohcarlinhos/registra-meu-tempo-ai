<script lang="ts" setup>
import * as yup from "yup";
import { addMinutes } from "date-fns";
import { vMaska } from "maska/vue";

const { t } = useI18n();
const router = useRouter();

const trStore = useTimeRecordStore();
const categoryStore = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimeRecordForm;
    hideTimePeriods?: boolean;
    refreshTimeRecords?: boolean;
  }>(),
  {}
);

/**
 * States
 */

const form = reactive<TimeRecordForm>({
  id: undefined,
  title: "",
  description: "",
  category: "",
  code: "",
  externalLink: "",
  categoryId: undefined,
  timePeriods: [],
  callback: undefined,
  isSync: false,
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

const isSyncMode = computed(() => {
  return Boolean(
    props.editObject && props.editObject.id && props.editObject.isSync
  );
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

const categoryIsDisabled = computed(() => {
  return categoryStore && categoryStore.isFetch;
});

const submitIsDisabled = computed(() => {
  return trStore && trStore.isFetch;
});

/**
 * Methods
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) trStore.refetch();
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

const isFetch = ref(false);

const submit = async () => {
  await schema.validate(await submitAction());
};

const createAction = async () => {
  try {
    isFetch.value = true;
    const result = await postTimeRecord({
      ...form,
      categoryId: await handleCategory(),
    });

    if (form.callback) form.callback(result?.code);

    closeModal(props.refreshTimeRecords);
    OkToast(t("form.timeRecord.status.success.create"));

    router.push({ name: "time.record.page", params: { code: result?.code } });
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const updateAction = async () => {
  try {
    isFetch.value = true;

    if (isSyncMode.value) {
      await postTimePeriodList(
        form.id!,
        form.timePeriods.map((tp) => ({
          start: new Date(tp.start),
          end: new Date(tp.end),
        }))
      );

      if (form.callback) form.callback();
    } else {
      const result = await putTimeRecord({
        ...form,
        id: form.id!,
        categoryId: await handleCategory(),
      });

      if (form.callback) form.callback(result?.code);
    }

    closeModal(props.refreshTimeRecords);
    OkToast(t("form.timeRecord.status.success.update"));
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const submitAction = async () => {
  return isEditMode.value ? updateAction() : createAction();
};

/**
 * Lifeclycle
 */

const disableInputs = computed(() => {
  return isFetch.value;
});

onMounted(async () => {
  if (props.editObject) {
    form.id = props.editObject.id;
    form.title = props.editObject.title;
    form.description = props.editObject.description;
    form.category = props.editObject.category;
    form.categoryId = props.editObject.categoryId;
    form.code = props.editObject.code;
    form.externalLink = props.editObject.externalLink;
    form.callback = props.editObject.callback;
    form.isSync = props.editObject.isSync;

    if (!props.hideTimePeriods) {
      form.timePeriods = props.editObject.timePeriods;
    }
  }

  if (!isSyncMode.value) categoryStore.fetchAllCategories(closeModal);
});
</script>

<template>
  <UCard>
    <template #header>
      <h2>
        Registro de Tempo
        <UBadge
          v-if="(isEditMode || isSyncMode) && props.editObject?.code"
          variant="subtle"
          size="xs"
        >
          {{ props.editObject?.code }}
        </UBadge>
      </h2>
      <GCloseButton @close="closeModal" />
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <div v-if="!hideTimePeriods" class="flex justify-between">
        <h3>{{ $t("periods") }}</h3>

        <UButton
          :label="$t('add')"
          :disabled="addButtonIsDisabled || disableInputs"
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
        <UFormGroup :label="_$t('startOfPeriod')" :name="'start-' + index">
          <GDatePicker
            v-model="form.timePeriods[index].start"
            :min="index !== 0 ? form.timePeriods[index - 1].end : ''"
            :disabled="disableInputs"
            class="py-1"
            @change="form.timePeriods[index].end = $event"
          />
        </UFormGroup>

        <UFormGroup :label="_$t('endOfPeriod')" :name="'end-' + index">
          <GDatePicker
            v-model="form.timePeriods[index].end"
            :min="form.timePeriods[index].start"
            :disabled="disableInputs"
            class="py-1"
          />
        </UFormGroup>

        <UButton
          :disabled="disableInputs"
          icon="i-icon-park-outline-close-small"
          color="white"
          variant="solid"
          @click="deleteTimePeriodFromForm(index)"
        />
      </div>

      <template v-if="!isSyncMode">
        <UFormGroup :label="$t('form.timeRecord.title')" name="title">
          <UInput
            v-model="form.title"
            :disabled="disableInputs"
            type="text"
            maxlength="120"
          />
        </UFormGroup>

        <UFormGroup
          :label="$t('form.timeRecord.code')"
          :required="isEditMode"
          name="code"
          description='Utilize o campo para identificar sua tarefa ou atividade. Ex: "TASK-1234".'
        >
          <UInput
            type="text"
            v-model="form.code"
            v-maska="{
              mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              tokens: {
                X: {
                  pattern: /[a-zA-Z0-9-]/,
                  transform: (v) => v.toLowerCase(),
                },
              },
            }"
            :required="isEditMode"
            :disabled="disableInputs"
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
            :disabled="categoryIsDisabled || disableInputs"
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
          <UTextarea
            v-model="form.description"
            :disabled="disableInputs"
            maxlength="240"
          />
        </UFormGroup>

        <UFormGroup
          :label="$t('externalLink')"
          name="externalLink"
          description="Link externo para sua tarefa ou algo que queira fixar."
          maxlength="120"
        >
          <UInput
            v-model="form.externalLink"
            :disabled="disableInputs"
            type="text"
          />
        </UFormGroup>
      </template>

      <UButton
        :loading="isFetch"
        :disabled="submitIsDisabled"
        :label="isSyncMode ? $t('sync') : $t('send')"
        block
        type="submit"
      />
    </UForm>
  </UCard>
</template>
