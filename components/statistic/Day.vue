<script lang="ts" setup>
import { NuxtLink } from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import { format, startOfDay } from "date-fns";

type CardType = {
  title: string;
  value: string | number;
  obs?: string;
  textStyle?: string;
  cardRingStyle?: string;
  customClass?: string;
  valueStyle?: string;
};

const props = defineProps<{
  timeRecordId?: number;
  timeRecord?: TimeRecordMap;
  isFetch?: boolean;
  updatedOn?: Date;
  clearUpdatedOn?: () => void;
}>();

const infoCardList = ref<
  {
    title: string;
    cards: CardType[];
  }[]
>([]);

const route = useRoute();
const router = useRouter();

const selectedDate = ref<Date>();
const dayStatistic = ref<DayStatistic>();
const isFetchStatistics = ref(false);

onMounted(() => {
  if (props.timeRecordId) {
    updateTimeRecordPageBreadcrumb(props.timeRecord?.title);
  }

  selectedDate.value = route.query.date
    ? startOfDay(new Date(route.query.date as string))
    : startOfDay(new Date());

  pushQuery();
});

watch(
  () => selectedDate.value,
  () => {
    pushQuery();
    init();
  }
);

watch(
  () => props.timeRecord?.title,
  () => {
    if (props.timeRecordId) {
      updateTimeRecordPageBreadcrumb(props.timeRecord?.title);
    }
  }
);

const hasFetch = computed(() => {
  return isFetchStatistics.value || props.isFetch;
});

const pushQuery = () => {
  router.replace({
    query: { date: selectedDate.value!.toISOString() },
    hash: route.hash,
  });
};

const init = async () => {
  infoCardList.value = [];
  isFetchStatistics.value = true;

  getDayStatistic(selectedDate.value, props.timeRecordId)
    .then((data) => {
      if (props.updatedOn && props.clearUpdatedOn) {
        props.clearUpdatedOn();
      }

      if (data) {
        dayStatistic.value = data;
        mountInfoCardList();
      }
    })
    .finally(() => {
      isFetchStatistics.value = false;
    });
};

const mountInfoCardList = () => {
  const statistic = dayStatistic.value;

  if (!statistic) return;

  const hourCards: CardType[] = [];

  hourCards.push({
    title: "Total",
    value: statistic.totalHours,
    obs: "Soma de todo tempo diário registrado.",
    customClass: "col-span-2 row-span-2 h-full",
    valueStyle: "text-5xl font-bold",
  });

  hourCards.push({
    title: "Manuais",
    value: statistic.totalTimeManual,
    obs: `Quantidade: ${statistic.manualCount}`,
    cardRingStyle: `ring-1 dark:ring-yellow-500/80 ring-yellow-500/80`,
  });

  hourCards.push({
    title: "Cronômetros",
    value: statistic.totalTimerHours,
    obs: `Sessões: ${statistic.timerCount}`,
    cardRingStyle: `ring-1 dark:ring-primary-500/80 ring-primary-500/80`,
  });

  hourCards.push({
    title: "Pomodoros",
    value: statistic.totalPomodoroHours,
    obs: `Sessões: ${statistic.pomodoroCount}`,
    cardRingStyle: `ring-1 dark:ring-red-500/80 ring-red-500/80`,
  });

  hourCards.push({
    title: "Break (Descanso)",
    value: statistic.totalBreakHours,
    obs: `Sessões: ${statistic.breakCount}`,
    cardRingStyle: `ring-1 dark:ring-blue-500/80 ring-1 ring-blue-500/80`,
  });

  infoCardList.value.push({
    title: "",
    cards: hourCards,
  });
};

var maxDate = ref(new Date(Date.now()));

const tableColumns: ColumnDef<unknown>[] = [
  {
    accessorKey: "formattedTime",
    header: () => h("span", ["Tempo"]),
  },
  {
    accessorKey: "title",
    header: () => h("span", ["Título"]),

    cell: ({ row }) =>
      h(
        NuxtLink,
        {
          to: {
            name: "record",
            params: { code: row.getValue("code") as string },
          },
          class: "hover:text-primary hover:underline",
        },
        () => [row.getValue("title")]
      ),
  },
  {
    accessorKey: "categoryName",
    header: () => h("span", ["Categoria"]),
  },
  {
    accessorKey: "code",
    header: () => h("span", ["Código"]),
    cell: ({ cell }) => {
      const value = cell.getValue() as string;
      return h("div", { class: "truncate max-w-[100px]", title: value }, [
        value,
      ]);
    },
  },
];

const tableData = computed(() => {
  const timeRecordsTable: unknown[] = [];

  if (dayStatistic.value?.timeRecordRangeProgress)
    dayStatistic.value?.timeRecordRangeProgress.forEach((trp) => {
      timeRecordsTable.push({
        ...trp,
        code: trp.timeRecord.code || "-",
        title: trp.timeRecord.title || "Sem título",
        categoryName: trp.timeRecord.categoryName || "-",
        formattedTime: trp.totalHours || "Nenhum",
      });
    });

  return timeRecordsTable;
});

const referenceDate = computed(() => {
  return selectedDate.value
    ? format(selectedDate.value, "dd/MM/yyyy")
    : format(new Date(), "dd/MM/yyyy");
});
</script>

<template>
  <section class="flex flex-col gap-5 w-full">
    <GTitlePage
      title="Resumo Diário"
      :description="'Estatísticas de tempo referentes ao dia ' + referenceDate"
    >
      <template #title-slot>
        <GUpdatedOn
          v-if="props.updatedOn"
          :loading="hasFetch"
          :updated-on="props.updatedOn"
          @click-action="init"
        />
      </template>

      <div class="max-w-44">
        <p class="text-sm font-medium leading-none pb-2">
          {{ "Referência" }}
        </p>

        <GDatePicker
          :modelValue="selectedDate"
          :disabled="hasFetch"
          :max-date="maxDate"
          disableTimePicker
          utc
          @update:modelValue="(e: string | Date | undefined) => e != undefined && (selectedDate = startOfDay(e))"
        />
      </div>
    </GTitlePage>

    <StatisticSkeleton v-if="hasFetch" />

    <section v-else class="w-full grid grid-cols-1 items-start gap-5">
      <section
        v-for="(section, index) in infoCardList"
        :key="section.title"
        class="pb-4 flex flex-col gap-3"
      >
        <GSubTitlePage v-if="section.title" :title="section.title" />

        <section class="w-full grid md:grid-cols-4 items-start gap-4 md:gap-4">
          <Card
            v-for="card in section.cards"
            class="min-h-44 flex items-center justify-center"
            :class="[card.customClass, card.cardRingStyle]"
            :key="card.title"
          >
            <CardContent>
              <section class="flex flex-col gap-2 items-center w-full h-full">
                <h3
                  class="text-xl dark:text-white dark:text-opacity-50 text-black text-opacity-70 text-center"
                >
                  {{ card.title }}
                </h3>

                <span class="text-3xl font-bold" :class="[card.valueStyle]">
                  {{ card.value }}
                </span>

                <span
                  class="text-sm text-center dark:text-white dark:text-opacity-50 text-black text-opacity-70"
                >
                  {{ card.obs }}
                </span>
              </section>
            </CardContent>
          </Card>
        </section>

        <Separator class="mt-10" v-if="index + 1 < infoCardList.length" />
      </section>

      <section v-if="!timeRecordId" class="flex flex-col gap-5">
        <GSubTitlePage
          title="Minhas Tarefas"
          :description="
            'Horas dedicadas em tarefa que tiveram registros de tempo no dia ' +
            referenceDate +
            '.'
          "
        />

        <GDataTable
          :columns="tableColumns"
          :data="tableData"
          :loading="isFetchStatistics"
        />
      </section>
    </section>
  </section>
</template>
