<script lang="ts" setup>
import { addMinutes } from "date-fns";
import { X } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { format } from "date-fns";

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    timeRecordId?: number;
    callback?: () => void;
  }>(),
  {}
);

const formSchema = toTypedSchema(
  yup.object({
    minutes: yup.array(yup.number().required()).required(),
    date: yup.date().required('O campo "Dia dos registros" é obrigatório.'),
    minutesToAdd: yup.number(),
  })
);

const {
  handleSubmit,
  values: formValues,
  setValues,
} = useForm({
  validationSchema: formSchema,
  initialValues: {
    date: new Date(Date.now()),
    minutes: [],
    minutesToAdd: 0,
  },
});

const onSubmit = handleSubmit((value) => {
  createAction({
    minutes: value.minutes,
    date: format(value.date, "yyyy-MM-dd"),
  });
});

const closeModal = (refresh = false) => {
  emit("close", refresh);
};

const isFetching = ref(false);

const createAction = async (dto: CreateTimeMinuteListDto) => {
  isFetching.value = true;
  let submitIsOk = true;

  try {
    await timeMinuteApi().post(dto, props.timeRecordId!);

    OkToast(_$t("createTimeMinuteSuccess"));
    closeModal(true);
  } catch (error) {
    submitIsOk = false;
    ErrorToast(error);
  } finally {
    if (submitIsOk && props.callback) props.callback();
    isFetching.value = false;
  }
};

const submitIsDisabled = computed(() => {
  return isFetching.value || !formValues.minutes?.length;
});

const removeMinutes = (index: number) => {
  const list = formValues?.minutes ? [...formValues.minutes] : [];
  list.splice(index, 1);

  setValues({
    minutes: list,
  });
};

const minutesToAddInput = useTemplateRef("minutesToAddInput");

const addMinutesToList = () => {
  if (!formValues?.minutesToAdd) return;

  setValues({
    minutes: formValues?.minutes
      ? [...formValues?.minutes, formValues?.minutesToAdd!]
      : [formValues?.minutesToAdd!],
    minutesToAdd: 0,
  });

  minutesToAddInput.value?.$el.focus();
};

var dateMax = ref(addMinutes(Date.now(), 10));
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField v-slot="{ componentField }" name="date">
      <FormItem>
        <FormLabel>{{ "Dia dos registros" }}</FormLabel>

        <FormControl>
          <GDatePicker
            :model-value="componentField.modelValue"
            @change="
              setValues({
                date: $event,
              })
            "
            :max="dateMax"
            :disabled="isFetching"
            disable-time-picker
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    </FormField>

    <section class="flex gap-3 items-end">
      <FormField v-slot="{ componentField }" name="minutesToAdd">
        <FormItem class="w-24">
          <FormLabel>{{ "Minutos" }}</FormLabel>

          <FormControl>
            <Input
              ref="minutesToAddInput"
              v-bind="componentField"
              :disabled="!formValues.date"
              type="number"
              min="0"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        :disabled="!formValues.date"
        type="button"
        variant="outline"
        class="h-10"
        @click="addMinutesToList"
      >
        {{ "Adicionar" }}
      </Button>
    </section>

    <Separator label="Minutos" />

    <section class="flex gap-2 pb-2">
      <Badge
        v-if="formValues.minutes?.length"
        v-for="(value, index) in formValues.minutes"
        variant="outline"
        class="border-yellow-500/80 py-1"
      >
        {{ value }}m

        <X
          :size="13"
          class="hover:cursor-pointer relative top-[1px] left-[3px]"
          @click="removeMinutes(index)"
        />
      </Badge>
    </section>

    <Button
      :disabled="submitIsDisabled"
      :loading="isFetching"
      class="w-full mt-2"
      type="submit"
    >
      <template #with-loading>
        {{ _$t("send") }}
      </template>
    </Button>
  </form>
</template>
