<script lang="ts" setup>
import * as yup from "yup";
import { addMinutes } from "date-fns";
import { vMaska } from "maska/vue";

const router = useRouter();

const trStore = useTimeRecordStore();

const categoryStore = useCategoryStore();
const { fetchAllCategories } = categoryStore;
const { allCategories, isAllCategoriesFetch } = storeToRefs(categoryStore);

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
  isBind: false,
  timerSessionType: "manual",
  timerSessionFrom: "browser",
});

const searchTrList = ref<SearchTimeRecordItem[]>([]);
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
  return Boolean(
    props.editObject && (props.editObject.id || props.editObject.isBind)
  );
});

const isSyncMode = computed(() => {
  return Boolean(
    props.editObject &&
      (props.editObject.id || props.editObject.isBind) &&
      props.editObject.isSync
  );
});

const categories = computed(() => {
  return [...newCategories.value, ...allCategories.value.map((c) => c.name)];
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
  return isAllCategoriesFetch.value;
});

const submitIsDisabled = computed(() => {
  if (form.isBind && !form.id) return true;
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
    const category = await categoryApi().post({ name: newCategories.value[0] });
    newCategories.value.splice(0, 1);

    return category!.id;
  }

  if (form.category) {
    const category = allCategories.value.find(
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
    OkToast(_$t("createTimeRecordSuccess"));

    router.push({ name: "record", params: { code: result?.code } });
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
      await postTimePeriodList(form.id!, {
        timePeriods: form.timePeriods.map((tp) => ({
          start: new Date(tp.start),
          end: new Date(tp.end),
        })),
        type: form.timerSessionType!,
        from: form.timerSessionFrom!,
      });

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

    OkToast(_$t("updateTimeRecordSuccess"));
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
    form.isBind = props.editObject.isBind;

    if (!props.hideTimePeriods) {
      form.timePeriods = props.editObject.timePeriods;
    }

    if (isSyncMode) {
      form.timerSessionType = props.editObject?.timerSessionType;
      form.timerSessionFrom = props.editObject?.timerSessionFrom;
    }
  }

  if (!isSyncMode.value) {
    fetchAllCategories(closeModal);
  }
});

const isTrSearch = ref<boolean>(false);

const searchTr = async (q: string = "") => {
  try {
    isTrSearch.value = true;
    const result = await searchTimeRecord(q);
    if (result) {
      searchTrList.value = result.map((item) => {
        item.title = item.title ? `${item.title} (${item.code})` : item.code;
        return item;
      });
    }
    return result;
  } finally {
    isTrSearch.value = false;
  }
};

const searchTrSelectAction = async (q: string) => {
  const result = await searchTr(q);
  return result ?? [];
};
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold">
        {{ "Tarefa" }}
      </h2>
      <UBadge
        v-if="(isEditMode || isSyncMode) && props.editObject?.code"
        variant="subtle"
        size="xs"
      >
        {{ props.editObject?.code }}
      </UBadge>
      <p v-else class="text-sm">
        Você pode agrupar e sincronizar o tempo registrado em nossos cronômetros
        em tarefas personalizadas.
      </p>
      <GCloseButton @close="closeModal" />
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <section v-if="form.isBind">
        <UFormGroup label="Tarefa existente" name="time-record-bind-id">
          <USelectMenu
            v-model="form.id"
            :options="searchTrList"
            :clear-search-on-close="true"
            :ui-menu="{ height: 'max-h-40' }"
            :disabled="disableInputs || isTrSearch"
            value-attribute="id"
            option-attribute="title"
            placeholder="Selecione uma Terafa"
            searchable-placeholder="Pesquisar..."
            :loading="isTrSearch"
            :searchable="searchTrSelectAction"
            :debounce="1000"
          >
          </USelectMenu>
        </UFormGroup>
      </section>

      <div v-if="!hideTimePeriods" class="flex justify-between">
        <h3>{{ _$t("periods") }}</h3>

        <UButton
          v-if="!isSyncMode"
          :label="_$t('add')"
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
            :disabled="disableInputs || isSyncMode"
            class="py-1"
            @change="form.timePeriods[index].end = $event"
          />
        </UFormGroup>

        <UFormGroup :label="_$t('endOfPeriod')" :name="'end-' + index">
          <GDatePicker
            v-model="form.timePeriods[index].end"
            :min="form.timePeriods[index].start"
            :disabled="disableInputs || isSyncMode"
            class="py-1"
          />
        </UFormGroup>

        <UButton
          v-if="!isSyncMode"
          :disabled="disableInputs"
          icon="i-icon-park-outline-close-small"
          color="white"
          variant="solid"
          @click="deleteTimePeriodFromForm(index)"
        />
      </div>

      <template v-if="!isSyncMode">
        <UFormGroup :label="_$t('title')" name="title">
          <UInput
            v-model="form.title"
            :disabled="disableInputs"
            type="text"
            maxlength="120"
          />
        </UFormGroup>

        <UFormGroup
          :label="_$t('code')"
          :required="isEditMode"
          :description="_$t('codeFormDescription')"
          name="code"
        >
          <UInput
            type="text"
            v-model="form.code"
            v-maska="{
              mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              tokens: {
                X: {
                  pattern: /[a-zA-Z0-9-]/,
                  transform: (v: string) => v.toLowerCase(),
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
                {{ _$t("create") }}
              </span>

              <span class="block truncate">{{ option }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup :label="_$t('description')" name="description">
          <UTextarea
            v-model="form.description"
            :disabled="disableInputs"
            maxlength="240"
          />
        </UFormGroup>

        <UFormGroup
          :label="_$t('externalLink')"
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
        :label="
          isSyncMode ? (form.isBind ? _$t('bind') : _$t('sync')) : _$t('send')
        "
        type="submit"
        block
      />
    </UForm>
  </UCard>
</template>
