<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.statistic.day" });
useHead({ title: "Resumos Diários" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPageBody
      #default="{ actualTimeRecordId, updatedOn, clearUpdatedOn, timeRecord }"
    >
      <StatisticDay
        :time-record-id="actualTimeRecordId"
        :time-record="timeRecord"
        :updated-on="updatedOn"
        :clear-updated-on="clearUpdatedOn"
      />
    </TimeRecordPageBody>
  </NuxtLayout>
</template>
