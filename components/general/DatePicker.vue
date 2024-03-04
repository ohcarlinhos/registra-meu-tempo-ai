<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import VDatePicker from "@vuepic/vue-datepicker";
import { set } from "date-fns";

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: "",
  },

  min: {
    type: [Date, String],
    default: "",
  },

  max: {
    type: [Date, String],
    default: "",
  },

  time: {
    type: Boolean,
    default: false,
  },

  disableTimePicker: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:model-value", "change"]);

const date = computed({
  get: () => props.modelValue,

  set: (value) => {
    if (props.disableTimePicker && value) {
      value = set(new Date(value), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    }
    emit("update:model-value", value);
    emit("change", value);
  },
});
</script>

<template>
  <VDatePicker
    v-model="date"
    :is24="true"
    :action-row="{ showNow: true }"
    :min-date="min || ''"
    :max-date="max || ''"
    :time-picker="time"
    :enable-time-picker="disableTimePicker === false"
    :teleport="true"
    :format="disableTimePicker ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'"
    locale="pt-BR"
    select-text="Selecionar"
    cancel-text="Fechar"
    now-button-label="Agora"
    dark
  />
</template>
