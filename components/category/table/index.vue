<script lang="ts" setup>
import { CirclePlus, EllipsisVertical } from "lucide-vue-next";
import type { DeletePayloadEvent } from "./types";

const categoryStore = useCategoryStore();
const { fetchData: fetchCategoryData } = categoryStore;
const { isPaginationFetch, paginationQuery, tableData, apiRes } =
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
    name: "",
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
      click: async () => openConfirmDeleteModal({ id: row.id, name: row.name }),
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

const isDeleteFetch = ref(false);
const deleteCategoryAction = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    isDeleteFetch.value = true;
    await categoryStore.delete(modal.confirmDelete.id);

    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  } finally {
    isDeleteFetch.value = false;
  }
};

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
  modal.confirmDelete.name = "";
};

const openConfirmDeleteModal = async (payload: DeletePayloadEvent) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
  modal.confirmDelete.name = payload.name;
};

onMounted(() => {
  fetchCategoryData();
});
</script>

<template>
  <Card>
    <CardHeader class="flex-row gap-4 justify-between">
      <section class="flex flex-row gap-4 items-center">
        <CardTitle>{{ "Categorias" }}</CardTitle>

        <Button variant="outline" @click="modal.category = true">
          <CirclePlus />
          {{ "Criar" }}
        </Button>
      </section>

      <GSearchV2
        :pagination-query="paginationQuery"
        :pagination-query-methods="categoryStore"
        :is-pagination-fetch="isPaginationFetch"
        using-store
      />
    </CardHeader>

    <CardContent>
      <UTable :columns="columns" :rows="tableData" :loading="isPaginationFetch">
        <template #actions-data="{ row }">
          <div class="flex justify-end">
            <UDropdown :items="items(row)">
              <Button variant="outline" size="icon">
                <EllipsisVertical />
              </Button>
            </UDropdown>
          </div>
        </template>
      </UTable>

      <GPaginationV2
        :page="apiRes?.page"
        :per-page="apiRes?.perPage"
        :total-pages="apiRes?.totalPages"
        :total-items="apiRes?.totalItems"
        :pagination-query="paginationQuery"
        :pagination-query-methods="categoryStore"
        :is-pagination-fetch="isPaginationFetch"
        using-store
      />
    </CardContent>
  </Card>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    title="Deseja excluir essa categoria?"
    :text="`Ao confirmar a exclusão da categoria com nome &quot;${modal.confirmDelete.name}&quot;, todas as tarefas vinculadas ficarão sem categoria.`"
    :isFetch="isPaginationFetch || isDeleteFetch"
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
