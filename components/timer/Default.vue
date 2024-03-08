<script lang="ts" setup>
import { useTimerStore } from "~/composables/store/useTimerStore";

const store = useTimerStore();
</script>

<template>
  <div class="flex flex-col gap-5 justify-center items-center">
    <h3 class="text-6xl font-bold">{{ store.formated }}</h3>

    <div class="flex gap-3">
      <UButton
        :label="store.currentPeriodoList.length ? 'Continuar' : 'Iniciar'"
        :disabled="store.running"
        @click="store.start"
      />
      <UButton label="Parar" @click="store.pause" :disabled="!store.running" />
      <UButton label="Finalizar" @click="store.end" />
    </div>
  </div>
</template>
