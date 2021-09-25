export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

export const setRandBoolean = (): boolean => {
  const int: number = randomIntFromInterval(0, 1);
  return int === 1 ? true : false;
};
