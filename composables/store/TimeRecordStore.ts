import { format } from "date-fns";

export const useTimeRecordStore = defineStore("TimeRecordStore", {
  state: () => {
    return {
      _timeRecords: [] as TimeRecordType[],
      _fetching: false,
      _deletingTimeRecord: false,
    };
  },

  actions: {
    async fetchTimeRecords() {
      try {
        this._fetching = true;
        const data = await getTimeRecords();
        this._timeRecords = data.value;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetching = false;
      }
    },

    async deleteTimeRecord(id: number) {
      try {
        this._deletingTimeRecord = true;
        await deleteTimeRecord(id);
        await this.fetchTimeRecords();
      } finally {
        this._deletingTimeRecord = false;
      }
    },

    findRegistroById(id: number) {
      return this._timeRecords.find((r) => r.id == id);
    },
  },

  getters: {
    timeRecords: (state) => state._timeRecords,

    timeRecordsTableData: (state) => {
      const timeRecordsTable: ITimeRecordTable[] = [];

      state._timeRecords.forEach((timeRecord) => {
        timeRecordsTable.push({
          ...timeRecord,
          timeRecordDate:
            (timeRecord.timeRecordDate &&
              format(timeRecord.timeRecordDate, "dd/MM/yyyy")) ||
            "-",
          description: timeRecord.description || "-",
          categoryName: timeRecord.categoryName || "-",
          timeFormatted: timeRecord.timeFormatted || "Nenhum",
          timePeriodsCountText: timePeriodsLabel(timeRecord.timePeriodsCount!),
        });
      });

      return timeRecordsTable;
    },

    fetching: (state) => state._fetching || state._deletingTimeRecord,
  },

  persist: false,
});
