<script lang="ts" setup>
const trStore = useTimeRecordStore();
const emit = defineEmits<{
  update: [value: number];
  delete: [value: number];
}>();

const computedPage = computed({
  get: () => {
    return trStore.apiRes?.page || 1;
  },
  set: async (page: number) => {
    await trStore.fetchTimeRecords(page, computedPerPage.value);
  },
});

const computedPerPage = computed({
  get: () => {
    return trStore.apiRes?.perPage || 8;
  },
  set: async (perPage: number) => {
    await trStore.fetchTimeRecords(1, perPage);
  },
});

const perPageList = ref([4, 8, 12]);

const columns = [
  { key: "timeRecordDate", label: "Data" },
  { key: "categoryName", label: "Categoria" },
  { key: "description", label: "Descrição" },
  { key: "formattedTime", label: "Tempo" },
  { key: "timePeriods", label: "Períodos" },
  { key: "actions" },
];

const items = (row: TimeRecordType) => [
  [
    {
      label: "Acessar",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => emit("update", row.id!),
    },
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

onMounted(async () => {
  await trStore.fetchTimeRecords();
});
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="trStore.timeRecordsTableData"
    :loading="trStore.fetching"
  >
    <template #timePeriods-data="{ row }">
      <TimeRecordTableColTimePeriod
        :timePeriods="(row as ITimeRecordTable).timePeriods"
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
    <UPagination
      v-if="trStore.apiRes && trStore.apiRes.totalPages > 1"
      class="mt-2"
      v-model="computedPage"
      :page-count="trStore.apiRes.perPage"
      :total="trStore.apiRes.totalItems"
      :disabled="trStore.fetching"
    />

    <div class="flex items-center gap-2">
      Itens por página:
      <USelect
        v-model="computedPerPage"
        :options="perPageList"
        :disabled="trStore.fetching"
      />
    </div>
  </div>
</template>
