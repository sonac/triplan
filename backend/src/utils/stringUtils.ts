import { IPlanDay } from "../models/plan";

export const toKebab = (text: string) => {
  return text.toLocaleLowerCase().replace(/ /g, "-");
};

export const stringifyTrainingDay = (training: IPlanDay): string => {
  if (training.sessionName === "Rest") {
    return "Rest";
  }
  return `${training.sessionName} for ${training.distance} with ${training.pace} pace during ${training.time}`;
};
