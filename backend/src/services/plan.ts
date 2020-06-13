import { PlanModel, IPlan } from "../models/plan";

export const addPlan = async (plan: IPlan): Promise<void> => {
  await PlanModel.create(plan);
  console.log(`Plan ${plan.name} was added to database`);
};

export const getAllPlans = async (): Promise<IPlan[]> => {
  const plans = await PlanModel.find();
  return plans;
};

export const getPlanByName = async (name: string): Promise<IPlan> => {
  const plan = await PlanModel.findOne({ name });
  if (!plan) {
    throw new Error("Plan with such name does not exist");
  }
  return plan;
};
