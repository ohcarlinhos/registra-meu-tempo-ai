<script lang="ts" setup>
import { addMinutes, isBefore } from "date-fns";
import * as yup from "yup";

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: TimePeriodForm;
    timeRecordId?: number;
  }>(),
  {}
);

const form = reactive<TimePeriodForm>({
  timeRecordId: 0,
  id: undefined,
  start: "",
  end: "",
  callback: undefined,
});

const schema = yup.object({
  start: yup.string().required(),
  end: yup.string().required(),
});

const closeModal = (refresh = false) => {
  emit("close", refresh);
};

const submit = async () => {
  schema.validate(form).then(async () => {
    await submitAction();
  });
};

const isFetch = ref(false);

const createAction = async () => {
  isFetch.value = true;
  let submitIsOk = true;

  try {
    await postTimePeriod({
      timeRecordId: props.timeRecordId!,
      start: new Date(form.start),
      end: new Date(form.end),
    });

    OkToast(_$t("createTimePeriodSuccess"));
    closeModal(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && form.callback) form.callback();
    isFetch.value = false;
  }
};

const editAction = async (id: number) => {
  isFetch.value = true;

  try {
    await putTimePeriod(id, {
      timeRecordId: form.timeRecordId!,
      start: new Date(form.start),
      end: new Date(form.end),
    });

    if (form.callback) form.callback();

    OkToast(_$t("updateTimePeriodSuccess"));
    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
  }
};

const changeStart = (start: string) => {
  if (!form.end || isBefore(form.end, start)) form.end = addMinutes(start, 10);
};

const submitAction = async () => {
  return props.editObject?.id
    ? editAction(props.editObject.id)
    : createAction();
};

/**
 * Lifeclycle
 */

watch(
  () => props.editObject,
  (newObj) => {
    if (newObj) {
      form.id = newObj.id;
      form.start = newObj.start;
      form.end = newObj.end;
      form.timeRecordId = newObj.timeRecordId;
      form.callback = newObj.callback;
    }
  },
  {
    immediate: true,
  }
);

var dateMax = ref(addMinutes(Date.now(), 10));
</script>

<template>
  <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
    <div class="flex gap-4 relative">
      <UFormGroup :label="_$t('startOfPeriod')" name="start">
        <GDatePicker
          v-model="form.start"
          :disabled="isFetch"
          :max="dateMax"
          class="py-1"
          @change="changeStart"
        />
      </UFormGroup>

      <UFormGroup :label="_$t('endOfPeriod')" name="end">
        <GDatePicker
          v-model="form.end"
          :min="form.start"
          :max="dateMax"
          :disabled="isFetch"
          class="py-1"
        />
      </UFormGroup>
    </div>

    <UButton :loading="isFetch" :label="$t('send')" block type="submit" />
  </UForm>
</template>
