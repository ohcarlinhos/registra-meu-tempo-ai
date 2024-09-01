import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import NoSleep from "nosleep.js";

export type PostTimePeriodCallback = (code: string) => Promise<void>;

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      _currentTimePeriodList: [] as TimePeriodTimer[],
      _currentTimePeriod: { start: 0, end: 0 } as TimePeriodTimer,
      _currentTimeRecordId: null as number | null,
      _currentTimeRecordCode: "",

      _timeRecordsLocal: [] as TimeRecordLocal[],
      _running: false,
      _interval: null as NodeJS.Timeout | null,
      _type: "timer" as TimerTypes,
      _pomodoroPeriod: 25,
      _breakPeriod: 5,
      _showOptions: false,
      _perPage: 10,
      _page: 1,

      _postTimePeriodListFetching: false,
      _postTimePeriodCallback: null as null | PostTimePeriodCallback,

      noSleep: null as null | NoSleep,
      audioObject: null as null | HTMLAudioElement,
    };
  },

  actions: {
    initTimerConfig(id: number | null, hideOptions = false, code = "") {
      this._currentTimeRecordId = id;
      this._currentTimeRecordCode = code;
      this._postTimePeriodListFetching = false;

      this.noSleep = new NoSleep();

      if (hideOptions) this._showOptions = false;

      this.pauseTimer();
    },

    clearCurrentTimePeriodList() {
      this._currentTimePeriodList = [];
    },

    clearInterval() {
      clearInterval(this._interval as NodeJS.Timeout);
    },

    addTimeRecordLocal(timeRecord: TimeRecordLocal) {
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
      if (this._totalMilisecondsPast >= this.regressiveMilissecondsNecessary) {
        this.noSleep?.disable();
        this.playAlarm();
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
        const timeRecord: TimeRecordLocal = {
          localUuid: uuidv4(),
          title: "",
          description: "",
          timeRecordDate: new Date().toISOString(),
          timePeriods: this._currentTimePeriodList.map((p) => ({
            start: new Date(p.start),
            end: new Date(p.end),
          })),
          timerSessionType: this._type,
          timerSessionFrom: "browser",
        };

        if (this._currentTimeRecordId)
          timeRecord.id = this._currentTimeRecordId;

        if (this._currentTimeRecordCode)
          timeRecord.code = this._currentTimeRecordCode;

        if (this._currentTimeRecordId) {
          this._postTimePeriodListFetching = true;

          postTimePeriodList(this._currentTimeRecordId, {
            timePeriods: timeRecord.timePeriods,
            type: this._type,
            from: "browser",
          })
            .then(() => {
              if (this._postTimePeriodCallback && this._currentTimeRecordCode)
                this._postTimePeriodCallback(this._currentTimeRecordCode);
            })
            .catch(() => {
              this.addTimeRecordLocal(timeRecord);
            })
            .finally(() => {
              this._postTimePeriodListFetching = false;
            });
        } else {
          this.addTimeRecordLocal(timeRecord);
        }
      }

      this._currentTimePeriodList = [];
    },

    stopTimer() {
      this._currentTimePeriodList = [];
    },

    resetTimer() {
      const timeNow = Date.now();
      this._currentTimePeriod.start = timeNow;
      this._currentTimePeriod.end = timeNow;
    },

    setTimerType(type: TimerTypes) {
      this._type = type;
    },

    setPomodoroPeiod(value: number) {
      this._pomodoroPeriod = value;
    },

    setBreakPeiod(value: number) {
      this._breakPeriod = value;
    },

    setPostTimePeriodCallback(callback: PostTimePeriodCallback) {
      this._postTimePeriodCallback = callback;
    },

    toggleOptions() {
      this._showOptions = !this._showOptions;
    },

    createAudioObject() {
      this.audioObject = new Audio();
    },

    playClick() {
      // o play cria o objeto pois é uma ação do usuário (correção de IOS)
      this.createAudioObject();

      if (this.audioObject) {
        this.audioObject.src = clickSound.src;
        this.audioObject.play();
      }
    },

    playAlarm() {
      // Toca audio anteriormente criado.
      if (this.audioObject) {
        this.audioObject.src = alarmSound.src;
        this.audioObject.play();
      }
    },
  },

  getters: {
    fetching(state) {
      return state._postTimePeriodListFetching;
    },

    showOptions(): boolean {
      return this._showOptions;
    },

    totalItems(): number {
      return this.timeRecordContextFiltered.length;
    },

    totalPages(): number {
      return Math.ceil(this.totalItems / this._perPage);
    },

    regressiveMilissecondsNecessary(): number {
      const mult = 60000;
      if (this.isPomodoro) return mult * this._pomodoroPeriod;
      return mult * this._breakPeriod;
    },

    pomodoroPeiod(): number {
      return this._pomodoroPeriod;
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

    timeRecordContextFiltered(state) {
      return state._timeRecordsLocal.filter((tr) => {
        if (state._currentTimeRecordId) {
          if (tr.id) return tr;
        } else {
          return tr;
        }
      });
    },

    timeRecords(state) {
      const start: number = (state._page - 1) * state._perPage;
      const end: number = start + state._perPage;

      return state._timeRecordsLocal
        .filter((tr) => {
          if (state._currentTimeRecordId) {
            if (tr.id) return tr;
          } else {
            return tr;
          }
        })
        .slice(start, end)
        .map((timeRecord) => {
          return {
            ...timeRecord,
            timeRecordDate: format(
              timeRecord.timePeriods[0].start,
              "dd/MM/yyyy"
            ),
            timePeriods: timeRecord.timePeriods.map((e) => e),
            formattedTime: formatTimePeriodListToString(timeRecord.timePeriods),
            code: timeRecord.code,
          };
        });
    },
  },

  persist: true,
});
