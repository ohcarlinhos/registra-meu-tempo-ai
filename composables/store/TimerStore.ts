import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      _currentTimePeriodList: [] as TimePeriodTimerType[],
      _currentTimePeriod: { start: 0, end: 0 } as TimePeriodTimerType,
      _currentTimeRecordId: null as number | null,
      _timeRecordsLocal: [] as ITimeRecordLocal[],
      _running: false,
      _interval: null as NodeJS.Timeout | null,
      _type: "timer" as TimerType,
      _pomodoroPeiod: 25,
      _breakPeriod: 5,
      _showOptions: false,
      _perPage: 4,
      _page: 1,
    };
  },

  actions: {
    initTimerConfig(id: number | null, hideOptions = false) {
      this._currentTimeRecordId = id;

      if (hideOptions) this._showOptions = false;

      this.pauseTimer();
    },

    clearCurrentTimePeriodList() {
      this._currentTimePeriodList = [];
    },

    clearInterval() {
      clearInterval(this._interval as NodeJS.Timeout);
    },

    addTimeRecordLocal(timeRecord: ITimeRecordLocal) {
      this._timeRecordsLocal.unshift(timeRecord);
    },

    deleteTimeRecordLocal(uuid: string) {
      const index = this._timeRecordsLocal.findIndex(
        (r) => r.localUuid === uuid
      );

      if (index != -1) {
        this._timeRecordsLocal.splice(index, 1);
      }
    },

    startTimer() {
      if (this._running === true) this.pauseTimer();

      this.defineIntervalTimer();
      this.resetTimer();

      this._running = true;
    },

    defineIntervalTimer() {
      this._interval = setInterval(() => {
        if (this._running) {
          this._currentTimePeriod.end = Date.now();

          if (this.isBreak || this.isPomodoro) {
            this.validadePomodoroOrBreakEnd();
          }
        } else {
          this.clearInterval();
        }
      }, 200);
    },

    validadePomodoroOrBreakEnd() {
      if (this.regressiveMilissecondsNecessary <= this._totalMilisecondsPast) {
        this.playAlarmSound();
        this.endTimer();
      }
    },

    pauseTimer() {
      this.clearInterval();

      if (this._running && this._totalMilisecondsPast !== 0) {
        this._currentTimePeriodList.push({
          start: this._currentTimePeriod.start,
          end: this._currentTimePeriod.end,
        });
      }

      this.resetTimer();
      this._running = false;
    },

    endTimer() {
      if (this._running) this.pauseTimer();

      if (this._currentTimePeriodList.length && !this.isBreak) {
        const timeRecord: ITimeRecordLocal = {
          localUuid: uuidv4(),
          description: "",
          timeRecordDate: new Date().toISOString(),
          timePeriods: this._currentTimePeriodList.map((p) => ({
            start: new Date(p.start),
            end: new Date(p.end),
          })),
        };

        if (this._currentTimeRecordId)
          timeRecord.id = this._currentTimeRecordId;

        this.addTimeRecordLocal(timeRecord);
      }

      this._currentTimePeriodList = [];
    },

    resetTimer() {
      const timeNow = Date.now();
      this._currentTimePeriod.start = timeNow;
      this._currentTimePeriod.end = timeNow;
    },

    setTimerType(type: TimerType) {
      this._type = type;
    },

    setPomodoroPeiod(value: number) {
      this._pomodoroPeiod = value;
    },

    setBreakPeiod(value: number) {
      this._breakPeriod = value;
    },

    toggleOptions() {
      this._showOptions = !this._showOptions;
    },

    playClickSound() {
      clickSound.play();
    },

    playAlarmSound() {
      alarmSound.play();
    },
  },

  getters: {
    showOptions(): boolean {
      return this._showOptions;
    },

    totalItems(): number {
      return this._timeRecordsLocal.length;
    },

    totalPages(): number {
      return Math.ceil(this.totalItems / this._perPage);
    },

    regressiveMilissecondsNecessary(): number {
      const mult = 60000;
      if (this.isPomodoro) return mult * this._pomodoroPeiod;
      return mult * this._breakPeriod;
    },

    pomodoroPeiod(): number {
      return this._pomodoroPeiod;
    },

    breakPeiod(): number {
      return this._breakPeriod;
    },

    timerType(state) {
      return state._type;
    },

    isRunning(state) {
      return state._running;
    },

    isPomodoro(state) {
      return state._type === "pomodoro";
    },

    isTimer(state) {
      return state._type === "timer";
    },

    isBreak(state) {
      return state._type === "break";
    },

    timePeriodsLength(state) {
      return state._currentTimePeriodList.length;
    },

    _timePeriodsTotalSeconds(state) {
      return state._currentTimePeriodList.reduce(
        (accumulator, current) => accumulator + (current.end - current.start),
        0
      );
    },

    _currentMilisecondsPast(state) {
      return state._currentTimePeriod.end - state._currentTimePeriod.start;
    },

    _totalMilisecondsPast(): number {
      return (
        this._timePeriodsTotalSeconds +
        (this._running ? this._currentMilisecondsPast : 0)
      );
    },

    hasMiliseconds(): boolean {
      return this._totalMilisecondsPast > 0;
    },

    dontHasMiliseconds(): boolean {
      return this._totalMilisecondsPast <= 0;
    },

    formated(): string {
      return millisecondsToString(
        this.isPomodoro || this.isBreak
          ? this.regressiveMilissecondsNecessary - this._totalMilisecondsPast
          : this._totalMilisecondsPast
      );
    },

    timeRecords: (state) => {
      const start: number = (state._page - 1) * state._perPage;
      const end: number = start + state._perPage;

      return state._timeRecordsLocal.slice(start, end).map((timeRecord) => {
        return {
          ...timeRecord,
          timeRecordDate: format(timeRecord.timePeriods[0].start, "dd/MM/yyyy"),
          timePeriods: timeRecord.timePeriods.map((e) => e),
          formattedTime: formatTimePeriodListToString(timeRecord.timePeriods),
        };
      });
    },
  },

  persist: true,
});
