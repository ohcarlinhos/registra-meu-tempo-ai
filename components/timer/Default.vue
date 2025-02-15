<script lang="ts" setup>
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

const authStore = useAuthStore();
const { isAuth: userIsAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { isVerified: userIsVerified } = storeToRefs(userStore);

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
  (_) => {
    timerLabelText.value = millisecondsToString(
      timer.value.type == "pomodoro" || timer.value.type == "break"
        ? timerStore.getRegressiveMillisecondsNecessary(props.id) -
            timerStore.getTotalMillisecondsPast(props.id)
        : timerStore.getTotalMillisecondsPast(props.id)
    );
  }
);

const titlePage = computed(() => {
  if (timer.value.isRun) {
    return timerLabelText.value + (props.title ? " — " + props.title : "");
  }
  return props.title ? props.title : "";
});

useHead({
  title: titlePage,
});

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
  modal.confirmStopTimer.open = false;
  timerStore.stopTimer(props.id);
};

const submitIsFetch = ref(false);

const endTimer = async () => {
  timerStore.noSleep?.disable();
  timerStore.playClick();

  if (!userIsAuth.value) {
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

const getButtonColor = computed(() => {
  if (timer.value.type === "pomodoro") return "red";
  if (timer.value.type == "break") return "blue";
  return "green";
});

const getLabel = computed(() => {
  if (timer.value.type === "pomodoro") return "Pomodoro";
  if (timer.value.type == "break") return "Descanso";
  return "Cronômetro";
});

const isFetch = computed(() => {
  return submitIsFetch.value || timer.value.isFetch;
});

onBeforeUnmount(() => {
  timerStore.pauseTimer(props.id);
});
</script>

<template>
  <section v-if="timer" class="flex flex-col gap-5 items-center min-w-72">
    <section
      :class="[
        'flex flex-col justify-center align-middle relative',
        'w-[320px] h-[320px] ring-4 shadow-md rounded-full',
        'ring-black ring-opacity-40 border-[12px] dark:ring-white dark:ring-opacity-10',
        'border-[10px] border-opacity-70 bg-white text-gray-700 ',
        'dark:border-[10px] dark:border-opacity-80 dark:bg-gray-800 dark:text-white',
        timer.type == 'pomodoro' && 'border-red-500',
        timer.type == 'timer' && 'border-green-500',
        timer.type == 'break' && 'border-blue-500',
      ]"
    >
      <section class="flex mb-2 justify-center">
        <UButton
          title="Selecione entre Cronômetro, Pomodoro ou Descanso."
          color="white"
          variant="ghost"
          :disabled="timerHasMilliseconds"
          icon="i-icon-park-outline-timer"
          @click="timerStore.toggleOptions(props.id)"
        >
          Exibir Modos
        </UButton>
      </section>

      <section class="flex flex-col gap-5 justify-center items-center relative">
        <section class="text-center">
          <h3 v-if="timerDoNotHasMilliseconds" class="text-5xl font-bold">
            {{
              timer.type == "pomodoro" || timer.type == "break"
                ? timer.type == "pomodoro"
                  ? timer.pomodoroPeriod + "m"
                  : timer.breakPeriod + "m"
                : "0s"
            }}
          </h3>

          <h3 v-else class="text-5xl font-bold">
            {{ timerLabelText }}
          </h3>
        </section>

        <div class="flex gap-4">
          <UButton
            v-if="!timer.isRun"
            :title="
              timer.currentPeriodList.length ? $t('continue') : $t('doStart')
            "
            class="rounded-full"
            :disabled="timer.isRun || isFetch"
            color="blue"
            icon="i-icon-park-outline-play-one"
            size="lg"
            @click="startTimer"
          />

          <UButton
            v-if="timer.isRun"
            class="rounded-full"
            :disabled="!timer.isRun || isFetch"
            :title="$t('pause')"
            color="yellow"
            icon="i-icon-park-outline-pause"
            size="lg"
            @click="pauseTimer"
          />

          <UButton
            v-if="timer.type !== 'break'"
            class="rounded-full"
            :disabled="timerDoNotHasMilliseconds || isFetch"
            :loading="isFetch"
            :title="$t('finish')"
            color="green"
            icon="i-icon-park-outline-hard-disk-one"
            size="lg"
            @click="endTimer"
          />

          <UButton
            class="rounded-full"
            :disabled="timerDoNotHasMilliseconds || isFetch"
            :title="$t('stop')"
            color="red"
            icon="i-icon-park-outline-close-small"
            size="lg"
            @click="stopTimer"
          />
        </div>

        <section class="text-sm opacity-30 -mt-2">
          <label>{{ getLabel }}</label>
        </section>
      </section>
    </section>

    <p
      v-if="props.code"
      class="flex flex-col"
      :class="['text-center text-sm', isDark && 'opacity-50']"
    >
      <span> Sincronizado com a tarefa: </span>

      <span class="pt-1">
        <UBadge :color="getButtonColor" variant="soft" size="md">
          {{ props.code }}
        </UBadge>
      </span>
    </p>

    <UButton
      v-if="modal && timer.localRecords.length >= 1"
      color="black"
      variant="link"
      @click="modal.timeRecordsTable.open = !modal.timeRecordsTable.open"
    >
      <template v-if="!props.id">
        Há {{ timer.localRecords.length }}
        {{
          timer.localRecords.length > 1
            ? " sessões salvas no navegador."
            : " sessão salva no navegador."
        }}
        <br />
        Clique aqui para sincronizar!
      </template>

      <template v-else> Há registro de tempo não sincronizados.</template>
    </UButton>
  </section>

  <UModal
    v-if="timer && timer.showOptions"
    :modelValue="timer.showOptions"
    @update:modelValue="(e) => (timer.showOptions = e)"
  >
    <h3 class="text-xl text-center pt-6">Qual modo deseja ativar?</h3>

    <GCloseButton @close="timerStore.toggleOptions(props.id)" />

    <TimerOptions :id="props.id" />
  </UModal>

  <UModal v-if="modal" v-model="modal.timeRecordsTable.open">
    <Card v-if="modal.timeRecordsTable.open">
      <CardHeader>
        <CardTitle>Sessões</CardTitle>
        <GCloseButton @close="modal.timeRecordsTable.open = false" />
        <CardDescription>
          Sessões que aparecem nessa lista estão salvas apenas no navegador.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TimeRecordTableLocal
          v-if="timer.localRecords.length"
          :id="props.id"
          :postTimePeriodCallback="(code: string) => postTimePeriodCallback(code)"
        />

        <p v-else class="py-3">
          {{
            props.id
              ? "Os períodos de tempo da sua tarefa estão sincronizados."
              : "Não há mais nenhum registro de tempo local."
          }}
        </p>

        <UDivider class="pt-4" />

        <p class="pt-3 text-sm">{{ _$t("localRecordObs1") }}</p>
        <p v-if="!userIsAuth" class="pt-2 text-xs">
          {{ _$t("localRecordObs2") }}
        </p>
      </CardContent>
    </Card>
  </UModal>

  <template v-if="modal">
    <GModalConfirm
      v-model:open="modal.confirmPersistMethod.open"
      custom-width="sm:w-88"
      :title="_$t('howDoYouPrefereSaveRecord')"
      cancel-text="Manter no navegador"
      confirm-text="Criar tarefa à partir do tempo"
      :disable-confirm="!userIsVerified"
      @confirm="persistOnServer"
      @cancel="saveOnBrowser"
    />

    <GModalConfirm
      v-model:open="modal.confirmStopTimer.open"
      custom-width="sm:w-88"
      title="Deseja parar o cronômetro?"
      description="Ao confirmar o tempo registrado em seu pomodoro ou cronômetro será perdido."
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
</template>
