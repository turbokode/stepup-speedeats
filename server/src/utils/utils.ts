export const timeFormatRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

export function getMaxNumber(numbers: number[]) {
  let maxNumber = 0;
  numbers.forEach((num) => {
    if (num > maxNumber) maxNumber = num;
  });
  return maxNumber;
}

export function generateRandomNumber(digits: number = 1) {
  const aux = Math.pow(10, digits - 1);
  const num = Math.floor(Math.random() * (aux * 9) + aux);
  return num;
}
