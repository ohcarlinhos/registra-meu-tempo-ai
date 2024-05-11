import { format, getDayOfYear, intervalToDuration } from "date-fns";

export const timePeriodsLabel = (count: number) => {
  const countText = count === 1 ? " período" : " períodos";
  return count === 0 ? "Nenhum" : count + countText;
};

export const formatToTimerDisplay = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  let formated = "";

  formated += ("00" + minutes).slice(-2) + ":";
  formated += ("00" + seconds).slice(-2);

  return formated;
};

export const editTimeRecordObjectFactory = (
  timeRecord: TimeRecordType,
  callback = () => {}
): TimeRecordFormType => {
  const categoryStore = useCategoryStore();

  const categoryStored =
    timeRecord.categoryId &&
    categoryStore.findCategoryById(timeRecord.categoryId);

  return {
    id: timeRecord.id,
    description: timeRecord.description,
    category: categoryStored ? categoryStored.name : "",
    categoryId: timeRecord.categoryId || undefined,
    timePeriods: timeRecord.timePeriods,
    callback,
  };
};

export const formatTimePeriodPopper = (timePeriod: TimePeriodType) => {
  const fullFormat = "dd/mm/yyyy HH:mm::ss";
  const onlyTime = "HH:mm:ss";
  const onlyDate = "dd/mm/yyyy";

  if (getDayOfYear(timePeriod.start) === getDayOfYear(timePeriod.end)) {
    return (
      format(timePeriod.start, onlyTime) +
      " até " +
      format(timePeriod.end, onlyTime) +
      " de " +
      format(timePeriod.start, onlyDate)
    );
  }

  return (
    format(timePeriod.start, fullFormat) +
    " até " +
    format(timePeriod.end, fullFormat)
  );
};

export const formatTimePeriodListToString = (timePeriods: TimePeriodType[]) => {
  let totalMiliseconds = 0;

  for (let i = 0; timePeriods.length > i; i++) {
    const calc =
      new Date(timePeriods[i].end).getTime() -
      new Date(timePeriods[i].start).getTime();

    totalMiliseconds += calc;
  }

  const duration = intervalToDuration({ start: 0, end: totalMiliseconds });
  const { days, hours, minutes, seconds } = duration;

  let fString = "";

  if (days != undefined) fString += days + "d ";
  if (hours != undefined) fString += hours + "h ";
  if (minutes != undefined) fString += minutes + "m ";
  if (seconds != undefined) fString += seconds + "s ";

  return fString || "-";
};
