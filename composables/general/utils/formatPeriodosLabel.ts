export const periodosLabel = (count: number) => {
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
