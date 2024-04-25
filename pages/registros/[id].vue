<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();

const columns = [
  { key: "inicio", label: "Início do Período" },
  { key: "fim", label: "Fim do Período" },
  { key: "actions" },
];

const registro = ref<RegistroType>();

const emit = defineEmits<{
  delete: [value: number];
}>();

const periodosFormatted = computed(() => {
  return registro.value
    ? registro.value?.periodos.map((p) => {
        return {
          ...p,
          inicio: format(p.inicio, "dd/MM/yyyy HH:mm:ss"),
          fim: format(p.fim, "dd/MM/yyyy HH:mm:ss"),
        };
      })
    : [];
});

const items = (row: RegistroType) => [
  [
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

onMounted(async () => {
  registro.value = (
    await getRegistroById(parseInt(route.params.id as string))
  ).value;
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-32',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader />

    <div v-if="registro" class="flex flex-wrap gap-10">
      <div class="flex-1">
        <h2 class="mb-5 text-3xl font-bold">Informações</h2>

        <p>Tempo Total: {{ registro.tempoFormatado }}</p>
        <p>Total de Períodos: {{ registro.periodosCount }}</p>
        <p v-if="registro.categoriaNome">
          Categoria: {{ registro.categoriaNome }}
        </p>
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-3xl font-bold">Períodos</h2>

        <UTable
          :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
          :columns="columns"
          :rows="periodosFormatted"
          :loading="false"
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
      </div>
    </div>
  </UContainer>
</template>

<style></style>
