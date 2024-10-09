export const tpModal = reactive<{
  open: boolean;
  timeRecordId?: number;
  form?: TimePeriodForm;
}>({
  open: false,
  timeRecordId: undefined,
  form: undefined,
});

export const createTimePeriod = (timeRecordId: number) => {
  tpModal.open = true;
  tpModal.timeRecordId = timeRecordId;
  tpModal.form = undefined;
};

export const editTimePeriod = (timePeriod: TimePeriodForm) => {
  tpModal.open = true;
  tpModal.timeRecordId = undefined;
  tpModal.form = timePeriod;
};

export const closeTimePeriodModal = async (
  callback: () => Promise<void>,
  refresh = false
) => {
  tpModal.open = false;
  if (refresh) await callback();
};

export const deleteTpModal = reactive({
  open: false,
  id: 0,
});

export const openDeleteTpModal = (id: number) => {
  deleteTpModal.open = true;
  deleteTpModal.id = id;
};

export const closeDeleteTpModal = () => {
  deleteTpModal.open = false;
};
