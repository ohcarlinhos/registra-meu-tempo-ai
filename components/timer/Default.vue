<script lang="ts" setup>
import {
  Timer,
  CloudOff,
  Play,
  Pause,
  Save,
  X,
  Loader2,
  Rocket,
} from "lucide-vue-next";
import NoSleep from "nosleep.js";
import { VisuallyHidden } from "reka-ui";

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

const { loggedIn } = useUserSession();

const timerStore = useTimerStore();

const timer = computed(() => timerStore.getTimer(props.id));

const timerHasMilliseconds = computed(
  () => timerStore.getTotalMillisecondsPast(props.id) > 0
);

const timerDoNotHasMilliseconds = computed(
  () => timerStore.getTotalMillisecondsPast(props.id) === 0
);

const timerLabelText = ref("");

const updateTimerLabelText = () => {
  timerLabelText.value = millisecondsToString(
    timer.value.type == "pomodoro" || timer.value.type == "break"
      ? timerStore.getRegressiveMillisecondsNecessary(props.id) -
          timerStore.getTotalMillisecondsPast(props.id)
      : timerStore.getTotalMillisecondsPast(props.id)
  );
};

watch(
  () => timer.value.currentPeriod.end,
  (_) => {
    updateTimerLabelText();
  }
);

const visibilityStateLabel = ref("");

const titlePage = computed(() => {
  if (timer.value.isRun && !isPipActive.value && !documentIsVisible.value) {
    return (
      timerLabelText.value +
      visibilityStateLabel.value +
      (props.title ? " — " + props.title : "")
    );
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

const noSleepObject = ref(new NoSleep());

const editTimeRecordObject = ref<TimeRecordForm>();

const startTimer = () => {
  if (!openFull.value) openFull.value = true;

  noSleepObject.value = new NoSleep();
  noSleepObject.value.enable();

  timerStore.startTimer(props.id);
  timerStore.playClick();
};

const pauseTimer = () => {
  noSleepObject.value?.disable();
  timerStore.pauseTimer(props.id);
  timerStore.playClick();
};

const stopTimer = () => {
  focusOnWindow();

  noSleepObject.value?.disable();
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
  noSleepObject.value?.disable();
  timerStore.playClick();

  if (!navigator.onLine) {
    timerStore.endTimer(props.id);
    SimpleToast({
      title: "Seu navegador está sem acesso a Internet.",
      description:
        "Mas não se preocupe! Salvamos seu tempo localmente (navegador).",
    });
    return;
  }

  if (!loggedIn.value) {
    focusOnWindow();
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
    focusOnWindow();
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
  editTimeRecordObject.value!.isBind = false;
  editTimeRecordObject.value!.isSync = false;

  modal.confirmPersistMethod.open = false;
  modal.createTimeRecord.open = true;
};

const bindWithRecord = () => {
  editTimeRecordObject.value!.isBind = true;
  editTimeRecordObject.value!.isSync = true;

  modal.confirmPersistMethod.open = false;
  modal.createTimeRecord.open = true;
};

const saveOnBrowser = () => {
  timerStore.endTimer(props.id);
  modal.confirmPersistMethod.open = false;
};

const closeTimeRecordModal = (reopenPersistModal = false) => {
  modal.createTimeRecord.open = false;

  if (reopenPersistModal) {
    modal.confirmPersistMethod.open = true;
  } else {
    editTimeRecordObject.value = undefined;
  }
};

const getLabel = computed(() => {
  if (timer.value.type === "pomodoro") return "Pomodoro";
  if (timer.value.type == "break") return "Descanso";
  return "Cronômetro";
});

const isFetch = computed(() => {
  return submitIsFetch.value || timer.value.isFetch;
});

const isOffline = ref<boolean>(!navigator.onLine);

const offlineCheck = setInterval(() => {
  isOffline.value = !navigator.onLine;
}, 10000);

const openFull = ref(false);

const ifNeedSetTimerSlowMode = () => {
  if (document.visibilityState === "hidden" && !isPipActive.value) {
    visibilityStateLabel.value =
      " — Modo lento, atualizando de 10 em 10 segundos... Clique na aba para visualizar o tempo real.";
    timerStore.defineIntervalTimer(props.id, 10000, true);
  }
};

const documentIsVisible = ref(true);

const checkVisibilityAndUpdateTimerInterval = () => {
  documentIsVisible.value = document.visibilityState === "visible";
  if (!timer.value.isRun) return;

  if (document.visibilityState === "visible") {
    visibilityStateLabel.value = "";
    timerStore.defineIntervalTimer(props.id, 1000, true);
    return;
  }

  ifNeedSetTimerSlowMode();
};

const pipElement = ref<HTMLElement | null>(null);
const pipContainer = ref<HTMLElement | null>(null);
const pipWindow = ref<any | null>(null);

const isPipActive = ref(false);

const canShowPip = computed(() => {
  return (
    "documentPictureInPicture" in window &&
    pipElement.value !== null &&
    pipContainer.value !== null
  );
});

const closePIP = () => {
  if (!canShowPip.value) {
    return;
  }

  ifNeedSetTimerSlowMode();

  focusOnWindow();
  isPipActive.value = false;
  // @ts-ignore
  pipContainer.value.append(pipElement.value);

  if (pipWindow.value) {
    pipWindow.value.close();
    pipWindow.value = null;
  }
};

const focusOnWindow = () => {
  window.focus();
};

const openPIP = async () => {
  if (!canShowPip.value || isPipActive.value) {
    return;
  }

  isPipActive.value = true;

  // @ts-ignore
  pipWindow.value = await window.documentPictureInPicture.requestWindow({
    width: 240,
    height: 135,
    preferInitialWindowPlacement: true,
  });

  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = document.createElement("style");

      style.textContent = cssRules;
      pipWindow.value.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement("link");

      link.rel = "stylesheet";
      link.type = styleSheet.type;
      //@ts-ignore
      link.media = styleSheet.media;
      //@ts-ignore
      link.href = styleSheet.href;
      pipWindow.value.document.head.appendChild(link);
    }
  });

  document.documentElement.classList.contains("dark")
    ? pipWindow.value.document.documentElement.classList.add("dark")
    : pipWindow.value.document.documentElement.classList.remove("dark");

  const bodyStyle = pipWindow.value.document.body.style;

  bodyStyle.height = "100vh";
  bodyStyle.display = "flex";
  bodyStyle.alignItems = "center";
  bodyStyle.justifyContent = "center";
  bodyStyle.width = "100vw";

  pipWindow.value.document.body.append(pipElement.value);

  pipWindow.value.addEventListener("pagehide", () => {
    closePIP();
  });
};

onMounted(() => {
  updateTimerLabelText();

  document.addEventListener(
    "visibilitychange",
    checkVisibilityAndUpdateTimerInterval
  );

  if (timer.value.isRun) {
    openFull.value = true;
  }
});

onBeforeUnmount(() => {
  closePIP();
  clearInterval(offlineCheck);
  document.removeEventListener(
    "visibilitychange",
    checkVisibilityAndUpdateTimerInterval
  );
});
</script>

<template>
  <section
    v-if="timer"
    class="flex flex-col gap-5 items-center min-w-72 transition duration-300 ease-in-out"
    :class="
      openFull &&
      'fixed top-0 left-0 bg-white dark:bg-black bg-opacity-90 w-svw h-svh z-50 flex justify-center items-center'
    "
  >
    <Button
      v-if="openFull"
      variant="outline"
      :disabled="timer.isRun"
      @click="
        openFull = false;
        closePIP();
      "
    >
      Fechar Timer
    </Button>

    <template v-if="isOffline">
      <div class="text-muted-foreground flex flex-col items-center mb-2">
        <span class="inline-flex gap-1 items-center text-md">
          <CloudOff class="size-4" />
          Estamos sem acesso a internet...
        </span>
        <span class="text-sm text-center">
          Mas não se preocupe! Vamos salvar seu tempo no navegador.
        </span>
      </div>
    </template>

    <section ref="pipContainer">
      <section
        ref="pipElement"
        :class="[
          cn(
            'flex flex-col justify-center align-middle relative',
            'w-[280px] md:w-[320px] h-[280px] md:h-[320px] shadow-md rounded-full',
            'dark:border-[12px] dark:ring-white dark:ring-opacity-10',
            'border-[10px] border-opacity-70 bg-white text-gray-700',
            'dark:border-[10px] dark:border-opacity-80 dark:bg-gray-800 dark:text-white',
            timer.type == 'pomodoro' && 'border-red-500',
            timer.type == 'timer' && 'border-green-500',
            timer.type == 'break' && 'border-blue-500',
            isPipActive &&
              'w-auto h-auto md:w-auto md:h-auto pt-4 pb-4 px-4 border-0 dark:border-4'
          ),
        ]"
      >
        <section v-if="!isPipActive" class="flex mb-2 justify-center">
          <Button
            :disabled="timerHasMilliseconds"
            title="Selecione entre Cronômetro, Pomodoro ou Descanso."
            variant="ghost"
            class="opacity-60 hover:opacity-100"
            @click="
              timerStore.toggleOptions(props.id);
              focusOnWindow();
            "
          >
            <Timer />
            Exibir Modos
          </Button>
        </section>

        <section
          :class="
            cn(
              'flex flex-col gap-5 justify-center items-center relative',
              isPipActive && 'gap-1'
            )
          "
        >
          <section class="text-center">
            <h3
              v-if="timerDoNotHasMilliseconds"
              :class="
                cn(
                  'text-5xl font-semibold',
                  isPipActive && 'text-[22px] font-semibold'
                )
              "
            >
              {{
                timer.type == "pomodoro" || timer.type == "break"
                  ? timer.type == "pomodoro"
                    ? timer.pomodoroPeriod + "m"
                    : timer.breakPeriod + "m"
                  : "0s"
              }}
            </h3>

            <h3
              v-else
              :class="
                cn(
                  'text-5xl font-semibold',
                  isPipActive && 'text-[22px] font-semibold'
                )
              "
            >
              {{ timerLabelText }}
            </h3>
          </section>

          <div :class="cn('flex gap-4', isPipActive && 'gap-2')">
            <GIconButton
              v-if="!timer.isRun"
              :title="
                timer.currentPeriodList.length ? $t('continue') : $t('doStart')
              "
              :disabled="timer.isRun || isFetch"
              class="bg-blue-500 hover:bg-blue-600"
              @click="startTimer"
            >
              <Play class="size-5 opacity-80 text-black" />
            </GIconButton>

            <GIconButton
              v-if="timer.isRun"
              :disabled="!timer.isRun || isFetch"
              :title="$t('pause')"
              class="bg-yellow-500 hover:bg-yellow-600"
              @click="pauseTimer"
            >
              <Pause class="size-5 opacity-80 text-black" />
            </GIconButton>

            <GIconButton
              v-if="timer.type !== 'break'"
              :disabled="timerDoNotHasMilliseconds || isFetch"
              :loading="isFetch"
              :title="$t('finish')"
              class="bg-green-500 hover:bg-green-600"
              @click="endTimer"
            >
              <Loader2
                v-if="isFetch"
                class="size-5 opacity-80 text-black animate-spin"
              />
              <Save v-else class="size-5 opacity-80 text-black" />
            </GIconButton>

            <GIconButton
              :disabled="timerDoNotHasMilliseconds || isFetch"
              :title="$t('stop')"
              class="bg-red-500 hover:bg-red-600"
              @click="stopTimer"
            >
              <X class="size-5 opacity-80 text-black" />
            </GIconButton>
          </div>

          <section v-if="!isPipActive" class="text-sm opacity-30 -mt-2">
            <label>{{ getLabel }}</label>
          </section>
        </section>
      </section>
    </section>

    <section v-if="isPipActive">
      <Alert>
        <Rocket class="h-4 w-4" />
        <AlertTitle>Wow!</AlertTitle>
        <AlertDescription>
          Seu cronômetro está ativo em um aba flutuante.
        </AlertDescription>
      </Alert>
    </section>

    <section
      v-if="openFull && canShowPip"
      class="flex items-center space-x-2 mt-2"
    >
      <Switch
        id="timer-on-pip"
        :model-value="isPipActive"
        @update:model-value="(event) => (event ? openPIP() : closePIP())"
      />
      <Label for="timer-on-pip">Cronômetro Flutuante</Label>
    </section>

    <p
      v-if="props.code"
      class="flex flex-col"
      :class="['text-center text-sm', isDark && 'opacity-80']"
    >
      <span> Sincronizado com a tarefa: </span>

      <span class="pt-1">
        <Badge variant="outline" size="md">
          {{ props.code }}
        </Badge>
      </span>
    </p>

    <Button
      v-if="modal && timer.localRecords.length >= 1"
      variant="link"
      :disabled="timer.isRun"
      class="text-foreground"
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
    </Button>
  </section>

  <Dialog
    v-bind:open="timer.showOptions"
    @update:open="timerStore.toggleOptions(props.id)"
  >
    <DialogContent @interact-outside="$event.preventDefault()">
      <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>Qual modo deseja ativar?</DialogTitle>

          <DialogDescription>
            Modos modificam o comportamento do cronômetro.
          </DialogDescription>
        </DialogHeader>
      </VisuallyHidden>

      <section class="flex flex-col gap-4">
        <h3 class="text-xl text-center">Qual modo deseja ativar?</h3>
        <TimerOptions :id="props.id" />
      </section>
    </DialogContent>
  </Dialog>

  <Dialog
    v-bind:open="modal.timeRecordsTable.open"
    @update:open="!$event && (modal.timeRecordsTable.open = false)"
  >
    <DialogContent @interact-outside="$event.preventDefault()">
      <DialogHeader>
        <DialogTitle> Sessões </DialogTitle>

        <DialogDescription>
          Sessões que aparecem nessa lista estão salvas apenas no navegador.
        </DialogDescription>
      </DialogHeader>

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

      <Separator class="mt-1" />

      <DialogFooter>
        <section class="w-full flex flex-col gap-2">
          <p class="text-sm">{{ _$t("localRecordObs1") }}</p>
          <p v-if="!loggedIn || true" class="pt-2 text-xs">
            {{ _$t("localRecordObs2") }}
          </p>
        </section>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <template v-if="modal">
    <Dialog
      v-bind:open="modal.confirmPersistMethod.open"
      @update:open="modal.confirmPersistMethod.open = $event"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ _$t("howDoYouPrefereSaveRecord") }}
          </DialogTitle>
          <DialogDescription>
            Escolha a forma que deseja salvar o seu tempo.
          </DialogDescription>

          <section class="flex flex-col gap-2 mt-5">
            <Button @click="bindWithRecord">Vincular a uma tarefa</Button>

            <Button variant="secondary" @click="persistOnServer">
              Criar tarefa a partir do tempo</Button
            >

            <Button variant="outline" @click="saveOnBrowser">
              Salvar no navegador
            </Button>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>

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

    <Dialog
      v-bind:open="modal.createTimeRecord.open"
      @update:open="!$event && closeTimeRecordModal(true)"
    >
      <DialogContent @interact-outside="$event.preventDefault()">
        <DialogHeader>
          <DialogTitle>
            <span class="mr-2"> {{ _$t("task") }} </span>
            <Badge v-if="editTimeRecordObject?.code" variant="outline">
              {{ editTimeRecordObject?.code }}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            {{ _$t("taskModalDescription") }}
          </DialogDescription>
        </DialogHeader>

        <TimeRecordFormCreateAndUpdate
          :edit-object="editTimeRecordObject"
          @close="closeTimeRecordModal"
        />
      </DialogContent>
    </Dialog>
  </template>
</template>
