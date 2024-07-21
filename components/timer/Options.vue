<script lang="ts" setup>
const timerStore = useTimerStore();

const props = defineProps({
  float: {
    type: Boolean,
    default: false,
  },
});

const customPomodoroPeriod = ref("");

watch(customPomodoroPeriod, (newValue) => {
  setPomodoroPeriod(newValue, false);
});

customPomodoroPeriod.value = timerStore.pomodoroPeiod.toString();

const setPomodoroPeriod = (value: number | string, clear = true) => {
  if (clear) customPomodoroPeriod.value = "";

  if (typeof value === "string" && value) {
    return timerStore.setPomodoroPeiod(parseInt(value));
  }

  if (typeof value === "number") {
    return timerStore.setPomodoroPeiod(value);
  }

  return timerStore.setPomodoroPeiod(timerStore.pomodoroPeiod || 25);
};

const setBreakPeriod = (value: number) => {
  return timerStore.setBreakPeiod(value);
};
</script>

<template>
  <section
    class="mb-5"
    :class="{ 'flex flex-col items-center pt-6': props.float }"
  >
    <section class="flex gap-3 mb-3 justify-center">
      <UButton
        label="Pomodoro"
        :variant="isSolidOrSoftButton(timerStore.isPomodoro)"
        :disabled="timerStore.hasMiliseconds"
        color="red"
        icon="i-icon-park-outline-tomato"
        @click="timerStore.setTimerType('pomodoro')"
      />

      <UButton
        :variant="isSolidOrSoftButton(timerStore.isBreak)"
        :disabled="timerStore.hasMiliseconds"
        label="Pausa"
        color="blue"
        icon="i-icon-park-outline-sleep-two"
        @click="timerStore.setTimerType('break')"
      />

      <UButton
        :variant="isSolidOrSoftButton(timerStore.isTimer)"
        :disabled="timerStore.hasMiliseconds"
        label="Cronômetro"
        icon="i-icon-park-outline-timer"
        @click="timerStore.setTimerType('timer')"
      />
    </section>

    <section v-if="timerStore.isPomodoro" class="flex gap-3 items-center pt-2">
      <p class="leading-1">Minutos:</p>

      <UButton
        label="25"
        :variant="isSolidOrOutlineButton(timerStore.pomodoroPeiod === 25)"
        :disabled="timerStore.hasMiliseconds"
        color="red"
        @click="setPomodoroPeriod(25)"
      />

      <UButton
        label="50"
        :variant="isSolidOrOutlineButton(timerStore.pomodoroPeiod === 50)"
        :disabled="timerStore.hasMiliseconds"
        color="red"
        @click="setPomodoroPeriod(50)"
      />

      <UInput
        v-model="customPomodoroPeriod"
        :ui="{ base: 'w-16' }"
        :disabled="timerStore.hasMiliseconds"
        type="number"
        min="0"
        step="1"
        @blur="setPomodoroPeriod(customPomodoroPeriod, false)"
      />
    </section>

    <section v-if="timerStore.isBreak" class="flex gap-3 items-center pt-2">
      <p class="leading-1">Minutos:</p>

      <UButton
        label="5"
        :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 5)"
        :disabled="timerStore.hasMiliseconds"
        color="blue"
        @click="setBreakPeriod(5)"
      />

      <UButton
        label="10"
        :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 10)"
        :disabled="timerStore.hasMiliseconds"
        color="blue"
        @click="setBreakPeriod(10)"
      />

      <UButton
        label="15"
        :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 15)"
        :disabled="timerStore.hasMiliseconds"
        color="blue"
        @click="setBreakPeriod(15)"
      />
    </section>
  </section>
</template>
