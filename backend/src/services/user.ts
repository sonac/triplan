import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import fs from "fs";
import { IUser, IStravaActivity, UserModel } from "../models/user";
import { getRefreshToken, getActivities } from "./strava";

const privateKey = fs.readFileSync(__dirname + "/../../../private.key");

const userFromToken = async (token: string): Promise<IUser> => {
  const user = await UserModel.findOne({ authToken: token });
  if (!user) {
    throw new Error(`User with such token doesn't exist`);
  }
  return user;
};

export const getUsers = () => {
  return [];
};

export const register = async (user: IUser): Promise<string> => {
  const hashedPwd = await bcrypt.hash(user.password, 10);
  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, data: user.email },
    privateKey
  );
  return UserModel.create({
    ...user,
    password: hashedPwd,
    authToken: token,
  })
    .then(() => token)
    .catch((e) => {
      throw new Error(e);
    });
};

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new Error(`User doesn't exist`);
  }
  const pwdCheck: Boolean = await bcrypt.compare(password, user.password);
  if (!pwdCheck) {
    throw new Error(`Password does'nt match`);
  }
  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, data: user.email },
    privateKey
  );
  await UserModel.findOneAndUpdate({ email: email }, { authToken: token });
  return token;
};

// TODO make smarted token validation, read on internet about that
export const validateToken = async (token: string): Promise<IUser | null> =>
  userFromToken(token);

export const addStravaAccessCode = async (
  code: string,
  token: string
): Promise<void> => {
  const user = await userFromToken(token);
  await UserModel.findOneAndUpdate(
    { email: user.email },
    { stravaAcccessCode: code, connectedToStrava: true }
  );
};

export const updateRefreshToken = async (
  stravaToken: string,
  authToken: string
): Promise<void> => {
  await UserModel.findOneAndUpdate(
    { authToken: authToken },
    { stravaToken: stravaToken }
  );
};

export const getStravaActivities = async (token: string): Promise<IUser> => {
  let user: IUser | null = await userFromToken(token);
  if (!user.stravaToken) {
    const token = await getRefreshToken(user.stravaAcccessCode);
    await UserModel.findByIdAndUpdate(
      { email: user.email },
      { stravaToken: token }
    );
    user = await UserModel.findOne({ email: user.email });
    if (!user) {
      throw new Error("Something went wrong, please retry");
    }
  }
  const activities: IStravaActivity[] = await getActivities(user.stravaToken);
  await UserModel.findOneAndUpdate(
    { email: user.email },
    { stravaActivities: activities }
  );
  const updatedUser = await UserModel.findOne({ email: user.email });
  console.log("User activities were updated and user was fetched");
  if (!updatedUser) {
    throw new Error("Something went wrong during update!");
  }
  return updatedUser;
};
