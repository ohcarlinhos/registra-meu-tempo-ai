<script lang="ts" setup>
import * as yup from "yup";

const emit = defineEmits(["close", "refresh"]);
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    editObject?: TimePeriodFormType;
    timeRecordId: number;
  }>(),
  {}
);

const status = reactive({ fetch: false });

const form = reactive<TimePeriodFormType>({
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

const createAction = async () => {
  try {
    await postTimePeriod({
      timeRecordId: form.timeRecordId ? form.timeRecordId : props.timeRecordId,
      start: new Date(form.start),
      end: new Date(form.end),
    });

    if (form.callback) form.callback();

    closeModal(true);
    OkToast(t("form.timePeriod.status.success.create"));
  } catch (error) {
    ErrorToast(error);
  }
};

const editAction = async (id: number) => {
  try {
    await putTimePeriod(id, {
      timeRecordId: form.timeRecordId ? form.timeRecordId : props.timeRecordId,
      start: new Date(form.start),
      end: new Date(form.end),
    });

    if (form.callback) form.callback();

    closeModal(true);
    OkToast(t("form.timePeriod.status.success.update"));
  } catch (error) {
    ErrorToast(error);
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
</script>

<template>
  <UCard>
    <template #header>
      <h2>{{ $t("time.period") }}</h2>
      <GCloseButton @close="closeModal" />
    </template>

    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <div class="flex gap-4 relative">
        <UFormGroup :label="$t('form.timeRecord.period.start')" name="start">
          <GDatePicker
            v-model="form.start"
            class="py-1"
            @change="form.end = $event"
          />
        </UFormGroup>

        <UFormGroup :label="$t('form.timeRecord.period.end')" name="end">
          <GDatePicker v-model="form.end" :min="form.start" class="py-1" />
        </UFormGroup>
      </div>

      <UButton
        :loading="status.fetch"
        :label="$t('g.send')"
        block
        type="submit"
      />
    </UForm>
  </UCard>
</template>
