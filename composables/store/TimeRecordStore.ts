import { format } from "date-fns";

export const useTimeRecordStore = defineStore("TimeRecordStore", {
  state: () => {
    return {
      _apiRes: {} as Pagination<TimeRecordType>,
      _fetch: false,
      _deleteFetch: false,
    };
  },

  actions: {
    async fetch(pagQuery: IPaginationQuery | null = null, mounted = false) {
      if (pagQuery == null) pagQuery = new PaginationQuery();

      try {
        this._fetch = true;
        const data = await getTimeRecords(pagQuery, mounted);
        if (data) this._apiRes = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetch = false;
      }
    },

    async refetch() {
      const pagQuery = new PaginationQuery();
      pagQuery.page = this._apiRes.page;
      pagQuery.perPage = this._apiRes.perPage;
      pagQuery.search = this._apiRes.search;

      await this.fetch(pagQuery, true);
    },

    async deleteTimeRecord(id: number) {
      try {
        this._deleteFetch = true;
        await deleteTimeRecord(id);
        await this.refetch();
      } finally {
        this._deleteFetch = false;
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

    isFetch: (state) => state._fetch || state._deleteFetch,
  },

  persist: false,
});
