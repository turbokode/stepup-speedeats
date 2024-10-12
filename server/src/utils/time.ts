export function convertTimeToSeconds(time: string) {
  const [hours, minutes] = time.split(':');
  const hourSeconds = Number(hours) * 60 * 60;
  const minuteSeconds = Number(minutes) * 60;

  const totalSeconds = hourSeconds + minuteSeconds;
  return totalSeconds;
}

export function convertSecondsToTime(seconds: number) {
  const decimalTime = seconds / (60 * 60);

  const hours = Math.floor(decimalTime);
  const minutes = Math.floor(60 * (decimalTime - hours));

  return `${getTwoDigitsNumber(hours)}:${getTwoDigitsNumber(minutes)}`;
}

function getTwoDigitsNumber(num: number) {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
}
