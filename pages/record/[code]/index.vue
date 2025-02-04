<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record",
});
</script>

<template>
  <NuxtLayout name="panel-v2">
    <TimeRecordPageBody
      #default="{
        actualTimeRecordId,
        updatedOn,
        clearUpdatedOn,
        refreshTimePeriodCallback,
      }"
    >
      <ClientOnly>
        <HistoryDayList
          ref="historyTp"
          v-if="actualTimeRecordId"
          :time-record-id="actualTimeRecordId"
          :callback="refreshTimePeriodCallback"
          :updated-on="updatedOn"
          :clear-updated-on="clearUpdatedOn"
        />
      </ClientOnly>
    </TimeRecordPageBody>
  </NuxtLayout>
</template>

<style></style>
