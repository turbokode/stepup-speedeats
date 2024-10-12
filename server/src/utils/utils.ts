export const timeFormatRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

export function getMaxNumber(numbers: number[]) {
  let maxNumber = 0;
  numbers.forEach((num) => {
    if (num > maxNumber) maxNumber = num;
  });
  return maxNumber;
}
