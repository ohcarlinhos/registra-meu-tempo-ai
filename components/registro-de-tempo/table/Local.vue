<script lang="ts" setup>
const store = useTimerStore();

const columns = [
  { key: "titulo", label: "Título" },
  { key: "dataDoRegistro", label: "Data" },
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
      click: async () => console.log(row.id!),
    },
  ],
];
</script>

<template>
  <UTable
    :ui="{ base: 'bg-neutral-900 rounded-md' }"
    :columns="columns"
    :rows="store.registrosDeTempoFormated"
    class="pt-10"
  >
    <template #periodos-data="{ row }">
      <RegistroDeTempoTableColPeriodos
        :periodos="(row as RegistroDeTempoType).periodos"
        :label="formatPeriodosLabel((row as RegistroDeTempoType).periodos.length)"
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
</template>
