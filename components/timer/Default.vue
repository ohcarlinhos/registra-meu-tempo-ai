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

const customPomodoroPeriod = ref("");

watch(customPomodoroPeriod, (newValue) => {
  setPomodoroPeriod(newValue, false);
});

customPomodoroPeriod.value = timerStore.pomodoroPeiod.toString();

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

const getButtonColor = computed(() => {
  if (timerStore.isPomodoro) return "red";
  if (timerStore.isBreak) return "blue";
  return "green";
});

const setPomodoroPeriod = (value: number | string, clear = true) => {
  if (clear) customPomodoroPeriod.value = "";

  if (typeof value === "string" && value) {
    return timerStore.setPomodoroPeiod(parseInt(value));
  }

  if (typeof value === "number") {
    return timerStore.setPomodoroPeiod(value);
  }

  return timerStore.setPomodoroPeiod(timerStore.pomodoroPeiod || 25);
};

const setBreakPeriod = (value: number) => {
  return timerStore.setBreakPeiod(value);
};

const showConfigUi = reactive({
  base: "absolute top-1 right-1",
});
</script>

<template>
  <section>
    <section v-if="timerStore.showConfig" class="mb-5">
      <section class="flex gap-3 mb-3 justify-center">
        <UButton
          label="Pomodoro"
          :variant="isSolidOrSoftButton(timerStore.isPomodoro)"
          :disabled="timerStore.hasMiliseconds"
          color="red"
          icon="i-icon-park-outline-tomato"
          @click="timerStore.setTimerType('pomodoro')"
        />

        <UButton
          :variant="isSolidOrSoftButton(timerStore.isBreak)"
          :disabled="timerStore.hasMiliseconds"
          label="Pausa"
          color="blue"
          icon="i-icon-park-outline-sleep-two"
          @click="timerStore.setTimerType('break')"
        />

        <UButton
          :variant="isSolidOrSoftButton(timerStore.isTimer)"
          :disabled="timerStore.hasMiliseconds"
          label="Cronômetro"
          icon="i-icon-park-outline-timer"
          @click="timerStore.setTimerType('timer')"
        />
      </section>

      <section
        v-if="timerStore.isPomodoro"
        class="flex gap-3 items-center pt-2"
      >
        <p class="leading-1">Minutos:</p>

        <UButton
          label="25"
          :variant="isSolidOrOutlineButton(timerStore.pomodoroPeiod === 25)"
          :disabled="timerStore.hasMiliseconds"
          color="red"
          @click="setPomodoroPeriod(25)"
        />

        <UButton
          label="50"
          :variant="isSolidOrOutlineButton(timerStore.pomodoroPeiod === 50)"
          :disabled="timerStore.hasMiliseconds"
          color="red"
          @click="setPomodoroPeriod(50)"
        />

        <UInput
          v-model="customPomodoroPeriod"
          :ui="{ base: 'w-16' }"
          :disabled="timerStore.hasMiliseconds"
          type="number"
          min="0"
          step="1"
          @blur="setPomodoroPeriod(customPomodoroPeriod, false)"
        />
      </section>

      <section v-if="timerStore.isBreak" class="flex gap-3 items-center pt-2">
        <p class="leading-1">Minutos:</p>

        <UButton
          label="5"
          :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 5)"
          :disabled="timerStore.hasMiliseconds"
          color="blue"
          @click="setBreakPeriod(5)"
        />

        <UButton
          label="10"
          :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 10)"
          :disabled="timerStore.hasMiliseconds"
          color="blue"
          @click="setBreakPeriod(10)"
        />

        <UButton
          label="15"
          :variant="isSolidOrOutlineButton(timerStore.breakPeiod === 15)"
          :disabled="timerStore.hasMiliseconds"
          color="blue"
          @click="setBreakPeriod(15)"
        />
      </section>
    </section>

    <UCard
      :ui="{
        base: 'relative pt-3',
        background: `dark:bg-${getButtonColor}-950 dark:bg-opacity-70`,
      }"
    >
      <UButton
        v-if="timerStore.showConfig"
        :ui="showConfigUi"
        title="Abrir"
        color="white"
        variant="ghost"
        icon="i-icon-park-outline-preview-open"
        @click="timerStore.toggleConfig"
      />

      <UButton
        v-else
        :ui="showConfigUi"
        title="Fechar"
        color="white"
        variant="ghost"
        icon="i-icon-park-outline-preview-close"
        @click="timerStore.toggleConfig"
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
                : "Pronto para esse Pomodoro?"
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
            @click="timerStore.start"
          />

          <UButton
            :disabled="!timerStore.isRunning"
            :title="$t('timer.buttons.pause')"
            color="yellow"
            icon="i-icon-park-outline-pause"
            @click="timerStore.pause"
          />

          <UButton
            :disabled="timerStore.dontHasMiliseconds"
            :title="$t('timer.buttons.finish')"
            color="green"
            icon="i-icon-park-outline-hard-disk-one"
            @click="end"
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
