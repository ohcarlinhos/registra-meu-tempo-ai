export const getIsFetch = ref(false);
export const deleteIsFetch = ref(false);

export const deleteTimePeriodAction = async (
  timePeriodId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteIsFetch.value = true;

  const dayStore = useHistoryPeriodDayStore();

  try {
    await deleteTimePeriod(timePeriodId);

    const { $i18n } = useNuxtApp();
    OkToast($i18n.t("form.timePeriod.status.success.delete"));

    await dayStore.refetch();
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteIsFetch.value = false;
  }
};
