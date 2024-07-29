<script lang="ts" setup>
const timerStore = useSimpleTimerStore();

const props = defineProps<{
  id: number;
  callback: (code?: string) => Promise<void>;
}>();

const isRunning = computed(() => {
  const index = timerStore.timePeriods.findIndex(
    (p) => p.timeRecordId === props.id
  );
  return index != -1;
});

const currentTimePeriod = computed(() => {
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
  clickSound.play();

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
      :title="isRunning ? 'Salvar' : 'Iniciar'"
      :color="isRunning ? 'green' : 'blue'"
      :icon="
        isRunning
          ? 'i-icon-park-outline-hard-disk-one'
          : 'i-icon-park-outline-play-one'
      "
      @click="startTimer"
    />
    <section>
      <p v-if="currentTimePeriod" class="text-2xl">
        Total: <b class="text-primary">{{ currentTimePeriod.timerDisplay }}</b>
      </p>
      <p v-else class="text-2xl">Começar?</p>
    </section>
  </div>
</template>

<style></style>
