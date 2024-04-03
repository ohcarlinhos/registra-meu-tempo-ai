import { format, getDayOfYear } from "date-fns";

export const formatPeriodoPopper = (periodo: PeriodoDeTempoType) => {
  const fullFormat = "dd/mm/yyyy HH:mm::ss";
  const onlyTime = "HH:mm:ss";
  const onlyDate = "dd/mm/yyyy";

  if (getDayOfYear(periodo.inicio) === getDayOfYear(periodo.fim)) {
    return (
      format(periodo.inicio, onlyTime) +
      " até " +
      format(periodo.fim, onlyTime) +
      " de " +
      format(periodo.inicio, onlyDate)
    );
  }

  return (
    format(periodo.inicio, fullFormat) +
    " até " +
    format(periodo.fim, fullFormat)
  );
};
