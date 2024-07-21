<script lang="ts" setup>
const timerStore = useTimerStore();
const authStore = useAuthStore();
const { t } = useI18n();

const props = defineProps({
  float: {
    type: Boolean,
    default: false,
  },
});

timerStore.initTimerConfig(props.float);

const modal = reactive({
  createTimeRecord: {
    open: false,
  },
  confirmPersistMethod: {
    open: false,
  },
});

const editTimeRecordObject = ref<TimeRecordFormType>();

const startTimer = () => {
  clickSound.play();
  timerStore.startTimer();
};

const pauseTimer = () => {
  clickSound.play();
  timerStore.pauseTimer();
};

const endTimer = () => {
  clickSound.play();

  if (authStore.isAuthenticad) {
    timerStore.pauseTimer();

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
        timerStore.clearCurrentTimePeriodList();
      },
    };

    modal.confirmPersistMethod.open = true;
  } else {
    timerStore.endTimer();
  }
};

const persistOnServer = () => {
  modal.confirmPersistMethod.open = false;
  modal.createTimeRecord.open = true;
};

const saveOnBrowser = () => {
  timerStore.endTimer();
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

const getButtonColor = computed(() => {
  if (timerStore.isPomodoro) return "red";
  if (timerStore.isBreak) return "blue";
  return "green";
});

const showOptionsButtonUi = reactive({
  base: "absolute top-1 right-1",
});

const timerCardUiBase = computed(
  () =>
    `pt-3 ${props.float ? "fixed top-5 right-5 max-w-60 w-full" : "relative"}`
);
</script>

<template>
  <section>
    <TimerOptions v-if="timerStore.showOptions && !props.float" />

    <UModal
      v-model="timerStore._showOptions"
      v-if="timerStore.showOptions && props.float"
    >
      <h3 class="text-xl text-center pt-6">Qual modo quer ativar?</h3>
      <GCloseButton @close="timerStore.toggleOptions" />
      <TimerOptions :float="props.float" />
    </UModal>

    <UCard
      :ui="{
        base: timerCardUiBase,
        background: `dark:bg-${getButtonColor}-950 dark:bg-opacity-70`,
      }"
    >
      <UButton
        v-if="timerStore.showOptions"
        :ui="showOptionsButtonUi"
        title="Abrir"
        color="white"
        variant="ghost"
        icon="i-icon-park-outline-preview-open"
        @click="timerStore.toggleOptions"
      />

      <UButton
        v-else
        :ui="showOptionsButtonUi"
        title="Fechar"
        color="white"
        variant="ghost"
        icon="i-icon-park-outline-preview-close"
        @click="timerStore.toggleOptions"
      />

      <div class="flex flex-col gap-5 justify-center items-center">
        <section class="text-center">
          <h3 v-if="timerStore.dontHasMiliseconds" class="text-4xl font-bold">
            {{
              timerStore.isPomodoro || timerStore.isBreak
                ? timerStore.isPomodoro
                  ? timerStore.pomodoroPeiod + "m de foco"
                  : timerStore.breakPeiod + "m"
                : title
            }}
          </h3>

          <h3 v-else class="text-4xl font-bold">
            {{ timerStore.formated }}
          </h3>

          <p v-if="!timerStore.isRunning && timerStore.hasMiliseconds">
            Continuar?
          </p>

          <p v-else-if="timerStore.isPomodoro">
            {{
              timerStore.isRunning
                ? "até finalizar o Pomodoro."
                : "com seu Pomodoro?"
            }}
          </p>

          <p v-else-if="timerStore.isBreak">
            {{
              timerStore.isRunning
                ? "para acabar o descanço..."
                : "para descansar."
            }}
          </p>

          <p v-else-if="timerStore.isTimer">
            {{
              timerStore.isRunning ? "até o momento." : "Pronto para começar?"
            }}
          </p>
        </section>

        <div class="flex gap-3">
          <UButton
            :title="
              timerStore.timePeriodsLength
                ? $t('timer.buttons.continue')
                : $t('timer.buttons.start')
            "
            :disabled="timerStore.isRunning"
            color="blue"
            icon="i-icon-park-outline-play-one"
            @click="startTimer"
          />

          <UButton
            :disabled="!timerStore.isRunning"
            :title="$t('timer.buttons.pause')"
            color="yellow"
            icon="i-icon-park-outline-pause"
            @click="pauseTimer"
          />

          <UButton
            :disabled="timerStore.dontHasMiliseconds"
            :title="$t('timer.buttons.finish')"
            color="green"
            icon="i-icon-park-outline-hard-disk-one"
            @click="endTimer"
          />
        </div>
      </div>
    </UCard>
  </section>

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
