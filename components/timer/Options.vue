<script lang="ts" setup>
import { Timer, Cherry, Bed } from "lucide-vue-next";

const timerStore = useTimerStore();

const props = defineProps({
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

  customPomodoroPeriod.value = value.toString();

  if (typeof value === "string" && value) {
    return timerStore.setPomoPeriod(parseInt(value), props.id);
  }

  if (typeof value === "number") {
    return timerStore.setPomoPeriod(value, props.id);
  }

  return timerStore.setPomoPeriod(timer.value.pomodoroPeriod || 25, props.id);
};

const setBreakPeriod = (value: number) => {
  return timerStore.setBreakPeriod(value, props.id);
};

const timer = computed(() => timerStore.getTimer(props.id));

const timerHasMilliseconds = computed(
  () => timerStore.getTotalMillisecondsPast(props.id) > 0
);

onMounted(() => {
  const timer = timerStore.getTimer(props.id);
  customPomodoroPeriod.value = timer.pomodoroPeriod.toString();
});
</script>

<template>
  <section class="flex flex-col items-center">
    <section class="flex gap-3 mb-3 justify-center">
      <Button
        :variant="
          isVariant(timer.type == 'timer', 'default', 'outline-default')
        "
        :disabled="timerHasMilliseconds"
        @click="timerStore.setTimerType('timer', id)"
      >
        <Timer /> {{ _$t("timerType") }}
      </Button>

      <Button
        :variant="isVariant(timer.type == 'pomodoro', 'red', 'outline-red')"
        :disabled="timerHasMilliseconds"
        @click="timerStore.setTimerType('pomodoro', id)"
      >
        <Cherry /> {{ _$t("pomodoro") }}
      </Button>

      <Button
        :variant="isVariant(timer.type === 'break', 'blue', 'outline-blue')"
        :disabled="timerHasMilliseconds"
        @click="timerStore.setTimerType('break', id)"
      >
        <Bed /> {{ _$t("break") }}
      </Button>
    </section>

    <section
      v-if="timer.type == 'pomodoro'"
      class="flex gap-3 items-center pt-2"
    >
      <p class="leading-1">{{ _$t("minutes") + ":" }}</p>

      <Button
        :variant="isVariant(timer.pomodoroPeriod === 25, 'red', 'outline-red')"
        :disabled="timerHasMilliseconds"
        size="icon"
        @click="setPomodoroPeriod(25)"
      >
        25
      </Button>

      <Button
        :variant="isVariant(timer.pomodoroPeriod === 50, 'red', 'outline-red')"
        :disabled="timerHasMilliseconds"
        size="icon"
        @click="setPomodoroPeriod(50)"
      >
        50
      </Button>

      <Input
        v-model="customPomodoroPeriod"
        :disabled="timerHasMilliseconds"
        class="w-16"
        type="number"
        min="0"
        step="1"
        @blur="setPomodoroPeriod(customPomodoroPeriod, false)"
      />
    </section>

    <section v-if="timer.type === 'break'" class="flex gap-3 items-center pt-2">
      <p class="leading-1">{{ _$t("minutes") + ":" }}</p>

      <Button
        :variant="isVariant(timer.breakPeriod === 5, 'blue', 'outline-blue')"
        :disabled="timerHasMilliseconds"
        size="icon"
        @click="setBreakPeriod(5)"
      >
        5
      </Button>

      <Button
        :variant="isVariant(timer.breakPeriod === 10, 'blue', 'outline-blue')"
        :disabled="timerHasMilliseconds"
        size="icon"
        @click="setBreakPeriod(10)"
      >
        10
      </Button>

      <Button
        :variant="isVariant(timer.breakPeriod === 15, 'blue', 'outline-blue')"
        :disabled="timerHasMilliseconds"
        size="icon"
        @click="setBreakPeriod(15)"
      >
        15
      </Button>
    </section>
  </section>
</template>
