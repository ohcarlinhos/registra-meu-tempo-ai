<script lang="ts" setup>
const timerStore = useTimerStore();

const props = defineProps({
  float: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: null,
  },
});

const customPomodoroPeriod = ref("");

watch(customPomodoroPeriod, (newValue) => {
  setPomodoroPeriod(newValue, false);
});

const setPomodoroPeriod = (value: number | string, clear = true) => {
  if (clear) customPomodoroPeriod.value = "";

  if (typeof value === "string" && value) {
    return timerStore.setPomoPeriod(parseInt(value), props.id);
  }

  if (typeof value === "number") {
    return timerStore.setPomoPeriod(value, props.id);
  }

  return timerStore.setPomoPeriod(timer.value.pomodoroPeriod || 25, props.id);
};

const setBreakPeriod = (value: number) => {
  return timerStore.setBreakPeiod(value, props.id);
};

const timer = computed(() => timerStore.getTimer(props.id));

const timerHasMiliseconds = computed(
  () => timerStore.getTotalMilisecondsPast(props.id) > 0
);

onMounted(() => {
  customPomodoroPeriod.value = timer.value.pomodoroPeriod.toString();
});
</script>

<template>
  <section
    class="mb-5"
    :class="{ 'flex flex-col items-center pt-6': props.float }"
  >
    <section class="flex gap-3 mb-3 justify-center">
      <UButton
        label="Pomodoro"
        :variant="isSolidOrSoftButton(timer.type == 'pomodoro')"
        :disabled="timerHasMiliseconds"
        color="red"
        icon="i-icon-park-outline-tomato"
        @click="timerStore.setTimerType('pomodoro', id)"
      />

      <UButton
        :variant="isSolidOrSoftButton(timer.type == 'timer')"
        :disabled="timerHasMiliseconds"
        label="Cronômetro"
        icon="i-icon-park-outline-timer"
        @click="timerStore.setTimerType('timer', id)"
      />

      <UButton
        :variant="isSolidOrSoftButton(timer.type === 'break')"
        :disabled="timerHasMiliseconds"
        label="Pausa"
        color="blue"
        icon="i-icon-park-outline-sleep-two"
        @click="timerStore.setTimerType('break', id)"
      />
    </section>

    <section
      v-if="timer.type == 'pomodoro'"
      class="flex gap-3 items-center pt-2"
    >
      <p class="leading-1">Minutos:</p>

      <UButton
        label="25"
        :variant="isSolidOrOutlineButton(timer.pomodoroPeriod === 25)"
        :disabled="timerHasMiliseconds"
        color="red"
        @click="setPomodoroPeriod(25)"
      />

      <UButton
        label="50"
        :variant="isSolidOrOutlineButton(timer.pomodoroPeriod === 50)"
        :disabled="timerHasMiliseconds"
        color="red"
        @click="setPomodoroPeriod(50)"
      />

      <UInput
        v-model="customPomodoroPeriod"
        :ui="{ base: 'w-16' }"
        :disabled="timerHasMiliseconds"
        type="number"
        min="0"
        step="1"
        @blur="setPomodoroPeriod(customPomodoroPeriod, false)"
      />
    </section>

    <section v-if="timer.type === 'break'" class="flex gap-3 items-center pt-2">
      <p class="leading-1">Minutos:</p>

      <UButton
        label="5"
        :variant="isSolidOrOutlineButton(timer.breakPeriod === 5)"
        :disabled="timerHasMiliseconds"
        color="blue"
        @click="setBreakPeriod(5)"
      />

      <UButton
        label="10"
        :variant="isSolidOrOutlineButton(timer.breakPeriod === 10)"
        :disabled="timerHasMiliseconds"
        color="blue"
        @click="setBreakPeriod(10)"
      />

      <UButton
        label="15"
        :variant="isSolidOrOutlineButton(timer.breakPeriod === 15)"
        :disabled="timerHasMiliseconds"
        color="blue"
        @click="setBreakPeriod(15)"
      />
    </section>
  </section>
</template>
