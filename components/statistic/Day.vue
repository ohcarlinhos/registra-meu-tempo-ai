<script lang="ts" setup>
import { startOfDay } from "date-fns";

type CardType = {
  title: string;
  value: string | number;
  obs?: string;
  textStyle?: string;
  cardBackgroundStyle?: string;
  cardRingStyle?: string;
  customClass?: string;
  valueStyle?: string;
};

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
const isFetch = ref(false);

onMounted(() => {
  selectedDate.value = route.query.date
    ? startOfDay(new Date(route.query.date as string))
    : startOfDay(new Date());

  pushQuery();
});

watch(
  () => selectedDate.value,
  () => {
    pushQuery();
    init(true);
  }
);

const pushQuery = () => {
  router.push({ query: { date: selectedDate.value!.toISOString() } });
};

const init = (mounted = false) => {
  infoCardList.value = [];
  isFetch.value = true;

  getDayStatistic(selectedDate.value)
    .then((data) => {
      if (data) {
        dayStatistic.value = data;
        mountInfoCardList();
      }
    })
    .finally(() => {
      isFetch.value = false;
    });
};

const mountInfoCardList = () => {
  const statistic = dayStatistic.value;

  if (!statistic) return;

  const hourCards: CardType[] = [];

  hourCards.push({
    title: "Total",
    value: statistic.totalHours,
    obs: "Soma de todos os períodos de tempo.",
    customClass: "col-span-2 row-span-2 h-full",
    valueStyle: "text-5xl font-bold",
    cardRingStyle: `ring-2 dark:ring-gray-500 ring-gray-500`,
  });

  hourCards.push({
    title: "Cronômetros",
    value: statistic.totalTimerHours,
    obs: `Sessões: ${statistic.timerCount}`,
    cardBackgroundStyle: "dark:bg-primary-950 dark:bg-opacity-70",
    cardRingStyle: `ring-2 dark:ring-primary-500 ring-primary-500`,
  });

  hourCards.push({
    title: "Pomodoros",
    value: statistic.totalPomodoroHours,
    obs: `Sessões: ${statistic.pomodoroCount}`,
    cardBackgroundStyle: "dark:bg-red-950 dark:bg-opacity-70",
    cardRingStyle: `ring-2 dark:ring-red-500 ring-red-500`,
  });

  hourCards.push({
    title: "Break (Descanso)",
    value: statistic.totalBreakHours,
    obs: `Sessões: ${statistic.breakCount}`,
    cardBackgroundStyle: "dark:bg-blue-950 dark:bg-opacity-70",
    cardRingStyle: `ring-2 dark:ring-blue-500 ring-2 ring-blue-500`,
  });

  hourCards.push({
    title: "Períodos (Isolados)",
    value: statistic.totalIsolatedPeriodHours,
    obs: `Quantidade: ${statistic.isolatedPeriodCount}`,
    cardBackgroundStyle: "dark:bg-yellow-500 dark:bg-opacity-30",
    cardRingStyle: `ring-2 dark:ring-yellow-500 ring-yellow-500`,
  });

  infoCardList.value.push({
    title: "Horas",
    cards: hourCards,
  });

  const quantityCards: CardType[] = [];

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
      <section class="flex items-center gap-5">
        <h3 class="text-4xl font-bold">{{ "Resumo Diário" }}</h3>

        <div class="max-w-44">
          <GDatePicker
            :modelValue="selectedDate"
            :disabled="isFetch"
            :max-date="maxDate"
            disableTimePicker
            utc
            @update:modelValue="(e: string | Date) => selectedDate = startOfDay(e)"
          />
        </div>
      </section>
    </section>

    <UAlert
      icon="i-heroicons-outline-exclaimation-triangle"
      color="orange"
      variant="outline"
      title="Atenção usuário!"
      description="Essa página ainda está em testes e pode conter informações imprecisas."
    />

    <UDivider class="py-2" />

    <section
      v-if="isFetch"
      class="w-full grid grid-cols-4 items-start gap-4 md:gap-4"
    >
      <section class="col-span-full">
        <USkeleton class="h-8 w-32" />
      </section>

      <USkeleton
        class="col-span-2 row-span-2 h-full flex items-center justify-center"
      />

      <USkeleton class="h-44" />
      <USkeleton class="h-44" />
      <USkeleton class="h-44" />
      <USkeleton class="h-44" />

      <section class="col-span-full">
        <USkeleton class="h-8 w-44 mt-8" />
      </section>

      <USkeleton class="h-44" />
      <USkeleton class="h-44" />
      <USkeleton class="h-44" />
    </section>

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
          <UCard
            :ui="{
              background: card.cardBackgroundStyle,
              ring: card.cardRingStyle,
            }"
            class="min-h-44 flex items-center justify-center"
            :class="[card.customClass]"
            v-for="card in section.cards"
            :key="card.title"
          >
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
          </UCard>
        </section>

        <UDivider class="pt-10" v-if="index + 1 < infoCardList.length" />
      </section>
    </section>
  </section>
</template>
