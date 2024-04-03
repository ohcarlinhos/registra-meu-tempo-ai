<script lang="ts" setup>
const registroStore = useRegistroDeTempoStore();
const emit = defineEmits<{
  update: [value: number];
  delete: [value: number];
}>();

const columns = [
  { key: "registroDate", label: "Data" },
  { key: "categoriaNome", label: "Categoria" },
  { key: "descricao", label: "Descrição" },
  { key: "tempoFormatado", label: "Tempo" },
  { key: "periodos", label: "Períodos" },
  { key: "actions" },
];

const items = (row: RegistroDeTempoType) => [
  [
    {
      label: "Editar",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => emit("update", row.id!),
    },
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

onMounted(async () => {
  await registroStore.fetchRegistrosDeTempo();
});
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="registroStore.registrosDeTempoTable"
    :loading="registroStore.fetching"
  >
    <template #periodos-data="{ row }">
      <RegistroDeTempoTableColPeriodos
        :periodos="(row as IRegistroDeTempoTable).periodos"
        :label="(row as IRegistroDeTempoTable).periodosCountText || '0'"
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

