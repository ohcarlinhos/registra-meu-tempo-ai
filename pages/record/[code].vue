<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record",
});

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
} from "./utils/actions";

const refreshTimePeriodCallback = async (refreshTp = false) => {
  if (refreshTp && historyTp.value) await historyTp.value.getData();
  await getTimeRecordData("", true);
};

onMounted(() => {
  getTimeRecordData();
});

onBeforeRouteLeave(() => {
  actualTimeRecordId.value = undefined;
  getIsFetch.value = true;
});
</script>

<template>
  <NuxtLayout name="panel">
    <section class="min-h-svh">
      <section class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-5 w-full">
        <section class="w-full md:col-span-8 md:mb-5">
          <TimeRecordPageHeader :time-record="trReq" :is-fetch="getIsFetch">
            <template #button>
              <TimeRecordButtonEdit
                v-if="actualTimeRecordId && trReq"
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
            v-if="actualTimeRecordId && trReq"
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

      <section class="w-full" v-if="!trReq && !getIsFetch">
        <h2 class="text-2xl text-primary font-bold pb-3">
          {{ _$t("recordNotFound") }}
        </h2>

        <UButton @click="router.push({ name: 'record.panel' })" variant="soft">
          {{ _$t("backToRecordList") }}
        </UButton>
      </section>
    </section>
  </NuxtLayout>
</template>

<style></style>
