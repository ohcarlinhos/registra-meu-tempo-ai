export const getIsFetch = ref(false);
export const deleteTpIsFetch = ref(false);

export const deleteTimePeriodAction = async (
  timePeriodId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteTpIsFetch.value = true;

  const dayStore = useTimeRecordHistoryStore();

  try {
    await deleteTimePeriod(timePeriodId);

    OkToast(useNuxtApp().$i18n.t("deleteTimePeriodSuccess"));

    await dayStore.refetch();
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteTpIsFetch.value = false;
  }
};

export const deleteTsIsFetch = ref(false);

export const deleteTimerSessionAction = async (
  timerSessionId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteTsIsFetch.value = true;

  const dayStore = useTimeRecordHistoryStore();

  try {
    await deleteTimerSession(timerSessionId);

    OkToast("Sessão excluída com sucesso.");

    await dayStore.refetch();
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteTsIsFetch.value = false;
  }
};
