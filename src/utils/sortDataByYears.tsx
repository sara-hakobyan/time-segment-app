import { StaticData } from "../staticData/historicalEvents";

const sortDataByYears = (data: StaticData) => {
  return data.events.sort((a, b) => a.year - b.year);
};

export { sortDataByYears };
