<script lang="ts" setup>
import type { DeletePayloadEvent } from "./types";

const categoryStore = useCategoryStore();
const { deleteCategory, fetchData: fetchCategoryData } = categoryStore;
const { isPaginationFetch, paginationQuery, categoryTableData, apiRes } =
  storeToRefs(categoryStore);

defineEmits<{
  edit: [value: number];
  delete: [value: DeletePayloadEvent];
  create: [];
}>();

const modal = reactive({
  category: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
  },
});

const editCategoryObject = ref<CategoryForm>();

const columns = [{ key: "name", label: "Nome" }, { key: "actions" }];

const items = (row: CategoryMap) => [
  [
    {
      label: _$t("edit"),
      icon: "i-icon-park-outline-edit",
      click: () => openEditCategoryModal(row),
    },
    {
      label: _$t("delete"),
      icon: "i-icon-park-outline-delete-themes",
      click: async () => openConfirmDeleteModal({ id: row.id }),
    },
  ],
];

const closeModal = () => {
  modal.category = false;
  editCategoryObject.value = undefined;
};

const openEditCategoryModal = (category: CategoryMap) => {
  editCategoryObject.value = category;
  modal.category = true;
};

const deleteCategoryAction = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await deleteCategory(modal.confirmDelete.id);

    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  }
};

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (payload: DeletePayloadEvent) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
};

onMounted(() => {
  fetchCategoryData();
});
</script>

<template>
  <GPanelCol custom-class="w-full">
    <div class="flex justify-between gap-10">
      <GPanelTitle text="Categorias" />

      <div class="flex gap-5">
        <GSearchV2
          :pagination-query="paginationQuery"
          :is-pagination-fetch="isPaginationFetch"
          :fetch-data="fetchCategoryData"
        />

        <UButton
          icon="i-icon-park-outline-add"
          @click="modal.category = true"
        />
      </div>
    </div>

    <Card>
      <CardContent>
        <UTable
          :columns="columns"
          :rows="categoryTableData"
          :loading="isPaginationFetch"
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

        <GPaginationV2
          :page="apiRes?.page"
          :perPage="apiRes?.perPage"
          :totalPages="apiRes?.totalPages"
          :totalItems="apiRes?.totalItems"
          :pagination-query="paginationQuery"
          :is-pagination-fetch="isPaginationFetch"
          :fetch-data="fetchCategoryData"
          using-store
        />
      </CardContent>
    </Card>
  </GPanelCol>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    :text="_$t('confirmDeleteCategoryMessage')"
    :isFetch="isPaginationFetch"
    @confirm="deleteCategoryAction"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.category" prevent-close>
    <CategoryFormCreateAndUpdate
      :edit-object="editCategoryObject"
      @close="closeModal"
    />
  </UModal>
</template>
