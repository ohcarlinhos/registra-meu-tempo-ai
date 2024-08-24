<script lang="ts" setup>
import type { DeletePayload } from "./types";

const categoryStore = useCategoryStore();

const emit = defineEmits<{
  edit: [value: number];
  delete: [value: DeletePayload];
  create: [];
}>();

const modal = reactive({
  createOrUpdateCategory: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
    page: 1,
    perPage: 4,
  },
});

const editCategoryObject = ref<CategoryForm>();

const columns = [{ key: "name", label: "Categoria" }, { key: "actions" }];

const items = (row: CategoryMap) => [
  [
    {
      label: "Editar",
      icon: "i-icon-park-outline-edit",
      click: () => openEditCategoryModal(row),
    },
    {
      label: "Apagar",
      icon: "i-icon-park-outline-delete-themes",
      click: async () => openConfirmDeleteModal({ id: row.id }),
    },
  ],
];

const closeModal = () => {
  modal.createOrUpdateCategory = false;
  editCategoryObject.value = undefined;
};

const openEditCategoryModal = (category: CategoryMap) => {
  editCategoryObject.value = category;
  modal.createOrUpdateCategory = true;
};

const deleteCategoryAction = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await categoryStore.delete(modal.confirmDelete.id);

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
};

await categoryStore.fetch();
</script>

<template>
  <GPanelCol custom-class="w-full">
    <div class="flex justify-between gap-10">
      <GPanelTitle text="Categorias" />

      <div class="flex gap-5">
        <GSearch
          :perPage="categoryStore.apiRes?.perPage"
          :store="categoryStore"
        />

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
        :loading="categoryStore.isFetch"
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
        :search="categoryStore.apiRes?.search"
        :store="categoryStore"
      />
    </UCard>
  </GPanelCol>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    :text="_$t('confirmDeleteCategoryMessage')"
    :isFetch="categoryStore.isFetch"
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
