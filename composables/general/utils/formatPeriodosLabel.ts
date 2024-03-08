export const formatPeriodosLabel = (count: number) => {
  const countText = count === 1 ? " período" : " períodos";
  return count === 0 ? "Nenhum" : count + countText;
};
