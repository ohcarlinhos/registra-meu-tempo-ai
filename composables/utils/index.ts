import { format, getDayOfYear, intervalToDuration } from "date-fns";
import type { i18nT } from "~/translate/ptBr";
import { useTitle } from "@vueuse/core";

export const timePeriodLabel = (count?: number) => {
  const countText = count === 1 ? " período" : " períodos";
  return !count ? "Nenhum" : count + countText;
};

export const formatToTimerDisplay = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  let result = "";
  result += ("00" + minutes).slice(-2) + ":";
  result += ("00" + seconds).slice(-2);

  return result;
};

export const timeRecordLocalToForm = (
  obj: Partial<TimeRecordLocal> & { isSync?: boolean; isBind?: boolean },
  callback = () => {}
): TimeRecordForm => {
  return {
    id: obj.id || undefined,
    title: obj.title || "",
    description: obj.description || "",
    code: obj.code || "",
    category: "",
    timePeriods: obj.timePeriods || [],
    isSync: Boolean(obj.isSync),
    isBind: Boolean(obj.isBind),
    timerSessionType: obj.timerSessionType || "",
    timerSessionFrom: obj.timerSessionFrom || "",
    callback,
  };
};

export const formatTimePeriodPopper = (
  timePeriod: TimePeriodMap | TimePeriodLocal
): { formatted: string; date: string } => {
  const fullFormat = "dd/MM/yyyy HH:mm::ss";
  const onlyTime = "HH:mm:ss";
  const onlyDate = "dd/MM/yyyy";

  const milliseconds =
    new Date(timePeriod.end).getTime() - new Date(timePeriod.start).getTime();

  if (getDayOfYear(timePeriod.start) === getDayOfYear(timePeriod.end)) {
    return {
      formatted: millisecondsToString(milliseconds),
      date: `${format(timePeriod.start, onlyTime)} até ${format(
        timePeriod.end,
        onlyTime
      )} de ${format(timePeriod.start, onlyDate)}`,
    };
  }

  return {
    formatted: millisecondsToString(milliseconds),
    date: `${format(timePeriod.start, fullFormat)} até ${format(
      timePeriod.end,
      fullFormat
    )}`,
  };
};

export const formatTimePeriodListToString = (
  timePeriods: TimePeriodLocal[]
) => {
  let totalMilliseconds = 0;

  for (let i = 0; timePeriods.length > i; i++) {
    const calc =
      new Date(timePeriods[i].end).getTime() -
      new Date(timePeriods[i].start).getTime();

    totalMilliseconds += calc;
  }

  return millisecondsToString(totalMilliseconds);
};

export const millisecondsToString = (milliseconds: number) => {
  const duration = intervalToDuration({ start: 0, end: milliseconds });
  const { days, hours, minutes, seconds } = duration;

  let fString = "";

  if (days != undefined) fString += days + "d ";
  if (hours != undefined) fString += hours + "h ";
  if (minutes != undefined) fString += minutes + "m ";
  if (seconds != undefined) fString += seconds + "s ";

  return fString.trim() || "0s";
};

export const _$t = (key: i18nT) => {
  const { $i18n } = useNuxtApp();
  return $i18n.t(key);
};

export const setTitle = (text?: string) => {
  if (text) {
    useTitle(text + " | " + _$t("appTitle"));
  } else {
    useTitle(_$t("appTitle"));
  }
};
