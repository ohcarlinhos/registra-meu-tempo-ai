<script lang="ts" setup>
const title = computed(() => {
  return trReq.value?.title || "";
});

useHead({ title });

const router = useRouter();
const route = useRoute();
const historyTp = ref();

defineEmits<{
  delete: [value: number];
}>();

import {
  trReq,
  actualTimeRecordId,
  getTimeRecordData,
  getIsFetch,
} from "./utils/actions";

const links = computed(() => [
  {
    label: "Histórico",
    icon: "i-icon-park-outline-history",
    // to: `/record/${route.params.code}`,
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
        />
      </section>

      <section id="page-nav" class="w-full md:col-span-12 md:mb-5 pt-12">
        <UHorizontalNavigation
          :links="links"
          class="border-b border-gray-200 dark:border-gray-800"
        />
      </section>

      <section v-if="trReq" class="w-full md:col-span-12 md:mb-5">
        <slot
          v-bind="{ actualTimeRecordId, getIsFetch, refreshTimePeriodCallback }"
        ></slot>
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
</template>
