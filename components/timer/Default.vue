<script lang="ts" setup>
const timerStore = useTimerStore();

const getVariantBtn = (type: TimerType) =>
  timerStore.timerType == type ? "outline" : "solid";

const getColorBtn = (type: TimerType) =>
  timerStore.timerType == type ? "primary" : "white";

timerStore.off();
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-5 justify-center items-center">
      <div class="flex gap-4">
        <UButton
          label="Cronômetro"
          :variant="getVariantBtn('timer')"
          :color="getColorBtn('timer')"
          :disabled="timerStore.hasMiliseconds"
          @click="timerStore.setTimerType('timer')"
        />

        <UButton
          label="Pomodoro"
          :variant="getVariantBtn('pomodoro')"
          :color="getColorBtn('pomodoro')"
          :disabled="timerStore.hasMiliseconds"
          @click="timerStore.setTimerType('pomodoro')"
        />
      </div>

      <h3 class="text-6xl font-bold">{{ timerStore.formated }}</h3>

      <div class="flex gap-3">
        <UButton
          :title="timerStore.periodosLength ? 'Continuar' : 'Iniciar'"
          :disabled="timerStore.isRunning"
          color="blue"
          icon="i-heroicons-play"
          @click="timerStore.start"
        />

        <UButton
          :disabled="!timerStore.isRunning"
          title="Pausar"
          color="yellow"
          icon="i-heroicons-pause"
          @click="timerStore.pause"
        />

        <UButton
          :disabled="timerStore.dontHasMiliseconds"
          title="Finalizar"
          color="green"
          icon="i-heroicons-check"
          @click="timerStore.end"
        />
      </div>
    </div>
  </UCard>
</template>
