<script lang="ts" setup>
defineProps<{
  timeRecord?: TimeRecordMap;
  isFetch: boolean;
}>();
</script>

<template>
  <div v-if="isFetch" class="w-full flex flex-col gap-3 mt-2">
    <div class="flex flex-row w-full gap-3">
      <Skeleton class="h-9 w-[220px]" />
      <Skeleton class="h-9 w-[90px]" />
    </div>

    <Skeleton class="h-7 w-[180px]" />
    <Skeleton class="mt-4 h-7 w-full max-w-[400px]" />
    <Skeleton class="mt-4 h-20 w-full" />
  </div>

  <section v-else-if="timeRecord" class="w-full">
    <section
      class="flex md:flex-row gap-5 flex-col md:items-center items-start mb-5"
    >
      <h2 class="text-4xl font-bold">
        {{ timeRecord.title || _$t("noTitle") }}
      </h2>

      <slot name="button"></slot>
    </section>

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
  </section>
</template>
