<script lang="ts" setup>
import { CirclePlus } from "lucide-vue-next";
import type { DeletePayloadEvent } from "./table/types";
import { columns as tableColumns } from "./table/columns";
import { useEventBus } from "@vueuse/core";

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

const isMounted = ref(false);

const isLoading = computed(() => {
  return !isMounted.value || isPaginationFetch.value;
});

onMounted(() => {
  isMounted.value = true;
  fetchCategoryData();
});

const bus = useEventBus<CategoryTableBusEvent>(CATEGORY_TABLE_BUS_NAME);

const handleWithBus = (event: CategoryTableBusEvent) => {
  let category = event.data;

  if (event.action == "edit") {
    openEditCategoryModal(category);
  }

  if (event.action == "delete") {
    openConfirmDeleteModal({ id: category.id, name: category.name });
  }
};

bus.on(handleWithBus);

onBeforeUnmount(() => {
  bus.off(handleWithBus);
});
</script>

<template>
  <section class="flex flex-col gap-5">
    <GTitlePage
      title="Categorias"
      description="Gerencie suas categorias de tarefas."
    >
      <template #title-slot>
        <Button variant="outline" @click="modal.category = true">
          <CirclePlus />
          {{ "Criar" }}
        </Button>
      </template>

      <GSearchV2
        :pagination-query="paginationQuery"
        :pagination-query-methods="categoryStore"
        :is-pagination-fetch="isLoading"
        using-store
      />
    </GTitlePage>

    <GDataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="isLoading"
    />

    <GPaginationV2
      :page="apiRes?.page"
      :per-page="apiRes?.perPage"
      :total-pages="apiRes?.totalPages"
      :total-items="apiRes?.totalItems"
      :pagination-query="paginationQuery"
      :pagination-query-methods="categoryStore"
      :is-pagination-fetch="isLoading"
      total-label="Categorias"
      using-store
    />
  </section>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    title="Deseja excluir essa categoria?"
    :description="`Ao confirmar a exclusão da categoria com nome &quot;${modal.confirmDelete.name}&quot;, todas as tarefas vinculadas ficarão sem categoria.`"
    :isFetch="isPaginationFetch || isDeleteFetch"
    @confirm="deleteCategoryAction"
    @cancel="closeConfirmDeleteModal"
  />

  <Dialog v-bind:open="modal.category" @update:open="!$event && closeModal()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ editCategoryObject?.id ? "Editar Categoria" : "Criar Categoria" }}
        </DialogTitle>
        <DialogDescription>
          Utilize categorias para filtrar mais facilidade suas tarefas.
        </DialogDescription>
      </DialogHeader>

      <CategoryFormCreateAndUpdate
        :edit-object="editCategoryObject"
        @close="closeModal"
      />
    </DialogContent>
  </Dialog>
</template>
