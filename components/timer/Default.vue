<script lang="ts" setup>
const timerStore = useTimerStore();
const authStore = useAuthStore();
const { t } = useI18n();

timerStore.validateAndConfigure();

const chooseModal = reactive({
  open: false,
});

const end = () => {
  if (authStore.isAuthenticad) {
    timerStore.pause();
    chooseModal.open = true;
  } else {
    timerStore.end();
  }
};

const saveOnBrowser = () => {
  timerStore.end();
  chooseModal.open = false;
};

// TODO: finalizar isso aqui
const openRegisterTimerRecordModal = () => {};

const title = computed(() => {
  const titles = [
    t("timer.title.t1"),
    t("timer.title.t2"),
    t("timer.title.t3"),
  ];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
});
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-5 justify-center items-center">
      <h3 v-if="timerStore.dontHasMiliseconds" class="text-4xl font-bold">
        {{ title }}
      </h3>

      <h3 v-else class="text-4xl font-bold">
        {{ timerStore.formated }}
      </h3>

      <div class="flex gap-3">
        <UButton
          :title="timerStore.timePeriodsLength ? 'Continuar' : 'Iniciar'"
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
          @click="end"
        />
      </div>
    </div>
  </UCard>

  <GModalConfirm
    v-model:open="chooseModal.open"
    text="Tem certeza que quer excluir esse registro?"
    confirm-text="Salvar"
    cancel-text="Salvar no navegador"
    @confirm="openRegisterTimerRecordModal"
    @cancel="saveOnBrowser"
  />
</template>
