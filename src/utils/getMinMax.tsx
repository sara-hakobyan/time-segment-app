import { StaticData } from "../staticData/historicalEvents";

const getMinMaxYears = (data: StaticData) => {
  return data.events.reduce(
    (acc, event) => {
      acc.min = Math.min(acc.min, event.year);
      acc.max = Math.max(acc.max, event.year);
      return acc;
    },
    { min: Infinity, max: -Infinity }
  );
};

const generateSequenceOfYears = (oldYear: number, newYear: number) => {
  let years: number[] = [];
  if (oldYear > newYear) {
    for (let i = newYear; i <= oldYear; i++) {
      years.push(i);
    }
    return years;
  }

  for (let i = oldYear; i <= newYear; i++) {
    years.push(i);
  }
  return years;
};

export { getMinMaxYears, generateSequenceOfYears };
