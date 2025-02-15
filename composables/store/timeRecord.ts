import { format } from "date-fns";

export const useTimeRecordStore = defineStore(
  "time-record-store",
  () => {
    const {
      query: paginationQuery,
      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,
      updatePaginationQueryWithRoute,
    } = usePaginationQuery("tr_");

    const apiRes = ref<Pagination<TimeRecordMap>>();
    const isPaginationFetch = ref(false);
    const isDeleteFetch = ref(false);

    const fetchData = async (updatePaginationQuery = true) => {
      if (updatePaginationQuery) {
        updatePaginationQueryWithRoute();
      }

      isPaginationFetch.value = true;

      try {
        const data = await timeRecordApi().get(paginationQuery.value);
        if (data) apiRes.value = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        isPaginationFetch.value = false;
      }
    };

    const refetchData = async () => {
      await fetchData(false);
    };

    async function deleteTimeRecord(id: number) {
      try {
        isDeleteFetch.value = true;
        await timeRecordApi().delete(id);
        await refetchData();
      } finally {
        isDeleteFetch.value = false;
      }
    }

    const isFetch = computed(() => {
      return isDeleteFetch.value || isPaginationFetch.value;
    });

    const tableData = computed(() => {
      const timeRecordsTable: TimeRecordTable[] = [];

      if (apiRes.value?.data)
        apiRes.value.data.forEach((timeRecord) => {
          timeRecordsTable.push({
            ...timeRecord,
            lastTimePeriodDate:
              (timeRecord.meta?.lastTimePeriodDate &&
                format(timeRecord.meta.lastTimePeriodDate, "dd/MM/yyyy")) ||
              "-",
            description: timeRecord.description || "-",
            code: timeRecord.code || "-",
            title: timeRecord.title || "-",
            categoryName: timeRecord.categoryName || "-",
            formattedTime: timeRecord.meta?.formattedTime || "Nenhum",
            timePeriodCountText: timePeriodLabel(
              timeRecord.meta?.timePeriodCount!
            ),
          });
        });

      return timeRecordsTable;
    });

    return {
      fetchData,
      refetchData,
      paginationQuery,
      apiRes,
      isPaginationFetch,
      isFetch,
      tableData,

      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,

      delete: deleteTimeRecord,
      isDeleteFetch,
    };
  },
  {
    persist: false,
  }
);
