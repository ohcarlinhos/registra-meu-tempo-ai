<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();

const columns = [
  { key: "start", label: "Início" },
  { key: "end", label: "Fim" },
  { key: "actions" },
];

const timeRecord = ref<TimeRecordType>();
const timePeriod = ref<TimePeriodType[]>([]);

const emit = defineEmits<{
  delete: [value: number];
}>();

const timePeriodFormatted = computed(() => {
  return timePeriod.value
    ? timePeriod.value?.map((p) => {
        return {
          ...p,
          start: format(p.start, "dd/MM/yyyy HH:mm:ss"),
          end: format(p.end, "dd/MM/yyyy HH:mm:ss"),
        };
      })
    : [];
});

const items = (row: TimeRecordType) => [
  [
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

const getTimeRecordData = async () => {
  timeRecord.value = (
    await getTimeRecordById(parseInt(route.params.id as string))
  ).value;

  timePeriod.value = (
    await getTimePeriods(parseInt(route.params.id as string))
  ).value;
};

onMounted(async () => {
  await getTimeRecordData();
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

    <div v-if="timeRecord" class="flex flex-wrap gap-10">
      <div class="flex-1">
        <h2 class="text-2xl mb-2 font-bold">Salve seu tempo!</h2>
        <p>Continue a registrar períodos de tempo.</p>

        <TimerSimple
          :id="parseInt(route.params.id as string)"
          :callback="getTimeRecordData"
        />

        <!-- <h2 class="mb-2 mt-2 text-2xl font-bold">Anotações</h2>
        <p>// TODO: Ops</p> -->
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-2xl font-bold">Informações</h2>

        <UCard>
          <p><b>Categoria:</b> {{ timeRecord.categoryName || "Nenhuma" }}</p>
          <p><b>Descrição:</b> {{ timeRecord.description || "Nenhuma" }}</p>
        </UCard>

        <h2 class="mb-5 mt-5 text-2xl font-bold">Estatísticas</h2>

        <UCard>
          <p><b>Tempo Total:</b> {{ timeRecord.timeFormatted }}</p>
          <p><b>Total de Períodos:</b> {{ timeRecord.timePeriodsCount }}</p>
        </UCard>
      </div>

      <div class="flex-1">
        <h2 class="mb-5 text-2xl font-bold">Períodos de Tempo</h2>

        <UCard>
          <UTable
            :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
            :columns="columns"
            :rows="timePeriodFormatted"
            :loading="false"
          >
            <template #timePeriod-data="{ row }">
              <TimeRecordTableColTimePeriod
                :time-periods="(row as ITimeRecordTable).timePeriods"
                :label="(row as ITimeRecordTable).timePeriodsCountText || '0'"
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
