<script lang="ts" setup>
import type { RegistroDeTempo } from "~/classes/RegistroDeTempo";
import type { Categoria } from "~/classes/Categoria";

definePageMeta({ middleware: ["auth"] });

const modal = reactive({ isOpen: false });

const pageData = reactive<{
  registrosRows: RegistroDeTempo[];
  categorias: Categoria[];
}>({
  registrosRows: [],
  categorias: [],
});

const columns = [
  { key: "id", label: "Id" },
  { key: "titulo", label: "Título" },
  { key: "dataDoRegistro", label: "Data" },
  { key: "nomeDaCategoria", label: "Categoria" },
  { key: "tempoFormatado", label: "Tempo" },
];

onMounted(async () => {
  try {
    pageData.registrosRows = await getRegistrosDeTempo();
    pageData.categorias = await getCategorias();
  } catch (error) {
    useToast().add({ title: error as string, color: "red" });
  }
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-32',
      constrained: 'min-h-svh',
    }"
  >
    <GeneralHeader />

    <UContainer
      :ui="{
        base: 'flex justify-end',
        padding: 'pb-6 px-0 lg:px-0 sm:px-0',
      }"
    >
      <UButton label="Registrar Tempo" @click="modal.isOpen = true" />
    </UContainer>

    <Suspense>
      <UTable
        :ui="{ base: 'bg-neutral-900 rounded-md' }"
        :columns="columns"
        :rows="pageData.registrosRows"
      />
    </Suspense>

    <UModal v-model="modal.isOpen" prevent-close>
      <DashboardRegistroDeTempoForm
        :categorias="pageData.categorias"
        @close="modal.isOpen = false"
      />
    </UModal>
  </UContainer>
</template>
