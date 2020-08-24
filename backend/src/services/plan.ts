import { PlanModel, IPlan } from "../models/plan";
import { toKebab } from "../utils/stringUtils";
import { logger } from "../app";

export const addPlan = async (plan: IPlan): Promise<void> => {
  await PlanModel.create(plan);
  logger.info(`Plan ${plan.name} was added to database`);
};

export const getAllPlans = async (): Promise<IPlan[]> => {
  const plans = await PlanModel.find();
  return plans;
};

export const getPlanByName = async (name: string): Promise<IPlan> => {
  let plan = await PlanModel.findOne({ name });
  if (!plan) {
    plan = await getKebabedNamePlan(name);
  }
  if (!plan) {
    throw new Error("Plan with such name does not exist");
  }
  return plan;
};

export const deletePlanById = async (id: string): Promise<void> => {
  await PlanModel.deleteOne({ _id: id });
  logger.info("Plan deleted");
};

const getKebabedNamePlan = async (name: string): Promise<IPlan | null> => {
  const plans = await getAllPlans();
  return plans.filter((plan) => toKebab(plan.name) === name)[0];
};
