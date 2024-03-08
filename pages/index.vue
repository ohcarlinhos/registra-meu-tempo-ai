<script lang="ts" setup>
const store = useTimerStore();

const columns = [
  { key: "titulo", label: "Título" },
  { key: "dataDoRegistro", label: "Data" },
  { key: "periodos", label: "Períodos" },
  { key: "actions" },
];
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-row items-center',
      constrained: 'min-h-svh max-w-xl',
    }"
  >
    <div class="flex flex-col">
      <div class="flex flex-col items-start">
        <div class="flex flex-col items-center">
          <ULink
            v-if="store.registrosDeTempo.length >= 2"
            to="/local"
            active-class="text-primary"
            inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            class="pb-3"
          >
            Veja seus {{ store.registrosDeTempo.length }} registros!
          </ULink>

          <TimerDefault class="pb-12" />
        </div>
      </div>

      <GeneralHeader />

      <UTable
        :ui="{ base: 'bg-neutral-900 rounded-md' }"
        :columns="columns"
        :rows="store.registrosDeTempoFormated"
      >
        <template #periodos-data="{ row }">
          <RegistroDeTempoPeriodosCol
            :periodos="(row as RegistroDeTempoType).periodos"
            :label="formatPeriodosLabel((row as RegistroDeTempoType).periodos.length)"
          />
        </template>
      </UTable>
    </div>
  </UContainer>
</template>
