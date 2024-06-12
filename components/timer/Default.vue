<script lang="ts" setup>
const timerStore = useTimerStore();
const authStore = useAuthStore();
const { t } = useI18n();

timerStore.validateAndConfigure();

const modal = reactive({
  createTimeRecord: {
    open: false,
  },
  confirmPersistMethod: {
    open: false,
  },
});

const editTimeRecordObject = ref<TimeRecordFormType>();

const end = () => {
  if (authStore.isAuthenticad) {
    timerStore.pause();

    editTimeRecordObject.value = {
      description: "",
      category: "",
      code: "",
      timePeriods: [
        ...timerStore._currentTimePeriodList.map((t) => ({
          start: new Date(t.start),
          end: new Date(t.end),
        })),
      ],
      callback: () => {
        timerStore.clearTimePeriodList();
      },
    };
    modal.confirmPersistMethod.open = true;
  } else {
    timerStore.end();
  }
};

const persistOnServer = () => {
  modal.confirmPersistMethod.open = false;
  modal.createTimeRecord.open = true;
};

const saveOnBrowser = () => {
  timerStore.end();
  modal.confirmPersistMethod.open = false;
};

const closeTimeRecordModal = () => {
  modal.createTimeRecord.open = false;
  editTimeRecordObject.value = undefined;
};

// TODO: finalizar isso aqui

const title = computed(() => {
  const titleList = [
    t("timer.title.t1"),
    t("timer.title.t2"),
    t("timer.title.t3"),
  ];

  const randomIndex = Math.floor(Math.random() * titleList.length);
  return titleList[randomIndex];
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
          :title="
            timerStore.timePeriodsLength
              ? $t('timer.buttons.continue')
              : $t('timer.buttons.start')
          "
          :disabled="timerStore.isRunning"
          color="blue"
          icon="i-heroicons-play"
          @click="timerStore.start"
        />

        <UButton
          :disabled="!timerStore.isRunning"
          :title="$t('timer.buttons.pause')"
          color="yellow"
          icon="i-heroicons-pause"
          @click="timerStore.pause"
        />

        <UButton
          :disabled="timerStore.dontHasMiliseconds"
          :title="$t('timer.buttons.finish')"
          color="green"
          icon="i-heroicons-check"
          @click="end"
        />
      </div>
    </div>
  </UCard>

  <GModalConfirm
    v-model:open="modal.confirmPersistMethod.open"
    custom-width="sm:w-88"
    :text="$t('timer.persistModal.text')"
    :cancel-text="$t('timer.persistModal.browserButton')"
    :confirm-text="$t('timer.persistModal.accountButton')"
    @confirm="persistOnServer"
    @cancel="saveOnBrowser"
  />

  <UModal v-model="modal.createTimeRecord.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeTimeRecordModal"
    />
  </UModal>
</template>
