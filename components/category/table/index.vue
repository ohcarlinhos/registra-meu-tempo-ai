<script lang="ts" setup>
import type { DeletePayload } from "./types";

const categoryStore = useCategoryStore();

const emit = defineEmits<{
  edit: [value: number];
  delete: [value: DeletePayload];
  create: [];
}>();

const debounce = ref();

const modal = reactive({
  createOrUpdateTimeRecord: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
    page: 1,
    perPage: 4,
  },
});

const editTimeRecordObject = ref<CategoryFormType | undefined>(undefined);

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;
  debounce.value = setTimeout(async () => {
    await categoryStore.fetch(1, computedPerPage.value, value, true);
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
    return categoryStore.apiRes?.page || 1;
  },
  set: async (page: number) => {
    categoryStore.fetch(page, computedPerPage.value, search.value);
  },
});

const computedPerPage = computed({
  get: () => {
    return categoryStore.apiRes?.perPage || 5;
  },
  set: async (perPage: number) => {
    categoryStore.fetch(1, perPage, search.value);
  },
});

const computedPerPageList = computed(() => {
  const list = [5, 10, 15];
  return list.filter((i) => (categoryStore.apiRes?.totalItems || 0) >= i);
});

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
        openConfirmDeleteModal({
          id: row.id!,
          page: computedPage.value,
          perPage: computedPerPage.value,
        }),
    },
  ],
];

const closeModal = () => {
  modal.createOrUpdateTimeRecord = false;
  editTimeRecordObject.value = undefined;
};

const deleteCategory = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await categoryStore.delete(
      modal.confirmDelete.id,
      modal.confirmDelete.page,
      modal.confirmDelete.perPage
    );
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  }
};

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (payload: DeletePayload) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
  modal.confirmDelete.page = payload.page;
  modal.confirmDelete.perPage = payload.perPage;
};

await categoryStore.fetch();
</script>

<template>
  <GPanelCol custom-class="w-full">
    <div class="flex justify-between gap-10">
      <GPanelTitle text="Categorias" />

      <div class="flex gap-5">
        <UInput
          v-model="computedSearch"
          name="search"
          placeholder="Pesquisar"
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :loading="categoryStore.fetching"
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
          icon="i-heroicons-pencil-square-20-solid"
          @click="modal.createOrUpdateTimeRecord = true"
        />
      </div>
    </div>

    <UCard>
      <UTable
        :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
        :columns="columns"
        :rows="categoryStore.categoryTableData"
        :loading="categoryStore.fetching"
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
          v-if="categoryStore.apiRes && categoryStore.apiRes.totalPages > 1"
          class="mt-2"
          v-model="computedPage"
          :page-count="categoryStore.apiRes.perPage"
          :total="categoryStore.apiRes.totalItems"
          :disabled="categoryStore.fetching"
        />

        <div v-if="computedPerPageList.length" class="flex items-center gap-2">
          Itens por página:
          <USelect
            v-model="computedPerPage"
            :options="computedPerPageList"
            :disabled="categoryStore.fetching"
          />
        </div>
      </div>
    </UCard>
  </GPanelCol>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteCategory"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateTimeRecord" prevent-close>
    <CategoryFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeModal"
    />
  </UModal>
</template>

