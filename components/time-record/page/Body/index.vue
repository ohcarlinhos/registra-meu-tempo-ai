<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const { state, isLoading, refresh } = getTimeRecordQuery();

const timeRecord = computed(() => {
  return state.value.data;
});

const title = computed(() => {
  return timeRecord.value?.title || "";
});

useHead({ title });

const actualTimeRecordId = computed(() => {
  return state.value.data?.id;
});

const refreshTimeRecord = async (code = "") => {
  const router = useRouter();

  if (code && code != route.params.code) {
    router.push({
      name: "record",
      params: {
        code,
      },
    });
  }

  refresh();
};

const updatedOn = ref<Date>();

const clearUpdatedOn = () => {
  updatedOn.value = undefined;
};

const setUpdatedOn = () => {
  updatedOn.value = new Date(Date.now());
};

defineEmits<{
  delete: [value: number];
}>();

import { getTimeRecordQuery } from "./utils/actions";

const links = computed(() => [
  {
    label: "Histórico",
    icon: "i-icon-park-outline-history",
    to: {
      name: "record",
      params: {
        code: route.params.code,
      },
      hash: "#page-nav",
    },
  },
  {
    label: "Resumo Diário",
    icon: "i-icon-park-outline-fire",
    to: {
      name: "record.statistic.day",
      params: {
        code: route.params.code,
      },
      hash: "#page-nav",
    },
  },
]);

const refreshTimePeriodCallback = async () => {
  setUpdatedOn();
  refreshTimeRecord();
};
</script>

<template>
  <section class="min-h-svh">
    <section class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-5 w-full">
      <section class="w-full md:col-span-8 md:mb-5">
        <TimeRecordPageHeader :time-record="timeRecord" :is-fetch="isLoading">
          <template #button>
            <TimeRecordButtonEdit
              v-if="actualTimeRecordId && timeRecord"
              :time-record="timeRecord"
              :callback="refreshTimeRecord"
            />
          </template>
        </TimeRecordPageHeader>
      </section>

      <section
        v-if="timeRecord"
        class="w-full col-span-1 md:col-span-6 lg:col-span-4"
      >
        <TimerDefault
          v-if="actualTimeRecordId && timeRecord"
          :id="actualTimeRecordId"
          :code="timeRecord.code"
          :title="timeRecord.title"
          :post-time-period-callback="refreshTimePeriodCallback"
        />
      </section>

      <section id="page-nav" class="w-full md:col-span-12 md:mb-5 pt-12">
        <UHorizontalNavigation
          :links="links"
          class="border-b border-gray-200 dark:border-gray-800"
        />
      </section>

      <section v-if="timeRecord" class="w-full md:col-span-12 md:mb-5">
        <slot
          v-bind="{
            actualTimeRecordId,
            isLoading,
            updatedOn,
            clearUpdatedOn,
            refreshTimePeriodCallback,
          }"
        ></slot>
      </section>
    </section>

    <section class="w-full" v-if="!timeRecord && !isLoading">
      <h2 class="text-2xl text-primary font-bold pb-3">
        {{ _$t("recordNotFound") }}
      </h2>

      <UButton @click="router.push({ name: 'record.panel' })" variant="soft">
        {{ _$t("backToRecordList") }}
      </UButton>
    </section>
  </section>
</template>
