<script lang="ts" setup>
defineProps<{
  timeRecord: TimeRecordMap;
}>();
</script>

<template>
  <UCard>
    <p class="text-lg pb-2">
      <span v-if="timeRecord.description" class="font-normal">
        {{ timeRecord.description }}
      </span>
      <span v-else class="font-normal">
        {{ _$t("emptyRecordDescription") }}
      </span>
    </p>

    <p v-if="timeRecord.categoryName" class="text-lg font-medium">
      {{ _$t("category") }}:
      <span class="font-normal">{{ timeRecord.categoryName }}</span>
    </p>

    <p v-if="timeRecord.externalLink" class="text-lg font-medium flex gap-2">
      {{ _$t("externalLink") }}:

      <span
        class="max-w-44 overflow-hidden inline-block overflow-ellipsis whitespace-nowrap"
      >
        <a
          :href="timeRecord.externalLink"
          target="_blank"
          class="underline hover:text-primary font-normal"
        >
          {{ timeRecord.externalLink }}
        </a>
      </span>
    </p>
  </UCard>
</template>
