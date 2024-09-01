<script lang="ts" setup>
defineProps<{
  timeRecord: TimeRecordMap;
  isFetch: boolean;
}>();
</script>

<template>
  <div v-if="isFetch" class="w-full flex flex-col gap-3 mt-2">
    <div class="flex flex-row w-full gap-3">
      <USkeleton class="h-9 w-[220px]" />
      <USkeleton class="h-9 w-[90px]" />
    </div>
    <USkeleton class="h-7 w-[180px]" />
    <USkeleton class="mt-4 h-7 w-full max-w-[400px]" />
    <USkeleton class="mt-4 h-20 w-full" />
  </div>

  <div v-else class="w-full">
    <h2 class="text-4xl font-bold mb-1">
      {{ timeRecord.title || _$t("noTitle") }}

      <slot name="button"></slot>
    </h2>

    <p class="text-2xl pb-6 font-medium">
      Tempo total:
      <span class="text-primary font-bold">
        {{ timeRecord.meta?.formattedTime || _$t("none") }}
      </span>
    </p>

    <p v-if="timeRecord.code" class="text-lg font-medium pb-4">
      {{ _$t("code") }}:
      <span class="font-normal">{{ timeRecord.code }}</span>
    </p>

    <TimeRecordCardAbout :time-record="timeRecord" />
  </div>
</template>
