<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();

const columns = [
  { key: "inicio", label: "Início" },
  { key: "fim", label: "Fim" },
  { key: "actions" },
];

const registro = ref<RegistroType>();
const periodos = ref<PeriodoType[]>([]);

const emit = defineEmits<{
  delete: [value: number];
}>();

const periodosFormatted = computed(() => {
  return periodos.value
    ? periodos.value?.map((p) => {
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

const getRegistroData = async () => {
  registro.value = (
    await getRegistroById(parseInt(route.params.id as string))
  ).value;

  periodos.value = (
    await getPeriodos(parseInt(route.params.id as string))
  ).value;
};

onMounted(async () => {
  await getRegistroData();
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader small-title />

    <div v-if="registro" class="flex flex-wrap gap-10">
      <div class="flex-1">
        <h2 class="text-2xl mb-2 font-bold">Salve seu tempo!</h2>
        <p>Continue a registrar períodos de tempo.</p>

        <TimerSimple
          :id="parseInt(route.params.id as string)"
          :callback="getRegistroData"
        />

        <!-- <h2 class="mb-2 mt-2 text-2xl font-bold">Anotações</h2>
        <p>// TODO: Ops</p> -->
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-2xl font-bold">Informações</h2>

        <UCard>
          <p><b>Categoria:</b> {{ registro.categoriaNome || "Nenhuma" }}</p>
          <p><b>Descrição:</b> {{ registro.descricao || "Nenhuma" }}</p>
        </UCard>

        <h2 class="mb-5 mt-5 text-2xl font-bold">Estatísticas</h2>

        <UCard>
          <p><b>Tempo Total:</b> {{ registro.tempoFormatado }}</p>
          <p><b>Total de Períodos:</b> {{ registro.periodosCount }}</p>
        </UCard>
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-2xl font-bold">Períodos de Tempo</h2>

        <UCard>
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
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<style></style>
