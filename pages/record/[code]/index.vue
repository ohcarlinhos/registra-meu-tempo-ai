<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record",
});
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPageBody
      #default="{ actualTimeRecordId, getIsFetch, refreshTimePeriodCallback }"
    >
      <HistoryDayList
        ref="historyTp"
        v-if="actualTimeRecordId"
        :is-fetch="getIsFetch"
        :time-record-id="actualTimeRecordId"
        :callback="refreshTimePeriodCallback"
      />
    </TimeRecordPageBody>
  </NuxtLayout>
</template>

<style></style>
