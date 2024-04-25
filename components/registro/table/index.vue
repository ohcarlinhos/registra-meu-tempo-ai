<script lang="ts" setup>
const registroStore = useRegistroStore();
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

const items = (row: RegistroType) => [
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
  await registroStore.fetchRegistros();
});
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="registroStore.registrosTableData"
    :loading="registroStore.fetching"
  >
    <template #periodos-data="{ row }">
      <RegistroTableColPeriodos
        :periodos="(row as IRegistroTable).periodos"
        :label="(row as IRegistroTable).periodosCountText || '0'"
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
