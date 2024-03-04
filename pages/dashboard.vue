<script lang="ts" setup>
import { format, getDay, getDayOfYear } from "date-fns";

const store = useRegistroDeTempoStore();

definePageMeta({ middleware: ["auth"] });

const modal = reactive({ isOpen: false });

const columns = [
  { key: "id", label: "Id" },
  { key: "titulo", label: "Título" },
  { key: "dataDoRegistro", label: "Data" },
  { key: "nomeDaCategoria", label: "Categoria" },
  { key: "tempoFormatado", label: "Tempo" },
  { key: "periodos", label: "Períodos" },
  { key: "actions" },
];

const items = (row: RegistroDeTempoType) => [
  [
    {
      label: "Editar",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => store.deleteRegistro(row.id),
    },
  ],
];

const formatPeriodoPopper = (periodo: PeriodoDeTempoType) => {
  const fullFormat = "dd/mm/yyyy HH:mm";
  const onlyTime = "HH:mm";
  const onlyDate = "dd/mm/yyyy";

  if (getDayOfYear(periodo.inicio) === getDayOfYear(periodo.fim)) {
    return (
      format(periodo.inicio, onlyTime) +
      " até " +
      format(periodo.fim, onlyTime) +
      " de " +
      format(periodo.inicio, onlyDate)
    );
  }

  return (
    format(periodo.inicio, fullFormat) +
    " até " +
    format(periodo.fim, fullFormat)
  );
};

onMounted(async () => {
  await store.fetchRegistrosDeTempo();
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

    <UTable
      :key="store.registrosDeTempo"
      :ui="{ base: 'bg-neutral-900 rounded-md' }"
      :columns="columns"
      :rows="store.registrosDeTempo"
      :loading="store.fetching"
    >
      <template #periodos-data="{ row }">
        <div v-if="(row as RegistroDeTempoType).periodos.length === 0">
          <span>{{ (row as RegistroDeTempoType).periodosCountText }}</span>
        </div>

        <div v-else class="flex">
          <UPopover mode="hover">
            <span>{{ (row as RegistroDeTempoType).periodosCountText }}</span>

            <template #panel>
              <div class="p-4 flex flex-col gap-3">
                <div v-for="periodo in (row as RegistroDeTempoType).periodos">
                  {{ formatPeriodoPopper(periodo) }}
                </div>
              </div>
            </template>
          </UPopover>
        </div>
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

    <UModal v-model="modal.isOpen" prevent-close>
      <DashboardRegistroDeTempoForm
        @close="modal.isOpen = false"
        @refresh="store.fetchRegistrosDeTempo"
      />
    </UModal>
  </UContainer>
</template>
