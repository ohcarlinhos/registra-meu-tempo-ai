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
const rangeStatistic = ref<RangeStatistic>();
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

  getRangeStatistic(selectedDate.value, props.timeRecordId)
    .then((data) => {
      if (props.updatedOn && props.clearUpdatedOn) {
        props.clearUpdatedOn();
      }

      if (data) {
        rangeStatistic.value = data;
        mountInfoCardList();
      }
    })
    .finally(() => {
      isFetchStatistics.value = false;
    });
};

const mountInfoCardList = () => {
  const statistic = rangeStatistic.value;

  if (!statistic) return;

  const hourCards: CardType[] = [];

  hourCards.push({
    title: "Total",
    value: statistic.totalHours,
    obs: "Soma das horas registradas.",
    customClass: "md:col-span-2 md:row-span-2 h-full",
  });

  hourCards.push({
    title: "Registro Manual",
    value: statistic.manualHours,
    obs: `Qtd: ${statistic.manualCount}`,
    // cardRingStyle: `ring-1 dark:ring-yellow-500/80 ring-yellow-500/80`,
    valueStyle: "text-yellow-500",
  });

  hourCards.push({
    title: "Cronômetro",
    value: statistic.timerHours,
    obs: `Qtd: ${statistic.timerCount}`,
    valueStyle: "text-green-500",
    // cardRingStyle: `ring-1 dark:ring-primary-500/80 ring-primary-500/80`,
  });

  hourCards.push({
    title: "Pomodoro",
    value: statistic.pomodoroHours,
    obs: `Qtd: ${statistic.pomodoroCount}`,
    valueStyle: "text-red-500",
  });

  hourCards.push({
    title: "Break (Descanso)",
    value: statistic.breakHours,
    obs: `Qtd: ${statistic.breakCount}`,
    valueStyle: "text-blue-500",
  });

  infoCardList.value.push({
    title: "",
    cards: hourCards,
  });
};

var maxDate = ref(new Date(Date.now()));

const tableColumns: ColumnDef<unknown>[] = [
  {
    accessorKey: "day",
    header: () => h("span", ["Dia"]),
    cell: ({ cell }) => {
      const value = cell.getValue() as string;
      return h("div", { class: "font-semibold text-primary", title: value }, [
        value,
      ]);
    },
  },
  {
    accessorKey: "total",
    header: () => h("span", ["Tempo Total"]),
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
    accessorKey: "category",
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

  if (rangeStatistic.value?.timeRecordRangeProgress)
    rangeStatistic.value?.timeRecordRangeProgress.forEach((trp) => {
      timeRecordsTable.push({
        ...trp,
        code: trp.timeRecord.code || "-",
        title: trp.timeRecord.title || "Sem título",
        category: trp.timeRecord.categoryName || "-",
        day: trp.totalHours,
        total: trp.timeRecord.meta?.formattedTime,
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
      :description="'Estatísticas referentes à ' + referenceDate"
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

    <section v-else class="w-full items-start gap-5">
      <section
        v-for="(section, index) in infoCardList"
        :key="section.title"
        class="pb-4 flex flex-col gap-3"
      >
        <GSubTitlePage v-if="section.title" :title="section.title" />

        <section class="w-full grid md:grid-cols-4 items-start gap-4 md:gap-4">
          <div
            v-for="card in section.cards"
            class="text-center p-3 rounded-lg bg-primary/5 flex flex-col justify-center"
            :class="[card.customClass, card.cardRingStyle]"
          >
            <div class="text-xs text-muted-foreground">{{ card.title }}</div>

            <div class="text-2xl font-bold" :class="[card.valueStyle]">
              {{ card.value }}
            </div>

            <div class="text-xs text-muted-foreground">{{ card.obs }}</div>
          </div>

          <!-- <Card
            v-for="card in section.cards"
            class="flex items-center justify-center col-span-2 md:col-span-1"
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

                <span class="text-2xl font-bold" :class="[card.valueStyle]">
                  {{ card.value }}
                </span>

                <span
                  class="text-sm text-center dark:text-white dark:text-opacity-50 text-black text-opacity-70"
                >
                  {{ card.obs }}
                </span>
              </section>
            </CardContent>
          </Card> -->
        </section>

        <Separator class="mt-10" v-if="index + 1 < infoCardList.length" />
      </section>

      <section v-if="!timeRecordId" class="flex flex-col gap-5">
        <GSubTitlePage
          title="Tarefas"
          :description="
            'Horas registradas em tarefas referente à ' + referenceDate + '.'
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
