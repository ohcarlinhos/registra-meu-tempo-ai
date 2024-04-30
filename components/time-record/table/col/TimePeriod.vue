<script lang="ts" setup>
defineProps<{
  timePeriods: TimePeriodType[];
  label: string;
}>();
</script>

<template>
  <div v-if="timePeriods.length === 0">
    <span>{{ label }}</span>
  </div>

  <div v-else class="flex">
    <UPopover mode="hover">
      <span>{{ label }}</span>

      <template #panel>
        <div class="p-4 flex flex-col gap-3">
          <div v-for="timePeriod in timePeriods">
            {{ formatTimePeriodPopper(timePeriod) }}
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
