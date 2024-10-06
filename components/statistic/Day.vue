<script lang="ts" setup>
const infoCardList = ref<
  {
    title: string;
    cards: {
      title: string;
      principalValue: string;
      secondaryValue?: string;
      obs?: string;
    }[];
  }[]
>([]);

const selectedDate = ref<Date>();

onMounted(() => {
  selectedDate.value = new Date();
});

infoCardList.value.push(
  {
    title: "Horas",
    cards: [
      {
        title: "Total",
        principalValue: "4h 30m 6s",
        obs: "Soma de todos os períodos.",
      },
      {
        title: "Cronômetros",
        principalValue: "2h 6s",
        secondaryValue: "",
        obs: "Sessões: 6",
      },
      {
        title: "Pomodoros",
        principalValue: "2h",
        secondaryValue: "",
        obs: "Sessões: 4",
      },
      {
        title: "Break (Descanso)",
        principalValue: "30m",
        secondaryValue: "",
        obs: "Sessões: 6",
      },
    ],
  },

  {
    title: "Quantitativo",
    cards: [
      {
        title: "Sessões",
        principalValue: "10",
        obs: 'Cada uso do "timer" é considerada uma sessão.',
      },
      {
        title: "Períodos",
        principalValue: "8",
        obs: "Gerados a cada clique em início e pausa.",
      },
      {
        title: "Interrupções",
        principalValue: "9",
        obs: "Soma do total de pausas durante sessões.",
      },
    ],
  },

  {
    title: "Registros",
    cards: [
      {
        title: "Criados",
        principalValue: "2",
        obs: "",
      },
      {
        title: "Atualizados",
        principalValue: "3",
        obs: "",
      },
    ],
  }
);
</script>

<template>
  <section class="flex flex-col gap-5 w-full">
    <section class="col-span-full">
      <section class="flex items-center gap-5">
        <h3 class="text-4xl font-bold">{{ "Resumo Diário" }}</h3>

        <div class="max-w-44">
          <GDatePicker v-model="selectedDate" disableTimePicker />
        </div>
      </section>
    </section>

    <UDivider class="py-2" />

    <section class="w-full grid grid-cols-1 items-start gap-5">
      <section
        v-for="section in infoCardList"
        :key="section.title"
        class="pb-4"
      >
        <h3 class="text-2xl font-semibold pb-5">{{ section.title }}</h3>

        <section class="w-full grid grid-cols-4 items-start gap-4 md:gap-4">
          <UCard
            class="relative"
            v-for="card in section.cards"
            :key="card.title"
          >
            <section class="flex flex-col gap-2 items-center w-full h-full">
              <h3 class="text-xl">{{ card.title }}</h3>
              <span class="text-3xl font-bold">{{ card.principalValue }}</span>
              <span class="text-sm text-center">{{ card.obs }}</span>
            </section>
          </UCard>
        </section>

        <UDivider class="pt-10" />
      </section>
    </section>
  </section>
</template>
