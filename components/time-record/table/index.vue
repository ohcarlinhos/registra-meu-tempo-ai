<script lang="ts" setup>
const timeRecordStore = useTimeRecordStore();
const emit = defineEmits<{
  update: [value: number];
  delete: [value: number];
}>();

const columns = [
  { key: "timeRecordDate", label: "Data" },
  { key: "categoryName", label: "Categoria" },
  { key: "description", label: "Descrição" },
  { key: "timeFormatted", label: "Tempo" },
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
  await timeRecordStore.fetchTimeRecords();
});
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="timeRecordStore.timeRecordsTableData"
    :loading="timeRecordStore.fetching"
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
</template>
