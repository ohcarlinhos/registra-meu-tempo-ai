<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
const { refetchData } = useCategoryStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: CategoryForm;
  }>(),
  {}
);

const formCallback = ref<() => void>();

const formSchema = toTypedSchema(
  yup.object({
    id: yup.number(),
    name: yup.string().required(),
  })
);

const {
  handleSubmit,
  values: formValues,
  setValues,
} = useForm({
  validationSchema: formSchema,
});

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) refetchData();
};

const submitIsDisabled = computed(() => {
  return formValues.name === props.editObject?.name || isFetch.value;
});

const isFetch = ref(false);

const createAction = async (dto: CategoryDto) => {
  isFetch.value = true;

  try {
    await categoryApi().post(dto);

    if (formCallback.value) {
      formCallback.value();
    }

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const editAction = async (dto: CategoryDto) => {
  isFetch.value = true;

  try {
    await categoryApi().put(dto.id!, dto);

    if (formCallback.value) {
      formCallback.value();
    }

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const submitAction = async (value: CategoryDto) => {
  return props.editObject?.id ? editAction(value) : createAction(value);
};

const onSubmit = handleSubmit((value) => submitAction(value));

onMounted(async () => {
  if (props.editObject) {
    setValues({
      id: props.editObject.id,
      name: props.editObject.name,
    });

    formCallback.value = props.editObject.callback;
  }
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>{{ _$t("name") }}</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            :disabled="isFetch"
            maxlength="20"
            autofocus
          />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="submitIsDisabled" class="w-full mt-2">
      {{ props.editObject?.id ? $t("save") : $t("create") }}
    </Button>
  </form>
</template>
