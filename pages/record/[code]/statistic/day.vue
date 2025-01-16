<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.statistic.day" });
useHead({ title: "Resumos Diários" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPageBody #default="{ actualTimeRecordId, getIsFetch }">
      <StatisticDay
        :time-record-id="actualTimeRecordId"
        :is-fetch="getIsFetch"
      />
    </TimeRecordPageBody>
  </NuxtLayout>
</template>
