<script lang="ts" setup>
export type DeletePayload = { id: number; page: number; perPage: number };

const trStore = useTimeRecordStore();
const emit = defineEmits<{
  access: [value: number];
  delete: [value: DeletePayload];
  create: [];
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;
  debounce.value = setTimeout(async () => {
    await trStore.fetchTimeRecords(1, computedPerPage.value, value, true);
  }, 1000);
};

const search = ref("");

const computedSearch = computed({
  get: () => {
    return search.value;
  },
  set: async (value: string) => {
    setDebounce(value);
  },
});

const computedPage = computed({
  get: () => {
    return trStore.apiRes?.page || 1;
  },
  set: async (page: number) => {
    await trStore.fetchTimeRecords(
      page,
      computedPerPage.value,
      search.value,
      true
    );
  },
});

const computedPerPage = computed({
  get: () => {
    return trStore.apiRes?.perPage || 4;
  },
  set: async (perPage: number) => {
    await trStore.fetchTimeRecords(1, perPage, search.value, true);
  },
});

const computedPerPageList = computed(() => {
  const list = [4, 8, 12];
  return list.filter((i) => (trStore.apiRes?.totalItems || 0) >= i);
});

const columns = [
  { key: "timeRecordDate", label: "Data" },
  { key: "code", label: "Código" },
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
      click: () => emit("access", row.id!),
    },
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () =>
        emit("delete", {
          id: row.id!,
          page: computedPage.value,
          perPage: computedPerPage.value,
        }),
    },
  ],
];

await trStore.fetchTimeRecords();
</script>

<template>
  <div class="flex-1">
    <UContainer
      :ui="{
        base: 'flex flex-col md:flex-row justify-between gap-5',
        padding: 'pb-5 px-0 lg:px-0 sm:px-0',
        constrained: 'max-w-8xl',
      }"
    >
      <h2 class="text-2xl font-bold">{{ $t("time.recordList") }}</h2>

      <div class="flex gap-5 flex-row items-start mt-1 mr-1">
        <UInput
          v-model="computedSearch"
          name="search"
          placeholder="Pesquisar"
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :loading="trStore.fetching"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="computedSearch !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="computedSearch = ''"
            />
          </template>
        </UInput>

        <UButton
          label="Criar"
          icon="i-heroicons-pencil-square-20-solid"
          @click="emit('create')"
        />
      </div>
    </UContainer>

    <UCard>
      <UTable
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
            :options="computedPerPageList"
            :disabled="trStore.fetching"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
