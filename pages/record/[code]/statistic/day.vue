<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.statistic.day" });
useHead({ title: "Resumos Diários" });
</script>

<template>
  <NuxtLayout name="panel-v2">
    <TimeRecordPageBody
      #default="{ actualTimeRecordId, updatedOn, clearUpdatedOn }"
    >
      <StatisticDay
        :time-record-id="actualTimeRecordId"
        :updated-on="updatedOn"
        :clear-updated-on="clearUpdatedOn"
      />
    </TimeRecordPageBody>
  </NuxtLayout>
</template>
