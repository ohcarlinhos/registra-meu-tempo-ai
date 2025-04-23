<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { addMinutes, isBefore } from "date-fns";
import { useForm } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimePeriodForm;
    timeRecordId?: number;
  }>(),
  {}
);

const formSchema = toTypedSchema(
  yup.object({
    start: yup.string().required('O campo "Início" é obrigatório.'),
    end: yup.string().required('O campo "Fim" é obrigatório.'),
  })
);

const closeModal = (refresh = false) => {
  emit("close", refresh);
};

const {
  handleSubmit,
  values: formValues,
  setValues,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((value) => {
  return props.editObject?.id
    ? editAction(props.editObject.id, value.start, value.end)
    : createAction(value.start, value.end);
});

const isFetching = ref(false);

const createAction = async (start: string, end: string) => {
  isFetching.value = true;
  let submitIsOk = true;

  try {
    await postTimePeriod({
      timeRecordId: props.timeRecordId!,
      start: new Date(start),
      end: new Date(end),
    });

    OkToast(_$t("createTimePeriodSuccess"));
    closeModal(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && props.editObject?.callback) {
      props.editObject.callback();
    }

    isFetching.value = false;
  }
};

const editAction = async (id: number, start: string, end: string) => {
  isFetching.value = true;
  let submitIsOk = true;

  try {
    await putTimePeriod(id, {
      timeRecordId: props.timeRecordId!,
      start: new Date(start),
      end: new Date(end),
    });

    if (props.editObject?.callback) {
      props.editObject.callback();
    }

    OkToast(_$t("updateTimePeriodSuccess"));
    closeModal(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && props.editObject?.callback) {
      props.editObject.callback();
    }

    isFetching.value = false;
  }
};

const changeStart = (start: string) => {
  if (!formValues.end || isBefore(formValues.end, start)) {
    setValues({
      end: addMinutes(start, 10).toString(),
    });
  }
};

/**
 * Lifeclycle
 */

watch(
  () => props.editObject,
  (newObj) => {
    if (newObj) {
      const { start, end } = newObj;

      setValues({
        start: start.toString(),
        end: end.toString(),
      });
    }
  },
  {
    immediate: true,
  }
);

var dateMax = ref(addMinutes(Date.now(), 10));
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="flex gap-4 relative">
      <FormField v-slot="{ componentField }" name="start">
        <FormItem>
          <FormLabel>{{ _$t("startOfPeriod") }}</FormLabel>

          <FormControl>
            <GDatePicker
              class="py-1"
              :model-value="componentField.modelValue"
              @change="
                setValues({
                  start: $event,
                });
                changeStart($event);
              "
              :max="dateMax"
              :disabled="isFetching"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="end">
        <FormItem>
          <FormLabel>{{ _$t("endOfPeriod") }}</FormLabel>

          <FormControl>
            <GDatePicker
              class="py-1"
              :model-value="componentField.modelValue"
              @change="
                setValues({
                  end: $event,
                })
              "
              :min="formValues.start"
              :max="dateMax"
              :disabled="isFetching"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <Button :loading="isFetching" class="w-full mt-2" type="submit">
      <template #with-loading>
        {{ _$t("send") }}
      </template>
    </Button>
  </form>
</template>
