<script lang="ts" setup>
import * as yup from "yup";
import { addMinutes } from "date-fns";

const timeRecordStore = useTimeRecordStore();
const categoryStore = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimeRecordFormType;
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
  description: "",
  category: "",
  categoryId: undefined,
  timePeriods: [],
  callback: undefined,
});

const newCategories = ref<string[]>([]);

/**
 * Validations
 */

// TODO: finalizar validações
const schema = yup.object({
  description: yup.string(),
});

/**
 * Computeds
 */

const categories = computed(() => {
  return [
    ...newCategories.value,
    ...categoryStore.getAllCategories.map((c) => c.name),
  ];
});

const categoryValue = computed({
  get: () => form.category,

  set: async (label) => {
    const findded = categories.value.find((category) => category === label);
    if (!findded) newCategories.value.push(label);

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
  return form.timePeriods.length === 0;
});

/**
 * Methods
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) timeRecordStore.fetchTimeRecords();
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

    return category.value.id;
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
    await postTimeRecord({
      ...form,
      categoryId: await handleCategory(),
    });

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
  await categoryStore.fetchAllCategories(closeModal);

  if (props.editObject) {
    form.id = props.editObject.id;
    form.description = props.editObject.description;
    form.category = props.editObject.category;
    form.categoryId = props.editObject.categoryId;
    form.timePeriods = props.editObject.timePeriods;
    form.callback = props.editObject.callback;
  } else if (form.timePeriods.length === 0) {
    addTimePeriodToForm();
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
      <UFormGroup label="Descrição" name="description">
        <UInput type="text" v-model="form.description" autofocus />
      </UFormGroup>

      <UFormGroup label="Categoria" name="category" class="z-100 relative">
        <USelectMenu
          v-model="categoryValue"
          :options="categories"
          :clear-search-on-close="true"
          show-create-option-when="always"
          searchable
          creatable
          :ui-menu="{ height: 'max-h-40' }"
        >
          <template #option-create="{ option }">
            <span class="flex-shrink-0">Criar:</span>
            <span class="block truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <div class="flex justify-between pt-6">
        <h3>Períodos de Tempo</h3>

        <UButton
          label="Adicionar"
          size="sm"
          type="button"
          :disabled="addButtonIsDisabled"
          @click="addTimePeriodToForm"
        />
      </div>

      <div
        v-for="(_, index) in form.timePeriods"
        class="flex gap-4 relative border-gray-800 border-b-2 pb-3"
      >
        <UFormGroup label="Início do período" :name="'start-' + index">
          <GDatePicker
            v-model="form.timePeriods[index].start"
            :min="index !== 0 ? form.timePeriods[index - 1].end : ''"
            class="py-1"
            @change="form.timePeriods[index].end = $event"
          />
        </UFormGroup>

        <UFormGroup label="Final do período" :name="'end-' + index">
          <GDatePicker
            v-model="form.timePeriods[index].end"
            class="py-1"
            :min="form.timePeriods[index].start"
          />
        </UFormGroup>

        <UButton
          icon="i-heroicons-x-mark"
          color="white"
          variant="solid"
          @click="deleteTimePeriodFromForm(index)"
        />
      </div>

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
