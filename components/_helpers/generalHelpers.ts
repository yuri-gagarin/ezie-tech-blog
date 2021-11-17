export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

export const deepCopyObject = <T>(object: T & Object): T => {
  if (!object) {
    throw new Error(`Undefined argument. Expected argument to be an <object>`);
  }
  if (typeof object !== "object") {
    throw new TypeError(`Expected argument to be a TYPE: <object>, got: ${typeof object}`);
  }
  return JSON.parse(JSON.stringify(object));
};
