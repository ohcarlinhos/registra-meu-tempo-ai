<script lang="ts" setup>
const timerStore = useSimpleTimerStore();

const props = defineProps<{
  id: number;
  callback: () => Promise<void>;
}>();

const isRunning = computed(() => {
  const index = timerStore.timePeriods.findIndex(
    (p) => p.timeRecordId === props.id
  );
  return index != -1;
});

const currentPeriodo = computed(() => {
  const index = timerStore.timePeriods.findIndex(
    (p) => p.timeRecordId === props.id
  );
  return index != -1 ? timerStore.timePeriods[index] : null;
});

const interval = ref<NodeJS.Timeout | null>(null);

const setTimerInterval = () => {
  interval.value = setInterval(() => {
    timerStore.setFim(props.id);
  }, 1000);
};

const startTimer = () => {
  timerStore.start(props.id, props.callback);
  if (interval.value === null) setTimerInterval();
  else {
    clearInterval(interval.value);
    interval.value = null;
  }
};
</script>

<template>
  <div class="flex gap-3 py-4">
    <UButton
      :title="isRunning ? 'Finalizar' : 'Iniciar'"
      :color="isRunning ? 'green' : 'blue'"
      :icon="isRunning ? 'i-heroicons-check' : 'i-heroicons-play'"
      size="xs"
      @click="startTimer"
    />
    <div>
      <p>{{ currentPeriodo ? currentPeriodo.timerDisplay : "00:00" }}</p>
    </div>
  </div>
</template>

<style></style>
