import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IInterval extends Document {
  fastDistance: number | null;
  fastTime: number | null;
  restDistance: number | null;
  restTime: number | null;
  amount: number;
}

export interface IPlanDay extends Document {
  sessionName: string;
  distance: string | null;
  interval: IInterval | null;
  pace: string | null;
  time: string | null;
  intensity: string | null;
  type: string | null;
}

export interface IPlanWeek extends Document {
  monday: IPlanDay;
  tuesday: IPlanDay;
  wednesday: IPlanDay;
  thursday: IPlanDay;
  friday: IPlanDay;
  saturday: IPlanDay;
  sunday: IPlanDay;
}

export interface IPlan extends Document {
  name: string;
  length: number;
  type: string;
  target: string;
  trainings: IPlanWeek[];
}

const IntervalSchema: Schema = new Schema({
  fastDistance: { type: Number, required: false },
  fastTime: { type: Number, required: false },
  restDistance: { type: Number, required: false },
  restTime: { type: Number, required: false },
  amount: { type: Number, required: false },
});

const PlanDaySchema: Schema = new Schema({
  sessionName: { type: String, required: true },
  distance: { type: String, required: false },
  interval: { type: IntervalSchema, required: false },
  pace: { type: String, required: false },
  time: { type: String, required: false },
  intensity: { type: String, required: false },
  type: { type: String, required: false },
});

const PlanWeekSchema: Schema = new Schema({
  monday: { type: PlanDaySchema, required: true },
  tuesday: { type: PlanDaySchema, required: true },
  wednesday: { type: PlanDaySchema, required: true },
  thursday: { type: PlanDaySchema, required: true },
  friday: { type: PlanDaySchema, required: true },
  saturday: { type: PlanDaySchema, required: true },
  sunday: { type: PlanDaySchema, required: true },
});

export const PlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  length: { type: Number, required: false },
  type: { type: String, required: true },
  target: { type: String, required: false },
  trainings: { type: [PlanWeekSchema], required: false },
});

PlanSchema.plugin(uniqueValidator);

export const PlanModel = mongoose.model<IPlan>("Plan", PlanSchema);
