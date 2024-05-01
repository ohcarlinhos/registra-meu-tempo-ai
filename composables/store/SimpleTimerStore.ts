import { defineStore } from "pinia";

type TimePeriodSimpleTimerType = {
  timeRecordId: number;
  current: TimePeriodTimerType;
  fetching: boolean;
  timerDisplay: string;
};

export const useSimpleTimerStore = defineStore("SimpleTimerStore", {
  state: () => ({
    _timePeriodsList: [] as TimePeriodSimpleTimerType[],
  }),

  actions: {
    async start(timeRecordId: number, callback: () => Promise<void>) {
      const index = this._timePeriodsList.findIndex(
        (p) => p.timeRecordId === timeRecordId
      );

      if (index !== -1) {
        const timePeriod = this._timePeriodsList[index];

        if (timePeriod.current.start === timePeriod.current.end) {
          timePeriod.current.end = Date.now();
        }

        timePeriod.fetching = true;

        this.saveTimePeriod(this._timePeriodsList[index]).then(async () => {
          this._timePeriodsList.splice(index, 1);
          await callback();
        });
      } else {
        const timeNow = Date.now();

        this._timePeriodsList.push({
          timeRecordId,
          current: { start: timeNow, end: timeNow },
          fetching: false,
          timerDisplay: "00:00",
        });
      }
    },

    setFim(timeRecordId: number) {
      const index = this._timePeriodsList.findIndex(
        (p) => p.timeRecordId === timeRecordId
      );

      if (index !== -1) {
        const timePeriod = this._timePeriodsList[index];
        timePeriod.current.end = Date.now();
      }
    },

    saveTimePeriod(timePeriod: TimePeriodSimpleTimerType) {
      return postTimePeriod({
        timeRecordId: timePeriod.timeRecordId,
        start: new Date(timePeriod.current.start),
        end: new Date(timePeriod.current.end),
      });
    },
  },

  getters: {
    timePeriods(state) {
      return state._timePeriodsList.map((p) => {
        return {
          ...p,
          timerDisplay: formatToTimerDisplay(p.current.end - p.current.start),
        };
      });
    },
  },
});
