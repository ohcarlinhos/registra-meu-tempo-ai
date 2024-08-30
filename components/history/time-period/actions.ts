export const tpReq = ref<Pagination<DatedTimePeriodMap>>();

export const getFetch = ref(false);

export const getDatedTimePeriodData = async (
  timeRecordId: number,
  disableUpdateFetch = false
) => {
  if (!disableUpdateFetch) getFetch.value = true;

  getDatedTimePeriod(timeRecordId, new PaginationQuery(), true)
    .then((data) => {
      if (data) tpReq.value = data;
    })
    .finally(() => {
      if (!disableUpdateFetch) getFetch.value = false;
    });
};

export const deleteIsFetch = ref(false);

export const deleteTimePeriodAction = async (
  timePeriodId: number,
  timeRecordId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteIsFetch.value = true;

  try {
    await deleteTimePeriod(timePeriodId);

    const { $i18n } = useNuxtApp();
    OkToast($i18n.t("form.timePeriod.status.success.delete"));

    await getDatedTimePeriodData(timeRecordId);
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    console.log(err);
    ErrorToast(err);
  } finally {
    deleteIsFetch.value = false;
  }
};
