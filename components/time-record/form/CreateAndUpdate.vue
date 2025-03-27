<script lang="ts" setup>
import * as yup from "yup";
import { toTypedSchema } from "@vee-validate/yup";
import { addMinutes } from "date-fns";
import { vMaska } from "maska/vue";
import { useDebounceFn } from "@vueuse/core";
import { useForm } from "vee-validate";
import { X, Check, Search, ChevronsUpDown, PenLine } from "lucide-vue-next";

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimeRecordForm;
    hideTimePeriods?: boolean;
    refreshTimeRecords?: boolean;
  }>(),
  {}
);

const router = useRouter();
const trStore = useTimeRecordStore();

const allCategoriesStore = useAllCategoriesStore();
const { fetchData } = allCategoriesStore;
const { data: allCategories, isFetching: isAllCategoriesFetching } =
  storeToRefs(allCategoriesStore);

const formOptions = reactive<{
  isSync?: boolean;
  isBind?: boolean;
  callback?: (code?: string) => void;
}>({
  callback: undefined,
  isSync: false,
  isBind: false,
});

const formSchema = toTypedSchema(
  yup.object({
    id: yup.number(),
    title: yup.string(),
    timePeriods: yup
      .array(
        yup.object({
          start: yup.date().required(),
          end: yup.date().required(),
        })
      )
      .required(),
    description: yup.string(),
    externalLink: yup.string().url(),
    code: yup.string().when("id", {
      is: (val: string) => {
        console.log("id", val);
        return !!val;
      },
      then: (s) => s.required("Código não é um campo opcional."),
      otherwise: (s) => s,
    }),
    category: yup.string(),
    timerSessionType: yup.string(),
    timerSessionFrom: yup.string(),
  })
);

const {
  handleSubmit,
  values: formValues,
  errors,
  setValues,
} = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    description: "",
    timerSessionType: "manual",
    timerSessionFrom: "browser",
    timePeriods: [],
  },
});

watch(
  () => formValues.code,
  (newValue) => {
    setValues({
      code: newValue?.replace(" ", "") || "",
    });
  }
);

/**
 * start: Category
 */

const categorySelectSearch = ref("");
const categorySelectIsOpen = ref(false);
const newCategories = ref<string[]>([]);

const categories = computed(() => {
  return [
    ...newCategories.value.map((c) => ({ name: c, id: -1 })),
    ...allCategories.value,
  ];
});

const isNewCategoryOnSelectSearch = computed(() => {
  return categories.value.every((c) => c.name != categorySelectSearch.value);
});

const categoryValue = computed({
  get: () => formValues.category,

  set: async (name) => {
    if (name == undefined) return;

    const search = categories.value.find((category) => category.name === name);

    if (!search) {
      newCategories.value = [name];
    }

    setValues({ category: name });
  },
});

const categoryIsDisabled = computed(() => {
  return isAllCategoriesFetching.value;
});

const handleCategory = async () => {
  if (
    (newCategories.value.length && formValues.category,
    formValues.category === newCategories.value[0])
  ) {
    const category = await categoryApi().post({ name: newCategories.value[0] });
    return category!.id;
  }

  if (formValues.category) {
    const category = allCategories.value.find(
      (category) => category.name === formValues.category
    );

    if (category) return category.id;
  }

  return null;
};

const clearCategoryIfClickAgain = (value: string) => {
  if (value === categoryValue.value) {
    setValues({ category: "" });
  }
};

/**
 * end: Category
 */

/**
 * start: Time Period
 */

const addButtonIsDisabled = computed(() => {
  const initialValue = true;

  const allHasValue = formValues.timePeriods?.reduce((acc, current) => {
    return !!current.start && !!current.end && acc;
  }, initialValue);

  return allHasValue === false;
});

const addTimePeriodToForm = () => {
  const start =
    formValues?.timePeriods?.length === 0
      ? new Date()
      : addMinutes(
          formValues.timePeriods![formValues.timePeriods!.length - 1].end,
          15
        );

  const end = addMinutes(start, 25);

  const timePeriods = [...(formValues.timePeriods ?? []), { start, end }];
  setValues({ timePeriods });
};

const deleteTimePeriodFromForm = (index: number) => {
  const timePeriods = formValues.timePeriods ? [...formValues.timePeriods] : [];
  timePeriods.splice(index, 1);
  setValues({ timePeriods });
};

/**
 * end: Time Period
 */

/**
 * start: Time Record
 */

const searchTrList = ref<SearchTimeRecordItem[]>([]);
const selectedTr = ref<SearchTimeRecordItem>();
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

const searchTrSelectAction = useDebounceFn(async (q: string = "") => {
  if (!searchTrList.value.some((tr) => tr.code == q)) {
    await searchTr(q);
  }
}, 1000);

/**
 * end: Time Record
 */

/**
 * start: Form
 */

const isFetching = ref(false);

const disableInputs = computed(() => {
  return isFetching.value;
});

const submitIsDisabled = computed(() => {
  if (formOptions.isBind && !formValues.id) return true;
  return isFetching.value;
});

const onSubmit = handleSubmit((value) => {
  const dto: TimeRecordSharedDto = {
    title: value.title || "",
    description: value.description || "",
    code: value.code,
    externalLink: value.externalLink,
    timerSessionType: value.timerSessionType,
    timerSessionFrom: value.timerSessionFrom,
  };

  value.id && isEditMode.value
    ? updateAction({ ...dto, id: value.id })
    : createAction({ ...dto, timePeriods: value.timePeriods });
});

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

/**
 * start: End
 */

/**
 * start: Http
 */

const createAction = async (dto: CreateTimeRecordDto) => {
  try {
    isFetching.value = true;
    const result = await postTimeRecord({
      ...dto,
      categoryId: await handleCategory(),
    });

    if (formOptions.callback) formOptions.callback(result?.code);

    closeModal(props.refreshTimeRecords);
    OkToast(_$t("createTimeRecordSuccess"));

    router.push({ name: "record", params: { code: result?.code } });
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetching.value = false;
  }
};

const updateAction = async (dto: UpdateTimeRecordDto) => {
  try {
    isFetching.value = true;

    if (isSyncMode.value && formValues.id) {
      await postTimePeriodList(formValues.id, {
        timePeriods:
          formValues.timePeriods?.map((tp) => ({
            start: new Date(tp.start),
            end: new Date(tp.end),
          })) || [],
        type: formValues.timerSessionType!,
        from: formValues.timerSessionFrom!,
      });

      if (formOptions.callback) formOptions.callback();
    } else {
      const result = await putTimeRecord({
        ...dto,
        id: formValues.id!,
        categoryId: await handleCategory(),
      });

      if (formOptions.callback) formOptions.callback(result?.code);
    }

    closeModal(props.refreshTimeRecords);

    OkToast(_$t("updateTimeRecordSuccess"));
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetching.value = false;
  }
};

/**
 * end: Http
 */

/**
 * start: Modal
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) {
    trStore.refetchData();
  }
};

/**
 * end: Modal
 */

onMounted(async () => {
  if (props.editObject) {
    setValues({
      id: props.editObject.id,
      title: props.editObject.title,
      description: props.editObject.description,
      category: props.editObject.category,
      code: props.editObject.code,
      externalLink: props.editObject.externalLink,
    });

    formOptions.callback = props.editObject.callback;
    formOptions.isSync = props.editObject.isSync;
    formOptions.isBind = props.editObject.isBind;

    if (!props.hideTimePeriods) {
      setValues({
        timePeriods: props.editObject.timePeriods.map((tp) => ({
          start: new Date(tp.start),
          end: new Date(tp.end),
        })),
      });
    }

    if (isSyncMode) {
      setValues({
        timerSessionType: props.editObject?.timerSessionType,
        timerSessionFrom: props.editObject?.timerSessionFrom,
      });

      await searchTrSelectAction();
    }
  }

  if (!isSyncMode.value) {
    fetchData(closeModal);
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        {{ "Tarefa" }}
        <Badge
          v-if="(isEditMode || isSyncMode) && props.editObject?.code"
          variant="outline"
        >
          {{ props.editObject?.code }}
        </Badge>
      </CardTitle>

      <CardDescription>
        Você pode agrupar e sincronizar o tempo registrado em nossos cronômetros
        em tarefas personalizadas.
      </CardDescription>

      <GCloseButton @close="closeModal" />
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-4">
        <template v-if="formOptions.isBind">
          <FormField name="id">
            <FormItem>
              <FormLabel>Tarefa</FormLabel>

              <FormControl>
                <Combobox v-model="selectedTr">
                  <FormControl>
                    <ComboboxAnchor as-child>
                      <ComboboxTrigger as-child>
                        <Button
                          variant="outline"
                          type="button"
                          class="w-full"
                          :disabled="isTrSearch || disableInputs"
                        >
                          <section class="flex w-full justify-between">
                            {{ selectedTr?.title || selectedTr?.code }}

                            <ChevronsUpDown
                              class="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                          </section>
                        </Button>
                      </ComboboxTrigger>
                    </ComboboxAnchor>
                  </FormControl>

                  <ComboboxList class="w-full">
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        :display-value="(val) => val.code"
                        class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10"
                        maxlength="20"
                        placeholder="Buscar..."
                        @update:modelValue="searchTrSelectAction($event)"
                      />

                      <span
                        class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <Search class="size-4 text-muted-foreground" />
                      </span>
                    </div>

                    <ComboboxEmpty> Nada encontrado. </ComboboxEmpty>

                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="tr in searchTrList"
                        :key="tr.id"
                        :value="tr"
                        @click="setValues({ id: tr.id })"
                      >
                        {{ tr.title }}

                        <ComboboxItemIndicator>
                          <Check :class="cn('ml-auto h-4 w-4')" />
                        </ComboboxItemIndicator>
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </Combobox>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </template>

        <section v-if="!hideTimePeriods" class="flex justify-between">
          <h3>{{ _$t("periods") }}</h3>

          <Button
            v-if="!isSyncMode"
            :disabled="addButtonIsDisabled || disableInputs"
            size="sm"
            type="button"
            @click="addTimePeriodToForm"
          >
            {{ _$t("add") }}
          </Button>
        </section>

        <section
          v-if="!hideTimePeriods && formValues.timePeriods"
          v-for="(_, index) in formValues.timePeriods"
          class="flex flex-row items-end gap-4 relative dark:border-gray-800 border-b-2 pb-3"
        >
          <FormField
            v-slot="{ componentField }"
            :name="`timePeriods[${index}].start`"
          >
            <FormItem>
              <FormLabel>{{ _$t("startOfPeriod") }}</FormLabel>
              <FormControl>
                <GDatePicker
                  v-bind="componentField"
                  :min="
                    index !== 0 ? formValues.timePeriods[index - 1].end : ''
                  "
                  :disabled="disableInputs || isSyncMode"
                  class="py-1"
                  @change="formValues.timePeriods[index].end = $event"
                />
              </FormControl>
            </FormItem>
            <FormMessage />
          </FormField>

          <FormField
            v-slot="{ componentField }"
            :name="`timePeriods[${index}].start`"
          >
            <FormItem>
              <FormLabel>{{ _$t("endOfPeriod") }}</FormLabel>
              <FormControl>
                <GDatePicker
                  v-bind="componentField"
                  :min="formValues.timePeriods[index].start"
                  :disabled="disableInputs || isSyncMode"
                  class="py-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            v-if="!isSyncMode"
            :disabled="disableInputs"
            type="button"
            variant="outline"
            class="h-11 pb-1 mb-1"
            @click="deleteTimePeriodFromForm(index)"
          >
            <X />
          </Button>
        </section>

        <template v-if="!isSyncMode">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>{{ _$t("title") }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :disabled="disableInputs"
                  type="text"
                  maxlength="120"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel>{{ _$t("code") }}</FormLabel>

              <FormDescription>
                {{ _$t("codeFormDescription") }}
              </FormDescription>

              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  v-maska="{
										mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
										tokens: {
											X: {
												pattern: /[a-zA-Z0-9-]/,
												transform: (v: string) => v.toLowerCase(),
											},
										},
									}"
                  :disabled="disableInputs"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>{{ _$t("category") }}</FormLabel>

              <FormControl>
                <Combobox
                  v-bind="componentField"
                  v-model="categoryValue"
                  :open="categorySelectIsOpen"
                  class="w-full"
                  by="label"
                  @update:open="categorySelectIsOpen = $event"
                >
                  <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                      <Button
                        variant="outline"
                        type="button"
                        class="w-full"
                        :disabled="categoryIsDisabled || disableInputs"
                      >
                        <section class="flex w-full justify-between">
                          {{ categoryValue || "Selecionar" }}

                          <ChevronsUpDown
                            class="ml-2 h-4 w-4 shrink-0 opacity-50"
                          />
                        </section>
                      </Button>
                    </ComboboxTrigger>
                  </ComboboxAnchor>

                  <ComboboxList class="w-full">
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        v-model="categorySelectSearch"
                        maxlength="20"
                        class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10"
                        placeholder="Buscar..."
                      />

                      <span
                        class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <Search class="size-4 text-muted-foreground" />
                      </span>
                    </div>

                    <ComboboxEmpty>
                      <section class="flex flex-col gap-2 items-center">
                        <span>
                          Nenhuma categoria... <br />
                          Clique abaixo para criar:
                        </span>

                        <Button
                          type="button"
                          variant="link"
                          @click="
                            categorySelectIsOpen = false;
                            categoryValue = categorySelectSearch;
                          "
                        >
                          "{{ categorySelectSearch }}"
                        </Button>
                      </section>
                    </ComboboxEmpty>

                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="category in categories"
                        :key="category.name"
                        :value="category.name"
                        @click="clearCategoryIfClickAgain(category.name)"
                      >
                        {{ category.name }}

                        <ComboboxItemIndicator>
                          <Check :class="cn('ml-auto h-4 w-4')" />
                        </ComboboxItemIndicator>
                      </ComboboxItem>

                      <ComboboxItem
                        v-if="
                          isNewCategoryOnSelectSearch && categorySelectSearch
                        "
                        :value="categorySelectSearch"
                      >
                        <span class="flex gap-2">
                          <PenLine /> Criar: "{{ categorySelectSearch }}"
                        </span>
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </Combobox>
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>{{ _$t("description") }}</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :disabled="disableInputs"
                  maxlength="240"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="externalLink">
            <FormItem>
              <FormLabel>{{ _$t("externalLink") }}</FormLabel>
              <FormDescription>
                {{ "Da sua tarefa ou alguma url que queira fixar." }}
              </FormDescription>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :disabled="disableInputs"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </template>

        <Button
          :disabled="submitIsDisabled"
          :loading="isFetching"
          class="w-full mt-2"
          type="submit"
        >
          <template #with-loading>
            {{
              isSyncMode
                ? formOptions.isBind
                  ? _$t("bind")
                  : _$t("sync")
                : _$t("send")
            }}
          </template>
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
