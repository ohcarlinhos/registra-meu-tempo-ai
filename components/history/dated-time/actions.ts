export const dtpReq = ref<DatedTimeMap[]>();

export const getIsFetch = ref(false);

export const getDatedTimeData = async (
  timeRecordId: number,
  disableUpdateFetch = false
) => {
  if (!disableUpdateFetch) getIsFetch.value = true;

  getDatedTime(timeRecordId, true)
    .then((data) => {
      if (data) dtpReq.value = data;
    })
    .finally(() => {
      if (!disableUpdateFetch) getIsFetch.value = false;
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

    await getDatedTimeData(timeRecordId);
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    console.log(err);
    ErrorToast(err);
  } finally {
    deleteIsFetch.value = false;
  }
};
