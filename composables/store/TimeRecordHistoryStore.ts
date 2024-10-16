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
    async fetch(mounted = false) {
      if (!this.paginationQuery) {
        this.paginationQuery = new PaginationQuery();
      }

      if (this._first) {
        this.paginationQuery.setDefaultPerPage(9);
        this._first = false;
      }

      try {
        this.isFetch = true;
        const data = await getTimeRecordHistory(
          this.paginationQuery,
          this._timeRecordId,
          mounted
        );
        if (data) this.apiRes = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this.isFetch = false;
      }
    },

    async refetch() {
      await this.fetch(true);
    },

    setTimeRecordId(id: number) {
      this._timeRecordId = id;
    },
  },
});
