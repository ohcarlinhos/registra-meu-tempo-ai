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
  createOrUpdateCategory: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
    page: 1,
    perPage: 4,
  },
});

const editCategoryObject = ref<CategoryFormType | undefined>(undefined);

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

const items = (row: CategoryType) => [
  [
    {
      label: "Editar",
      icon: "i-icon-park-outline-edit",
      click: () => openEditCategoryModal(row),
    },
    {
      label: "Apagar",
      icon: "i-icon-park-outline-delete-themes",
      click: async () =>
        openConfirmDeleteModal({
          id: row.id,
          page: computedPage.value,
          perPage: computedPerPage.value,
        }),
    },
  ],
];

const closeModal = () => {
  modal.createOrUpdateCategory = false;
  editCategoryObject.value = undefined;
};

const openEditCategoryModal = (category: CategoryType) => {
  editCategoryObject.value = category;
  modal.createOrUpdateCategory = true;
};

const deleteCategoryFetching = ref(false);

const deleteCategoryAction = async () => {
  if (!modal.confirmDelete.id) return;

  deleteCategoryFetching.value = true;
  try {
    await categoryStore.delete(
      modal.confirmDelete.id,
      modal.confirmDelete.page,
      modal.confirmDelete.perPage
    );
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  } finally {
    deleteCategoryFetching.value = false;
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
          icon="i-icon-park-outline-search"
          autocomplete="off"
          :loading="categoryStore.fetching"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="computedSearch !== ''"
              color="gray"
              variant="link"
              icon="i-icon-park-outline-close-small"
              :padded="false"
              @click="computedSearch = ''"
            />
          </template>
        </UInput>

        <UButton
          icon="i-icon-park-outline-add"
          @click="modal.createOrUpdateCategory = true"
        />
      </div>
    </div>

    <UCard>
      <UTable
        :columns="columns"
        :rows="categoryStore.categoryTableData"
        :loading="categoryStore.fetching"
      >
        <template #actions-data="{ row }">
          <div class="flex justify-end">
            <UDropdown :items="items(row)">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-icon-park-outline-more-one"
              />
            </UDropdown>
          </div>
        </template>
      </UTable>

      <GPagination
        :page="categoryStore.apiRes?.page"
        :perPage="categoryStore.apiRes?.perPage"
        :totalPages="categoryStore.apiRes?.totalPages"
        :totalItems="categoryStore.apiRes?.totalItems"
        :store="categoryStore"
        :search
      />
    </UCard>
  </GPanelCol>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    :text="_$t('confirmDeleteCategoryMessage')"
    :fetching="deleteCategoryFetching"
    @confirm="deleteCategoryAction"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateCategory" prevent-close>
    <CategoryFormCreateAndUpdate
      :edit-object="editCategoryObject"
      @close="closeModal"
    />
  </UModal>
</template>
