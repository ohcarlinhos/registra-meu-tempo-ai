<script lang="ts" setup>
import type { DeletePayloadEvent } from "./types";

const categoryStore = useCategoryStore();

const emit = defineEmits<{
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

const columns = [{ key: "name", label: "Categoria" }, { key: "actions" }];

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

const openConfirmDeleteModal = async (payload: DeletePayloadEvent) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
};

onMounted(() => {
  categoryStore.fetch();
});
</script>

<template>
  <GPanelCol custom-class="w-full">
    <div class="flex justify-between gap-10">
      <GPanelTitle text="Categorias" />

      <div class="flex gap-5">
        <GSearch :store="categoryStore" />

        <UButton
          icon="i-icon-park-outline-add"
          @click="modal.category = true"
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

  <UModal v-model="modal.category" prevent-close>
    <CategoryFormCreateAndUpdate
      :edit-object="editCategoryObject"
      @close="closeModal"
    />
  </UModal>
</template>
