<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record",
});
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPageBody
      #default="{
        actualTimeRecordId,
        updatedOn,
        clearUpdatedOn,
        refreshTimePeriodCallback,
      }"
    >
      <HistoryDayList
        ref="historyTp"
        v-if="actualTimeRecordId"
        :time-record-id="actualTimeRecordId"
        :callback="refreshTimePeriodCallback"
        :updated-on="updatedOn"
        :clear-updated-on="clearUpdatedOn"
      />
    </TimeRecordPageBody>
  </NuxtLayout>
</template>

<style></style>
