import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IPlan, PlanSchema } from "./plan";

export interface IStravaActivity extends Document {
  id: number;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  activityType: string;
  startDate: Date;
  averageSpeed: number | null;
  averageWatts: number | null;
  mapPolyline: string | null;
}

export interface IUser extends Document {
  email: string;
  password: string;
  createdOn: Date;
  connectedToStrava: boolean;
  authToken: string;
  stravaToken: string;
  stravaAcccessCode: string;
  stravaActivities: IStravaActivity[];
  activePlan: IPlan | null;
  planStartedDate: Date | null;
}

const StravaSchema: Schema = new Schema({
  id: { type: Number, required: true },
  distance: { type: Number, required: true },
  movingTime: { type: Number, required: true },
  elapsedTime: { type: Number, required: true },
  activityType: { type: String, required: true },
  startDate: { type: Date, required: true },
  averageSpeed: { type: Number, required: false },
  averageWatts: { type: Number, required: false },
  mapPolyline: { type: String, required: false },
});

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now },
  authToken: { type: String, required: false, unique: true },
  connectedToStrava: { type: Boolean, required: true, default: false },
  stravaToken: { type: String, required: false },
  stravaAcccessCode: { type: String, required: false },
  stravaActivities: { type: [StravaSchema], required: false },
  activePlan: { type: PlanSchema, required: false },
  planStartedDate: { type: Date, required: false },
});

UserSchema.plugin(uniqueValidator);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
