<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import VueDatePicker from "@vuepic/vue-datepicker";

const model = defineModel<Date | string>();

defineProps({
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

  enableSeconds: {
    type: Boolean,
    default: false,
  },

  name: {
    type: String,
    default: "",
  },

  utc: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change"]);

watch(model, (value) => {
  emit("change", value);
});
</script>

<template>
  <VueDatePicker
    v-model="model"
    :is24="true"
    :action-row="{ showNow: true }"
    :min-date="min || ''"
    :max-date="max || ''"
    :time-picker="time"
    :enable-time-picker="disableTimePicker === false"
    :format="disableTimePicker ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'"
    :name="name"
    :dark="isDark"
    :enable-seconds
    :utc
    locale="pt-BR"
    select-text="Selecionar"
    cancel-text="Fechar"
    now-button-label="Agora"
  />
</template>

<style>
.dp__input {
  background-color: transparent;
  @apply h-11;
}
</style>
