import { format } from "date-fns";

export const useTimeRecordStore = defineStore("TimeRecordStore", {
  state: () => {
    return {
      _apiRes: {} as Pagination<TimeRecordType>,
      _fetching: false,
      _deletingTimeRecord: false,
    };
  },

  actions: {
    async fetch(page = 1, perPage = 4, search = "", mounted = false) {
      try {
        this._fetching = true;
        const data = await getTimeRecords(page, perPage, search, mounted);
        if (data) this._apiRes = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetching = false;
      }
    },

    async refetch() {
      await this.fetch(
        this._apiRes.page,
        this._apiRes.perPage,
        this._apiRes.search,
        true
      );
    },

    async deleteTimeRecord(id: number) {
      try {
        this._deletingTimeRecord = true;
        await deleteTimeRecord(id);
        await this.refetch();
      } finally {
        this._deletingTimeRecord = false;
      }
    },

    findTimeRecordById(id: number) {
      return this._apiRes.data!.length
        ? this._apiRes.data.find((r) => r.id == id)
        : null;
    },
  },

  getters: {
    timeRecords: (state) => state._apiRes,

    apiRes: (state) => (state._apiRes!.data ? state._apiRes : null),

    timeRecordsTableData: (state) => {
      const timeRecordsTable: ITimeRecordTable[] = [];

      if (state._apiRes!.data)
        state._apiRes.data.forEach((timeRecord) => {
          timeRecordsTable.push({
            ...timeRecord,
            timeRecordDate:
              (timeRecord.timeRecordDate &&
                format(timeRecord.timeRecordDate, "dd/MM/yyyy")) ||
              "-",
            description: timeRecord.description || "-",
            code: timeRecord.code || "-",
            title: timeRecord.title || "-",
            categoryName: timeRecord.categoryName || "-",
            formattedTime: timeRecord.formattedTime || "Nenhum",
            timePeriodsCountText: timePeriodsLabel(
              timeRecord.timePeriodsCount!
            ),
          });
        });

      return timeRecordsTable;
    },

    fetching: (state) => state._fetching || state._deletingTimeRecord,
  },

  persist: false,
});
