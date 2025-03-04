import { eachDayOfInterval, format } from "date-fns";
import { defineStore } from "pinia";

export const useTimeRecordHistoryStore = defineStore({
  id: "TimeRecordHistoryStore",
  state: () => ({
    paginationQuery: new PaginationQuery(),
    apiRes: {} as Pagination<TimeRecordHistoryDayMap>,
    isFetch: false,
    _timeRecordId: 0,
    _first: true,
  }),
  actions: {
    async fetch() {
      if (!this.paginationQuery) {
        this.paginationQuery = new PaginationQuery();
      }

      if (this._first) {
        this.paginationQuery.setDefaultPerPage(12);
        this._first = false;
      }

      try {
        this.isFetch = true;
        const data = await getTimeRecordHistory(
          this.paginationQuery,
          this._timeRecordId
        );
        if (data) this.apiRes = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this.isFetch = false;
      }
    },

    async refetch() {
      await this.fetch();
    },

    setTimeRecordId(id: number) {
      this._timeRecordId = id;
    },
  },
  getters: {
    chartData: (state) => {
      if (!state.apiRes.data) return [];

      const firstDay = state.apiRes.data[0];
      const lastDay = state.apiRes.data[state.apiRes.data.length - 1];

      if (!firstDay || !lastDay) return [];

      const days = eachDayOfInterval({
        start: firstDay.date,
        end: lastDay.date,
      }).map<TimeRecordHistoryDayChart>((i) => ({
        date: i.toISOString(),
        timeOnHours: 0,
        timeOnMinutes: 0,
        formattedTime: "",
      }));

      state.apiRes.data.forEach((d) => {
        const day = days.find(
          (i) =>
            format(new Date(i.date), "dd/MM/yyyy") ===
            format(new Date(d.date), "dd/MM/yyyy")
        );
        if (!day) return;

        day.formattedTime = d.formattedTime;
        day.timeOnHours = d.timeOnHours;
        day.timeOnMinutes = d.timeOnMinutes;
      });

      return days;
    },
  },
  persist: true,
});
