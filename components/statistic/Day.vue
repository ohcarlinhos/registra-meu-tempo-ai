<script lang="ts" setup>
import { startOfDay } from "date-fns";

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
  updateTimeRecordPageBreadcrumb(props.timeRecord?.title);

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
    updateTimeRecordPageBreadcrumb(props.timeRecord?.title);
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
    title: "Horas",
    cards: hourCards,
  });

  const quantityCards: CardType[] = [];

  quantityCards.push({
    title: "Minutos",
    value: statistic.timePeriodCount,
    obs: "Tempo registrado contendo apenas a quantidade de minutos e dia.",
  });

  quantityCards.push({
    title: "Sessões",
    value: statistic.sessionCount,
    obs: 'Cada uso do "timer" é considerado como uma sessão.',
  });

  quantityCards.push({
    title: "Períodos",
    value: statistic.timePeriodCount,
    obs: "Gerados a cada clique em início e pausa.",
  });

  quantityCards.push({
    title: "Interrupções",
    value: statistic.interruptionCount,
    obs: "Soma do total de pausas durante sessões.",
  });

  infoCardList.value.push({
    title: "Quantitativo",
    cards: quantityCards,
  });

  if (props.timeRecordId) {
    return;
  }

  const recordCards: CardType[] = [];

  recordCards.push({
    title: "Criadas",
    value: statistic.createdTimeRecordCount,
    obs: "",
  });

  recordCards.push({
    title: "Atualizadas",
    value: statistic.updatedTimeRecordCount,
    obs: "",
  });

  infoCardList.value.push({
    title: "Tarefas",
    cards: recordCards,
  });
};

var maxDate = ref(new Date(Date.now()));
</script>

<template>
  <section class="flex flex-col gap-5 w-full">
    <section class="col-span-full">
      <section
        class="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start"
      >
        <section>
          <h2 class="text-4xl font-bold flex items-center gap-5">
            {{
              !timeRecordId && !hasFetch
                ? "Resumo Diário (Geral)"
                : "Resumo Diário"
            }}

            <GUpdatedOn
              v-if="updatedOn"
              :loading="hasFetch"
              :updated-on="updatedOn"
              :click-action="init"
            />
          </h2>
          <span>Estatísticas referentes ao dia selecionado.</span>
        </section>

        <div class="max-w-44">
          <UFormGroup label="Referência" name="date">
            <GDatePicker
              :modelValue="selectedDate"
              :disabled="hasFetch"
              :max-date="maxDate"
              disableTimePicker
              utc
              @update:modelValue="(e: string | Date | undefined) => e != undefined && (selectedDate = startOfDay(e))"
            />
          </UFormGroup>
        </div>
      </section>
    </section>

    <StatisticSkeleton v-if="hasFetch" />

    <section v-else class="w-full grid grid-cols-1 items-start gap-5">
      <section
        v-for="(section, index) in infoCardList"
        :key="section.title"
        class="pb-4"
      >
        <h3 class="text-2xl font-semibold pb-5">
          {{ section.title }}
        </h3>

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

                <span class="text-3xl font-bold" :class="[card.valueStyle]">{{
                  card.value
                }}</span>

                <span
                  class="text-sm text-center dark:text-white dark:text-opacity-50 text-black text-opacity-70"
                >
                  {{ card.obs }}
                </span>
              </section>
            </CardContent>
          </Card>
        </section>

        <UDivider class="pt-10" v-if="index + 1 < infoCardList.length" />
      </section>
    </section>
  </section>
</template>
