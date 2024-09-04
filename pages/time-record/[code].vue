<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "time.record.page" });

const router = useRouter();
const historyTp = ref();

const emit = defineEmits<{
  delete: [value: number];
}>();

import {
  trReq,
  actualTimeRecordId,
  getTimeRecordData,
  getIsFetch,
} from "./code/actions";

const refreshTimePeriodCallback = async (refreshTp = false) => {
  if (refreshTp && historyTp.value) await historyTp.value.getData();
  await getTimeRecordData("", true);
};

onMounted(async () => {
  await getTimeRecordData();
});

onBeforeRouteLeave(() => {
  actualTimeRecordId.value = undefined;
  getIsFetch.value = true;
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh w-full lg:max-w-7xl',
    }"
  >
    <GHeader small-title />

    <section class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-5">
      <section class="w-full md:col-span-8 md:mb-5">
        <TimeRecordPageHeader :time-record="trReq" :is-fetch="getIsFetch">
          <template #button>
            <TimeRecordButtonEdit
              v-if="trReq"
              :time-record="trReq"
              :callback="getTimeRecordData"
            />
          </template>
        </TimeRecordPageHeader>
      </section>

      <section
        v-if="trReq"
        class="w-full col-span-1 md:col-span-6 lg:col-span-4"
      >
        <TimerDefault
          v-if="actualTimeRecordId"
          :id="actualTimeRecordId"
          :code="trReq.code"
          :title="trReq.title"
          :post-time-period-callback="() => refreshTimePeriodCallback(true)"
          options-modal
        />
      </section>

      <section v-if="trReq" class="w-full md:col-span-12 md:mb-5 mt-10">
        <UDivider />
      </section>

      <section v-if="trReq" class="w-full md:col-span-12 md:mb-5">
        <HistoryDatedTime
          ref="historyTp"
          v-if="actualTimeRecordId"
          :is-fetch="getIsFetch"
          :time-record-id="actualTimeRecordId"
          :callback="refreshTimePeriodCallback"
        />
      </section>
    </section>

    <section v-if="!trReq && !getIsFetch">
      <h2 class="text-2xl text-primary font-bold pb-3">
        {{ _$t("recordNotFound") }}
      </h2>

      <UButton
        @click="router.push({ name: 'time.record.list' })"
        variant="soft"
      >
        {{ _$t("backToRecords") }}
      </UButton>
    </section>
  </UContainer>
</template>

<style></style>
