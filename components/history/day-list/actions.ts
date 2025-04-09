export const getIsFetch = ref(false);
export const deleteTpIsFetch = ref(false);

export const deleteTimePeriodAction = async (
  timePeriodId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteTpIsFetch.value = true;

  const { refetchData } = useTimeRecordHistoryStore();

  try {
    await deleteTimePeriod(timePeriodId);

    OkToast(useNuxtApp().$i18n.t("deleteTimePeriodSuccess"));

    await refetchData();
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

  const { refetchData } = useTimeRecordHistoryStore();

  try {
    await deleteTimerSession(timerSessionId);

    OkToast("Sessão excluída com sucesso.");

    await refetchData();
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteTsIsFetch.value = false;
  }
};

export const deleteTmIsFetch = ref(false);

export const deleteTimeMinuteAction = async (
  minuteId: number,
  closeModalMethod: () => void = () => {},
  callback: (() => Promise<void>) | undefined = undefined
) => {
  deleteTmIsFetch.value = true;

  const { refetchData } = useTimeRecordHistoryStore();

  try {
    await timeMinuteApi().delete(minuteId);

    OkToast("Sessão excluída com sucesso.");

    await refetchData();
    if (callback) await callback();

    closeModalMethod();
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteTmIsFetch.value = false;
  }
};
