<script lang="ts" setup>
import { useTitle } from "@vueuse/core";

const timerStore = useTimerStore();
const authStore = useAuthStore();

const oldPageTitle = ref();

const { t } = useI18n();

watch(
  () => timerStore.formated,
  (newValue) => {
    if (!oldPageTitle.value) oldPageTitle.value = document.title;

    if (timerStore.isRunning) {
      useTitle(`${newValue} | ${oldPageTitle.value}`);
    }
  }
);

const props = defineProps({
  float: {
    type: Boolean,
    default: false,
  },
  optionsModal: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: null,
  },
  code: {
    type: String,
    default: null,
  },
  refreshTimeRecords: {
    type: Boolean,
    default: false,
  },
  postTimePeriodCallback: {
    type: Function,
    default: (code = "") => {},
  },
});

timerStore.initTimerConfig(props.id, props.float, props.code);

if (props.postTimePeriodCallback) {
  timerStore.setPostTimePeriodCallback(
    props.postTimePeriodCallback as PostTimePeriodCallback
  );
}

const modal = reactive({
  createTimeRecord: {
    open: false,
  },
  confirmPersistMethod: {
    open: false,
  },
  confirmStopTimer: {
    open: false,
  },
  timeRecordsTable: {
    open: false,
  },
});

const editTimeRecordObject = ref<TimeRecordForm>();

const startTimer = () => {
  timerStore.noSleep?.enable();
  timerStore.startTimer();
  timerStore.playClick();
};

const pauseTimer = () => {
  useTitle(oldPageTitle.value);

  timerStore.noSleep?.disable();
  timerStore.pauseTimer();
  timerStore.playClick();
};

const stopTimer = () => {
  timerStore.noSleep?.disable();
  timerStore.pauseTimer();
  timerStore.playClick();

  if (timerStore.isBreak) {
    stopTimerAction();
    return;
  }

  modal.confirmStopTimer.open = true;
};

const stopTimerAction = () => {
  useTitle(oldPageTitle.value);

  modal.confirmStopTimer.open = false;
  timerStore.stopTimer();
};

const submitTimePeriodFetching = ref(false);

const endTimer = () => {
  useTitle(oldPageTitle.value);

  timerStore.noSleep?.disable();
  timerStore.playClick();

  if (authStore.isAuth) {
    timerStore.pauseTimer();

    const timePeriods = [
      ...timerStore._currentTimePeriodList.map((t) => ({
        start: new Date(t.start),
        end: new Date(t.end),
      })),
    ];

    if (props.id) {
      submitTimePeriodFetching.value = true;

      return postTimePeriodList(props.id, timePeriods)
        .then(() => {
          timerStore.clearCurrentTimePeriodList();

          if (props.postTimePeriodCallback)
            props.postTimePeriodCallback(props.code);

          OkToast(_$t("successPeriodSync"));
        })
        .catch(() => {
          timerStore.endTimer();

          ErrorToast(_$t("errorPeriodSync"));
        })
        .finally(() => {
          submitTimePeriodFetching.value = false;
        });
    }

    editTimeRecordObject.value = timeRecordLocalToForm({ timePeriods }, () =>
      timerStore.clearCurrentTimePeriodList()
    );

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

const timerCardUi = computed(() => {
  const getColor = () => {
    if (timerStore.isPomodoro) return "red";
    if (timerStore.isBreak) return "blue";
    return "green";
  };

  return {
    base: `pt-3 relative w-full`,
    background: `dark:bg-${getColor()}-950 dark:bg-opacity-70`,
    ring: `ring-2 dark:ring-${getColor()}-500 ring-2 ring-${getColor()}-500`,
  };
});

const isFetching = computed(() => {
  return submitTimePeriodFetching.value || timerStore.fetching;
});
</script>

<template>
  <section
    class="flex flex-col gap-3 items-center"
    :class="[props.float ? 'fixed top-5 right-5 max-w-60 w-full' : 'relative']"
  >
    <TimerOptions v-if="timerStore.showOptions && !props.optionsModal" />

    <UCard :ui="timerCardUi">
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
                ? "para acabar o descanso..."
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
            v-if="!timerStore.isRunning"
            :title="
              timerStore.timePeriodsLength ? $t('continue') : $t('doStart')
            "
            :disabled="timerStore.isRunning || isFetching"
            color="blue"
            icon="i-icon-park-outline-play-one"
            @click="startTimer"
          />

          <UButton
            v-if="timerStore.isRunning"
            :disabled="!timerStore.isRunning || isFetching"
            :title="$t('pause')"
            color="yellow"
            icon="i-icon-park-outline-pause"
            @click="pauseTimer"
          />

          <UButton
            v-if="!timerStore.isBreak"
            :disabled="timerStore.dontHasMiliseconds || isFetching"
            :loading="isFetching"
            :title="$t('finish')"
            color="green"
            icon="i-icon-park-outline-hard-disk-one"
            @click="endTimer"
          />

          <UButton
            :disabled="timerStore.dontHasMiliseconds || isFetching"
            :title="$t('stop')"
            color="red"
            icon="i-icon-park-outline-close-small"
            @click="stopTimer"
          />
        </div>
      </div>

      <p v-if="props.code" class="text-center pt-5 text-sm opacity-50">
        Sincronizado com registro:

        <UBadge :color="getButtonColor" variant="soft" size="md">
          {{ props.code }}
        </UBadge>
      </p>
    </UCard>

    <UButton
      v-if="timerStore.totalItems >= 1"
      color="black"
      variant="link"
      @click="modal.timeRecordsTable.open = !modal.timeRecordsTable.open"
    >
      <template v-if="!id">
        Há {{ timerStore.totalItems }}
        {{
          timerStore.totalItems > 1 ? "registros locais." : "registro local."
        }}
      </template>

      <template v-else> Há registros não sincronizados.</template>
    </UButton>
  </section>

  <UModal
    v-model="timerStore._showOptions"
    v-if="timerStore.showOptions && props.optionsModal"
  >
    <h3 class="text-xl text-center pt-6">Qual modo deseja ativar?</h3>
    <GCloseButton @close="timerStore.toggleOptions" />
    <TimerOptions :float="props.optionsModal" />
  </UModal>

  <UModal v-model="modal.timeRecordsTable.open">
    <UCard v-if="modal.timeRecordsTable.open">
      <GCloseButton @close="modal.timeRecordsTable.open = false" />

      <TimeRecordTableLocal
        v-if="timerStore.totalItems"
        :refresh-time-records="refreshTimeRecords"
      />

      <p v-else class="py-3">
        {{
          id
            ? "Os períodos de tempo do seu registro estão sincronizados."
            : "Não há mais nenhum registro local."
        }}
      </p>
    </UCard>
  </UModal>

  <GModalConfirm
    v-model:open="modal.confirmPersistMethod.open"
    custom-width="sm:w-88"
    :title="$t('timer.persistModal.text')"
    :cancel-text="$t('timer.persistModal.browserButton')"
    :confirm-text="$t('timer.persistModal.accountButton')"
    @confirm="persistOnServer"
    @cancel="saveOnBrowser"
  />

  <GModalConfirm
    v-model:open="modal.confirmStopTimer.open"
    custom-width="sm:w-88"
    title="Deseja parar o cronômetro?"
    text="Ao confirmar o tempo registrado em seu pomodoro ou cronômetro será perdido."
    :cancel-text="$t('cancel')"
    :confirm-text="$t('confirm')"
    @cancel="modal.confirmStopTimer.open = false"
    @confirm="stopTimerAction"
  />

  <UModal v-model="modal.createTimeRecord.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      :refresh-time-records="refreshTimeRecords"
      @close="closeTimeRecordModal"
    />
  </UModal>
</template>
