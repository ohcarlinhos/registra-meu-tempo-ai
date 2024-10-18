<script lang="ts" setup>
import { useTitle } from "@vueuse/core";

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  code: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  postTimePeriodCallback: {
    type: Function,
    default: (code = "") => {},
  },
});

const oldPageTitle = ref();
const { t } = useI18n();

const authStore = useAuthStore();
const timerStore = useTimerStore();

const timer = computed(() => timerStore.getTimer(props.id));

const timerHasMilliseconds = computed(
  () => timerStore.getTotalMillisecondsPast(props.id) > 0
);

const timerDoNotHasMilliseconds = computed(
  () => timerStore.getTotalMillisecondsPast(props.id) === 0
);

const timerLabelText = ref("");

watch(
  () => timer.value.currentPeriod.end,
  (newValue) => {
    timerLabelText.value = millisecondsToString(
      timer.value.type == "pomodoro" || timer.value.type == "break"
        ? timerStore.getRegressiveMillisecondsNecessary(props.id) -
            timerStore.getTotalMillisecondsPast(props.id)
        : timerStore.getTotalMillisecondsPast(props.id)
    );
  }
);

watch(
  () => timerLabelText.value,
  (newValue) => {
    if (!oldPageTitle.value) oldPageTitle.value = document.title;

    if (timer.value.isRun) {
      useTitle(
        `${newValue} ${props.title ? "- " + props.title + " " : ""}| ${
          oldPageTitle.value
        }`
      );
    } else {
      useTitle(oldPageTitle.value);
    }
  }
);

timerStore.initTimerConfig(props.id, props.code);

if (props.postTimePeriodCallback) {
  timerStore.setPostTPCallback(
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
  timerStore.startTimer(props.id);
  timerStore.playClick();
};

const pauseTimer = () => {
  useTitle(oldPageTitle.value);

  timerStore.noSleep?.disable();
  timerStore.pauseTimer(props.id);
  timerStore.playClick();
};

const stopTimer = () => {
  timerStore.noSleep?.disable();
  timerStore.pauseTimer(props.id);
  timerStore.playClick();

  if (timer.value.type === "break") {
    stopTimerAction();
    return;
  }

  modal.confirmStopTimer.open = true;
};

const stopTimerAction = () => {
  useTitle(oldPageTitle.value);

  modal.confirmStopTimer.open = false;
  timerStore.stopTimer(props.id);
};

const submitIsFetch = ref(false);

const endTimer = async () => {
  useTitle(oldPageTitle.value);

  timerStore.noSleep?.disable();
  timerStore.playClick();

  if (!authStore.isAuth) {
    timerStore.endTimer(props.id);
    return;
  }

  timerStore.pauseTimer(props.id);

  const timePeriods = [
    ...timer.value.currentPeriodList.map((t) => ({
      start: new Date(t.start),
      end: new Date(t.end),
    })),
  ];

  if (!props.id) {
    editTimeRecordObject.value = timeRecordLocalToForm(
      {
        timePeriods,
        timerSessionType: timer.value.type,
        timerSessionFrom: "browser",
      },
      () => timerStore.clearCurrentPeriodList(props.id)
    );

    modal.confirmPersistMethod.open = true;
    return;
  }

  let submitIsOk = true;

  try {
    submitIsFetch.value = true;

    await postTimePeriodList(props.id, {
      timePeriods,
      type: timer.value.type,
      from: "browser",
    });

    timerStore.clearCurrentPeriodList(props.id);

    OkToast(_$t("successPeriodSync"));
  } catch (error) {
    submitIsOk = false;

    timerStore.endTimer(props.id);

    if (error) ErrorToast(error);
    ErrorToast(_$t("errorPeriodSync"));
  } finally {
    submitIsFetch.value = false;

    if (submitIsOk && props.postTimePeriodCallback) {
      props.postTimePeriodCallback(props.code);
    }
  }
};

const persistOnServer = () => {
  modal.confirmPersistMethod.open = false;
  modal.createTimeRecord.open = true;
};

const saveOnBrowser = () => {
  timerStore.endTimer(props.id);
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
  if (timer.value.type === "pomodoro") return "red";
  if (timer.value.type == "break") return "blue";
  return "green";
});

const timerCardUi = computed(() => {
  const getColor = () => {
    if (timer.value.type === "pomodoro") return "red";
    if (timer.value.type === "break") return "blue";
    return "green";
  };

  return {
    base: `pt-3 relative w-full`,
    background: `dark:bg-${getColor()}-950 dark:bg-opacity-70`,
    ring: `ring-2 dark:ring-${getColor()}-500 ring-2 ring-${getColor()}-500`,
  };
});

const isFetch = computed(() => {
  return submitIsFetch.value || timer.value.isFetch;
});

onBeforeUnmount(() => {
  timerStore.pauseTimer(props.id);
});
</script>

<template>
  <section class="flex flex-col gap-3 items-center min-w-72">
    <UCard :ui="timerCardUi">
      <section class="flex -mt-4 mb-2 justify-center">
        <UButton
          title="Selecione entre Cronômetro, Pomodoro ou Pausa."
          color="white"
          variant="ghost"
          icon="i-icon-park-outline-timer"
          @click="timerStore.toggleOptions(props.id)"
        >
          Exibir Modos
        </UButton>
      </section>

      <section class="flex flex-col gap-5 justify-center items-center">
        <section class="text-center">
          <h3 v-if="timerDoNotHasMilliseconds" class="text-4xl font-bold">
            {{
              timer.type == "pomodoro" || timer.type == "break"
                ? timer.type == "pomodoro"
                  ? timer.pomodoroPeriod + "m de foco"
                  : timer.breakPeriod + "m"
                : title
            }}
          </h3>

          <h3 v-else class="text-4xl font-bold">
            {{ timerLabelText }}
          </h3>

          <p v-if="!timer.isRun && timerHasMilliseconds">Continuar?</p>

          <p v-else-if="timer.type == 'pomodoro'">
            {{
              timer.isRun ? "até finalizar o Pomodoro." : "com seu Pomodoro?"
            }}
          </p>

          <p v-else-if="timer.type == 'break'">
            {{ timer.isRun ? "para acabar o descanso..." : "para descansar." }}
          </p>

          <p v-else-if="timer.type == 'timer'">
            {{ timer.isRun ? "até o momento." : "Pronto para começar?" }}
          </p>
        </section>

        <div class="flex gap-3">
          <UButton
            v-if="!timer.isRun"
            :title="
              timer.currentPeriodList.length ? $t('continue') : $t('doStart')
            "
            :disabled="timer.isRun || isFetch"
            color="blue"
            icon="i-icon-park-outline-play-one"
            @click="startTimer"
          />

          <UButton
            v-if="timer.isRun"
            :disabled="!timer.isRun || isFetch"
            :title="$t('pause')"
            color="yellow"
            icon="i-icon-park-outline-pause"
            @click="pauseTimer"
          />

          <UButton
            v-if="timer.type !== 'break'"
            :disabled="timerDoNotHasMilliseconds || isFetch"
            :loading="isFetch"
            :title="$t('finish')"
            color="green"
            icon="i-icon-park-outline-hard-disk-one"
            @click="endTimer"
          />

          <UButton
            :disabled="timerDoNotHasMilliseconds || isFetch"
            :title="$t('stop')"
            color="red"
            icon="i-icon-park-outline-close-small"
            @click="stopTimer"
          />
        </div>
      </section>

      <p v-if="props.code" class="text-center pt-5 text-sm opacity-50">
        Sincronizado com registro:

        <UBadge :color="getButtonColor" variant="soft" size="md">
          {{ props.code }}
        </UBadge>
      </p>
    </UCard>

    <UButton
      v-if="timer.localRecords.length >= 1"
      color="black"
      variant="link"
      @click="modal.timeRecordsTable.open = !modal.timeRecordsTable.open"
    >
      <template v-if="!props.id">
        Há {{ timer.localRecords.length }}
        {{
          timer.localRecords.length > 1
            ? "registros locais."
            : "registro local."
        }}
      </template>

      <template v-else> Há registros não sincronizados.</template>
    </UButton>
  </section>

  <UModal
    v-if="timer.showOptions"
    :modelValue="timer.showOptions"
    @update:modelValue="(e) => (timer.showOptions = e)"
  >
    <h3 class="text-xl text-center pt-6">Qual modo deseja ativar?</h3>

    <GCloseButton @close="timerStore.toggleOptions(props.id)" />

    <TimerOptions :id="props.id" />
  </UModal>

  <UModal v-model="modal.timeRecordsTable.open">
    <UCard v-if="modal.timeRecordsTable.open">
      <GCloseButton @close="modal.timeRecordsTable.open = false" />

      <TimeRecordTableLocal
        v-if="timer.localRecords.length"
        :id="props.id"
        :postTimePeriodCallback="(code: string) => postTimePeriodCallback(code)"
      />

      <p v-else class="py-3">
        {{
          props.id
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
      @close="closeTimeRecordModal"
    />
  </UModal>
</template>
