import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export type PostTimePeriodCallback = (code: string) => Promise<void>;

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      _timerList: [] as TimerStoreItem[],
      _perPage: 6,
      _postTPCallback: null as null | PostTimePeriodCallback,

      audioObject: null as null | HTMLAudioElement,
    };
  },

  actions: {
    initTimerConfig(id: number | null = null, code = "") {
      const timer = this.getTimer(id);
      timer.code = code;
      timer.isFetch = false;

      timer.showOptions = false;

      if (timer.isRun) {
        if (timer.type === "pomodoro" || timer.type === "break") {
          this.pauseTimer(id);
        } else {
          this.defineIntervalTimer(id);
        }
      }
    },

    // getters

    getTimer(id: number | null = null): TimerStoreItem {
      let index = this._timerList.findIndex((t) => t.id === id);

      if (index != -1) {
        return this._timerList[index];
      }

      this._timerList.push({
        id: id,
        code: "",
        currentPeriodList: [],
        currentPeriod: { start: 0, end: 0 },
        isRun: false,
        isFetch: false,
        interval: null,
        type: "timer",
        showOptions: false,
        pomodoroPeriod: 25,
        breakPeriod: 5,
        page: 1,
        localRecords: [],
      });

      index = this._timerList.findIndex((t) => t.id === id);
      return this._timerList[index];
    },

    getRegressiveMillisecondsNecessary(id: number | null = null): number {
      const timer = this.getTimer(id);

      const mult = 60000;
      if (timer.type === "pomodoro") return mult * timer.pomodoroPeriod;
      return mult * timer.breakPeriod;
    },

    getPeriodListTotalMiliseconds(id: number | null = null) {
      const timer = this.getTimer(id);

      return timer.currentPeriodList.reduce(
        (acc, current) => acc + (current.end - current.start),
        0
      );
    },

    getCurrentMilisecondsPast(id: number | null = null) {
      const timer = this.getTimer(id);
      return timer.currentPeriod.end - timer.currentPeriod.start;
    },

    getTotalMillisecondsPast(id: number | null = null): number {
      const timer = this.getTimer(id);
      return (
        this.getPeriodListTotalMiliseconds(id) +
        (timer.isRun ? this.getCurrentMilisecondsPast(id) : 0)
      );
    },

    getTimeRecords(id: number | null = null) {
      const timer = this.getTimer(id);
      const start: number = (timer.page - 1) * this._perPage;
      const end: number = start + this._perPage;

      return timer.localRecords.slice(start, end).map((timeRecord) => {
        return {
          ...timeRecord,
          timeRecordDate: format(timeRecord.timePeriods[0].start, "dd/MM/yyyy"),
          timePeriods: timeRecord.timePeriods.map((e) => e),
          formattedTime: formatTimePeriodListToString(timeRecord.timePeriods),
          code: timeRecord.code,
        };
      });
    },

    // actions

    addTimeRecordLocal(timeRecord: TimeRecordLocal, id: number | null = null) {
      const timer = this.getTimer(id);
      timer.localRecords.unshift(timeRecord);
    },

    deleteTimeRecordLocal(uuid: string, id: number | null = null) {
      const timer = this.getTimer(id);
      const indexTimer = timer.localRecords.findIndex(
        (r) => r.localUuid === uuid
      );

      if (indexTimer != -1) {
        timer.localRecords.splice(indexTimer, 1);
      }
    },

    clearCurrentPeriodList(id: number | null = null) {
      const timer = this.getTimer(id);
      timer.currentPeriodList = [];
    },

    // Interval

    defineIntervalTimer(id: number | null = null) {
      const timer = this.getTimer(id);

      timer.interval = setInterval(() => {
        if (timer.isRun) {
          timer.currentPeriod.end = Date.now();

          if (timer.type == "break" || timer.type == "pomodoro") {
            this.handleWithPomoOrBreakEnd(id);
          }
        } else {
          this.clearInterval(id);
        }
      }, 1000);
    },

    clearInterval(id: number | null = null) {
      const timer = this.getTimer(id);
      clearInterval(timer.interval as NodeJS.Timeout);
    },

    // handlers

    handleWithPomoOrBreakEnd(id: number | null = null) {
      if (
        this.getTotalMillisecondsPast(id) >=
        this.getRegressiveMillisecondsNecessary(id)
      ) {
        this.playAlarm();
        this.endTimer(id);
      }
    },

    // Timer

    startTimer(id: number | null = null) {
      const timer = this.getTimer(id);
      if (timer.isRun === true) this.pauseTimer(id);

      this.defineIntervalTimer(id);
      this.resetTimer(id);

      timer.isRun = true;
    },

    pauseTimer(id: number | null = null) {
      this.clearInterval(id);

      const timer = this.getTimer(id);

      if (timer.isRun && this.getTotalMillisecondsPast(id) !== 0) {
        timer.currentPeriodList.push({
          start: timer.currentPeriod.start,
          end: timer.currentPeriod.end,
        });
      }

      this.resetTimer(id);
      timer.isRun = false;
    },

    endTimer(id: number | null = null) {
      const timer = this.getTimer(id);
      if (timer.isRun) this.pauseTimer(id);

      if (timer.currentPeriodList.length && !timer.isRun) {
        const timeRecord: TimeRecordLocal = {
          id: null,
          localUuid: uuidv4(),
          title: "",
          description: "",
          timeRecordDate: new Date().toISOString(),
          timePeriods: timer.currentPeriodList.map((p) => ({
            start: new Date(p.start),
            end: new Date(p.end),
          })),
          timerSessionType: timer.type,
          timerSessionFrom: "browser",
        };

        if (timer.id) timeRecord.id = timer.id;
        if (timer.code) timeRecord.code = timer.code;

        if (timer.id) {
          timer.isFetch = true;

          postTimePeriodList(timer.id, {
            timePeriods: timeRecord.timePeriods,
            type: timer.type,
            from: "browser",
          })
            .then(() => {
              if (this._postTPCallback && timer.code)
                this._postTPCallback(timer.code);
            })
            .catch(() => {
              this.addTimeRecordLocal(timeRecord, timer.id);
            })
            .finally(() => {
              timer.isFetch = false;
            });
        } else {
          this.addTimeRecordLocal(timeRecord);
        }
      }

      if (["pomodoro", "break"].includes(timer.type)) {
        timer.type = timer.type === "pomodoro" ? "break" : "pomodoro";
      }

      timer.currentPeriodList = [];
    },

    stopTimer(id: number | null = null) {
      const timer = this.getTimer(id);
      timer.currentPeriodList = [];
    },

    resetTimer(id: number | null = null) {
      const timeNow = Date.now();
      const timer = this.getTimer(id);

      timer.currentPeriod.start = timeNow;
      timer.currentPeriod.end = timeNow;
    },

    // Seters

    setTimerType(type: TimerTypes, id: number | null = null) {
      const timer = this.getTimer(id);
      timer.type = type;
    },

    setPomoPeriod(value: number, id: number | null = null) {
      const timer = this.getTimer(id);
      timer.pomodoroPeriod = value;
    },

    setBreakPeriod(value: number, id: number | null = null) {
      const timer = this.getTimer(id);
      timer.breakPeriod = value;
    },

    setPostTPCallback(callback: PostTimePeriodCallback) {
      this._postTPCallback = callback;
    },

    toggleOptions(id: number | null = null) {
      const timer = this.getTimer(id);
      timer.showOptions = !timer.showOptions;
    },

    // Audio

    createAudioObject() {
      this.audioObject = new Audio();
    },

    playClick() {
      this.createAudioObject();

      if (this.audioObject) {
        this.audioObject.src = "/audio/click.mp3";
        if (this.audioObject.play) this.audioObject.play();
      }
    },

    playAlarm() {
      if (!this.audioObject?.play) {
        this.createAudioObject();
      }

      if (this.audioObject) {
        this.audioObject.src = "/audio/alarm.mp3";
        if (this.audioObject.play) this.audioObject.play();
      }
    },
  },

  persist: true,
});
