<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();

const columns = [
  { key: "start", label: "Início" },
  { key: "end", label: "Fim" },
  { key: "formattedTime", label: "Tempo" },
  { key: "actions" },
];

const timeRecordReq = ref<TimeRecordType>();
const timePeriodReq = ref<Pagination<TimePeriodType>>();
const tpReqFetching = ref(false);

const computedPage = computed({
  get: () => {
    return timePeriodReq.value?.page || 1;
  },
  set: async (page: number) => {
    await getTp(page, computedPerPage.value);
  },
});

const computedPerPage = computed({
  get: () => {
    return timePeriodReq.value?.perPage || 4;
  },
  set: async (perPage: number) => {
    await getTp(1, perPage);
  },
});

const perPageList = ref([4, 8, 12]);

const emit = defineEmits<{
  delete: [value: number];
}>();

const timePeriodFormatted = computed(() => {
  return timePeriodReq.value?.data.length
    ? timePeriodReq.value.data.map((p) => {
        return {
          ...p,
          start: format(p.start, "dd/MM/yyyy HH:mm:ss"),
          end: format(p.end, "dd/MM/yyyy HH:mm:ss"),
        };
      })
    : [];
});

const items = (row: TimeRecordType) => [
  [
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

const getTimeRecordData = async () => {
  const data = await getTimeRecordById(
    parseInt(route.params.id as string),
    true
  );

  if (data) timeRecordReq.value = data;

  await getTp();
};

const getTp = async (page = 1, perPage = 4) => {
  try {
    tpReqFetching.value = true;

    const data = await getTimePeriods(
      parseInt(route.params.id as string),
      page,
      perPage,
      true
    );

    if (data) timePeriodReq.value = data;
  } finally {
    tpReqFetching.value = false;
  }
};

onMounted(async () => {
  await getTimeRecordData();
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader small-title />

    <div v-if="timeRecordReq" class="flex flex-wrap gap-10">
      <div class="flex-1">
        <h2 class="text-2xl mb-2 font-bold">Salve seu tempo!</h2>
        <p>Continue a registrar períodos de tempo.</p>

        <TimerSimple
          :id="parseInt(route.params.id as string)"
          :callback="getTimeRecordData"
        />

        <!-- <h2 class="mb-2 mt-2 text-2xl font-bold">Anotações</h2>
        <p>// TODO: Ops</p> -->
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-2xl font-bold">{{ $t("g.infos") }}</h2>

        <UCard>
          <p><b>Categoria:</b> {{ timeRecordReq.categoryName || "Nenhuma" }}</p>
          <p><b>Descrição:</b> {{ timeRecordReq.description || "Nenhuma" }}</p>
        </UCard>

        <h2 class="mb-5 mt-5 text-2xl font-bold">Estatísticas</h2>

        <UCard>
          <p><b>Tempo Total:</b> {{ timeRecordReq.formattedTime }}</p>
          <p><b>Total de Períodos:</b> {{ timeRecordReq.timePeriodsCount }}</p>
        </UCard>
      </div>

      <div class="flex-1">
        <UContainer
          :ui="{
            base: 'flex flex-col md:flex-row justify-between gap-5',
            padding: 'pb-5 px-0 lg:px-0 sm:px-0',
          }"
        >
          <h2 class="text-2xl font-bold">{{ $t("g.time.periodList") }}</h2>

          <div class="flex gap-5 flex-row items-start mt-1">
            <UButton
              icon="i-heroicons-pencil-square-20-solid"
              label="Adicionar Período"
            />
          </div>
        </UContainer>

        <UCard>
          <UTable
            :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
            :columns="columns"
            :rows="timePeriodFormatted"
            :loading="false"
          >
            <template #timePeriod-data="{ row }">
              <TimeRecordTableColTimePeriod
                :time-periods="(row as ITimeRecordTable).timePeriods"
                :label="(row as ITimeRecordTable).timePeriodsCountText || '0'"
              />
            </template>

            <template #actions-data="{ row }">
              <div class="flex justify-end">
                <UDropdown :items="items(row)">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                  />
                </UDropdown>
              </div>
            </template>
          </UTable>

          <div class="flex justify-between items-end mt-3">
            <div>
              <UPagination
                v-if="timePeriodReq && timePeriodReq.totalPages > 1"
                v-model="computedPage"
                :page-count="timePeriodReq.perPage"
                :total="timePeriodReq.totalItems"
                :disabled="tpReqFetching"
              />
            </div>

            <div class="flex items-center gap-2">
              Itens por página:
              <USelect
                v-model="computedPerPage"
                :options="perPageList"
                :disabled="tpReqFetching"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<style></style>
