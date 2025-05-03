<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

import { History, Flame } from "lucide-vue-next";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

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

import { getTimeRecordQuery } from "./body/actions";

const links = computed(() => [
  {
    label: "Histórico de Registros",
    icon: History,
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
    icon: Flame,
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
    <section class="flex flex-col gap-10 md:gap-5 w-full">
      <section class="flex flex-col md:flex-row gap-10">
        <section class="w-full">
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

        <section v-if="timeRecord" class="max-md:w-full flex justify-center">
          <ClientOnly>
            <TimerDefault
              v-if="actualTimeRecordId && timeRecord"
              :id="actualTimeRecordId"
              :code="timeRecord.code"
              :title="timeRecord.title"
              :post-time-period-callback="refreshTimePeriodCallback"
            />

            <template #fallback>
              <div
                class="flex gap-5 flex-col w-[280px] md:w-[320px] items-center"
              >
                <Skeleton
                  class="w-[280px] md:w-[320px] h-[280px] md:h-[320px] rounded-full"
                />
              </div>
            </template>
          </ClientOnly>
        </section>
      </section>

      <section
        id="page-nav"
        class="w-full md:col-span-12 md:mb-5 pt-12 border-b border-gray-200 dark:border-gray-800"
      >
        <NavigationMenu>
          <NavigationMenuList class="flex gap-2">
            <NavigationMenuItem v-for="link in links">
              <NuxtLink
                v-slot="{ isActive, href, navigate }"
                :to="link.to"
                custom
              >
                <NavigationMenuLink
                  :active="isActive"
                  :href
                  :class="[
                    navigationMenuTriggerStyle(),
                    'data-[active]:border-b-2 data-[active]:border-green-400 rounded-b-none',
                  ]"
                  @click="navigate"
                >
                  <Component :is="link.icon" class="pr-1" />
                  {{ link.label }}
                </NavigationMenuLink>
              </NuxtLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      <section v-if="timeRecord" class="w-full md:col-span-12 md:mb-5">
        <slot
          v-bind="{
            actualTimeRecordId,
            isLoading,
            updatedOn,
            clearUpdatedOn,
            refreshTimePeriodCallback,
            timeRecord,
          }"
        ></slot>
      </section>
    </section>

    <section class="w-full" v-if="!timeRecord && !isLoading">
      <h2 class="text-2xl font-bold pb-3">
        {{ _$t("recordNotFound") }}
      </h2>

      <Button @click="router.push({ name: 'record.panel' })" variant="outline">
        ← {{ _$t("backToRecordList") }}
      </Button>
    </section>
  </section>
</template>
