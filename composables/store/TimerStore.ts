import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      _currentTimePeriodList: [] as TimePeriodTimerType[],
      _currentTimePeriod: { start: 0, end: 0 } as TimePeriodTimerType,
      _timeRecordsLocal: [] as ITimeRecordLocal[],
      _running: false,
      _interval: null as NodeJS.Timeout | null,
      _type: "timer" as TimerType,
      _pomodoroPeiod: 25,
      _breakPeriod: 5,
      _showConfig: false,
      _perPage: 4,
      _page: 1,
    };
  },

  actions: {
    validateAndConfigure() {
      const alreadyAddEventListener = localStorage.getItem(
        "alreadyAddEventListener"
      );

      if (!alreadyAddEventListener || alreadyAddEventListener === "0") {
        if (this._running) this.pause();

        window.addEventListener("beforeunload", function () {
          localStorage.setItem("alreadyAddEventListener", "0");
        });

        localStorage.setItem("alreadyAddEventListener", "1");
      }
    },

    reset() {
      const timeNow = Date.now();
      this._currentTimePeriod.start = timeNow;
      this._currentTimePeriod.end = timeNow;
    },

    clearTimePeriodList() {
      this._currentTimePeriodList = [];
    },

    clearInterval() {
      clearInterval(this._interval as NodeJS.Timeout);
    },

    add(timeRecord: ITimeRecordLocal) {
      this._timeRecordsLocal.unshift(timeRecord);
    },

    start() {
      if (this._running === true) this.pause();

      this._interval = setInterval(() => {
        if (this._running) {
          this._currentTimePeriod.end = Date.now();

          // TODO: implementar diferenças do pomodoro, cronômetro e pausa.
        } else {
          this.clearInterval();
        }
      }, 200);

      this.reset();
      this._running = true;
    },

    pause() {
      this.clearInterval();

      if (this._running && this._totalMiliseconds !== 0) {
        this._currentTimePeriodList.push({
          start: this._currentTimePeriod.start,
          end: this._currentTimePeriod.end,
        });
      }

      this.reset();
      this._running = false;
    },

    end() {
      if (this._running) this.pause();

      if (this._currentTimePeriodList.length && !this.isBreak) {
        this.add({
          localUuid: uuidv4(),
          description: "",
          timeRecordDate: new Date().toISOString(),
          timePeriods: this._currentTimePeriodList.map((p) => ({
            start: new Date(p.start),
            end: new Date(p.end),
          })),
        });
      }

      this._currentTimePeriodList = [];
    },

    off() {
      this._running = false;
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

    deleteTimeRecord(uuid: string) {
      const index = this._timeRecordsLocal.findIndex(
        (r) => r.localUuid === uuid
      );

      if (index != -1) {
        this._timeRecordsLocal.splice(index, 1);
      }
    },

    toggleConfig() {
      this._showConfig = !this._showConfig;
    },
  },

  getters: {
    showConfig(): boolean {
      return this._showConfig;
    },

    totalItems(): number {
      return this._timeRecordsLocal.length;
    },

    totalPages(): number {
      return Math.ceil(this.totalItems / this._perPage);
    },

    pomodoroOrBreakInMilisecondsPeriod(): number {
      return (
        (this.isPomodoro ? this._pomodoroPeiod : this._breakPeriod) * 60 * 1000
      );
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

    _secondsPast(state) {
      return state._currentTimePeriod.end - state._currentTimePeriod.start;
    },

    _totalMiliseconds(): number {
      return (
        this._timePeriodsTotalSeconds + (this._running ? this._secondsPast : 0)
      );
    },

    hasMiliseconds(): boolean {
      return this._totalMiliseconds > 0;
    },

    dontHasMiliseconds(): boolean {
      return this._totalMiliseconds === 0;
    },

    formated(): string {
      return millisecondsToString(
        this.isPomodoro || this.isBreak
          ? this.pomodoroOrBreakInMilisecondsPeriod - this._totalMiliseconds
          : this._totalMiliseconds
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
