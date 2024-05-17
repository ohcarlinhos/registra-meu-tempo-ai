<script lang="ts" setup>
import type { DeletePayload } from "./types";

const trCategory = useCategoryStore();

const emit = defineEmits<{
  edit: [value: number];
  delete: [value: DeletePayload];
  create: [];
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;
  debounce.value = setTimeout(async () => {
    await trCategory.fetchCategories(1, computedPerPage.value, value, true);
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
    return trCategory.apiRes?.page || 1;
  },
  set: async (page: number) => {
    trCategory.fetchCategories(page, computedPerPage.value, search.value);
  },
});

const computedPerPage = computed({
  get: () => {
    return trCategory.apiRes?.perPage || 5;
  },
  set: async (perPage: number) => {
    trCategory.fetchCategories(1, perPage, search.value);
  },
});

const perPageList = ref([5, 10, 15]);

const columns = [{ key: "name", label: "Categoria" }, { key: "actions" }];

const items = (row: TimeRecordType) => [
  [
    // {
    //   label: "Editar",
    //   icon: "i-heroicons-pencil-square-20-solid",
    //   click: () => emit("edit", row.id!),
    // },
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

await trCategory.fetchCategories();
</script>

<template>
  <GPanelCol class="w-1/3">
    <div class="flex justify-between gap-10">
      <GPanelTitle text="Categorias" />

      <div class="flex gap-5">
        <UInput
          v-model="computedSearch"
          name="search"
          placeholder="Pesquisar"
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :loading="trCategory.fetching"
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

        <!-- <UButton
          label="Cadastrar"
          icon="i-heroicons-pencil-square-20-solid"
          @click="emit('create')"
        /> -->
      </div>
    </div>

    <UCard>
      <UTable
        :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
        :columns="columns"
        :rows="trCategory.categoryTableData"
        :loading="trCategory.fetching"
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
          v-if="trCategory.apiRes && trCategory.apiRes.totalPages > 1"
          class="mt-2"
          v-model="computedPage"
          :page-count="trCategory.apiRes.perPage"
          :total="trCategory.apiRes.totalItems"
          :disabled="trCategory.fetching"
        />

        <div class="flex items-center gap-2">
          Itens por página:
          <USelect
            v-model="computedPerPage"
            :options="perPageList"
            :disabled="trCategory.fetching"
          />
        </div>
      </div>
    </UCard>
  </GPanelCol>
</template>
