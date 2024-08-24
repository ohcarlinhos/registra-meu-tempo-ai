<script lang="ts" setup>
defineProps<{
  periodList: TimePeriodMap[] | TimePeriodLocal[];
  label: string;
}>();
</script>

<template>
  <div v-if="periodList.length === 0">
    <span>{{ label }}</span>
  </div>

  <div v-else class="flex">
    <UPopover mode="hover">
      <span>{{ label }}</span>

      <template #panel>
        <div class="p-2 flex justify-center gap-2 max-w-40 flex-wrap">
          <UBadge
            v-for="timePeriod in periodList"
            :title="formatTimePeriodPopper(timePeriod).date"
            color="gray"
            variant="solid"
          >
            {{ formatTimePeriodPopper(timePeriod).formatted }}
          </UBadge>
        </div>
      </template>
    </UPopover>
  </div>
</template>
