<script setup lang="ts">
import { DatePicker as VDatePicker } from "v-calendar";

import "v-calendar/dist/style.css";

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: null,
  },
  min: {
    type: [Date, String],
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:model-value", value);
  },
});

const attrs = {
  transparent: false,
  borderless: true,
  is24hr: true,
  color: "primary",
  "is-dark": { selector: "html", darkClass: "dark" },
  "first-day-of-week": 2,
  "hide-time-header": true,
  // view: "weekly",
  "min-date": props.min,
};
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid" />
    <span class="pl-3 p-1">{{ date ? date.toLocaleString() : "Vazio" }}</span>

    <template #panel="{ close }">
      <div class="flex flex-col gap-1 pt-1">
        <UButton
          icon="i-heroicons-x-mark"
          label="Fechar Calendário"
          block
          variant="link"
          @click="close"
        />

        <VDatePicker
          v-model="date"
          v-bind="{ ...attrs, ...$attrs }"
          mode="dateTime"
        />
      </div>
    </template>
  </UPopover>
</template>

<style>
/* :root {
    --vc-gray-50: rgb(var(--color-gray-50));
    --vc-gray-100: rgb(var(--color-gray-100));
    --vc-gray-200: rgb(var(--color-gray-200));
    --vc-gray-300: rgb(var(--color-gray-300));
    --vc-gray-400: rgb(var(--color-gray-400));
    --vc-gray-500: rgb(var(--color-gray-500));
    --vc-gray-600: rgb(var(--color-gray-600));
    --vc-gray-700: rgb(var(--color-gray-700));
    --vc-gray-800: rgb(var(--color-gray-800));
    --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
    --vc-accent-50: rgb(var(--color-primary-50));
    --vc-accent-100: rgb(var(--color-primary-100));
    --vc-accent-200: rgb(var(--color-primary-200));
    --vc-accent-300: rgb(var(--color-primary-300));
    --vc-accent-400: rgb(var(--color-primary-400));
    --vc-accent-500: rgb(var(--color-primary-500));
    --vc-accent-600: rgb(var(--color-primary-600));
    --vc-accent-700: rgb(var(--color-primary-700));
    --vc-accent-800: rgb(var(--color-primary-800));
    --vc-accent-900: rgb(var(--color-primary-900));
} */
</style>
