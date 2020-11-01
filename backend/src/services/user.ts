import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import fs from "fs";
import { IUser, IStravaActivity, UserModel, ITelegram } from "../models/user";
import { IPlan } from "../models/plan";
import { getAuthCode, getActivities } from "./strava";
import { logger } from "../app";

export interface TelegramInfo {
  email: string;
  chatId: number;
  firstName: string | null;
  username: string | null;
}

const keyPath = (): string => {
  const path = process.env.PRIVATE_KEY_PATH;
  if (!path) {
    throw new Error("Private key path is not set");
  }
  return path;
};

const privateKey = process.env.CI ? "" : fs.readFileSync(keyPath());

const userFromToken = async (token: string): Promise<IUser> => {
  const user = await UserModel.findOne({ authToken: token });
  if (!user) {
    logger.debug(`User with token ${token} not found`);
    throw new Error(`User with such token doesn't exist`);
  }
  logger.debug(`Retrieved user:  ${user.email}`);
  return user;
};

const userFromEmail = async (userEmail: string): Promise<IUser> => {
  logger.debug("Trying to retreive user with email " + userEmail);
  const user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    logger.debug(`User with email ${userEmail} not found`);
    throw new Error(`User with such email doesn't exists`);
  }
  logger.debug(`Retreived user: ${user.email}`);
  return user;
};

const userWithEmailExists = async (userEmail: string): Promise<boolean> => {
  try {
    await userFromEmail(userEmail);
  } catch (err) {
    logger.debug("Failed to find user");
    if (err === `User with such email doesn't exists`) {
      return false;
    }
    throw err;
  }
  return true;
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
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error(`User doesn't exist`);
  }
  const pwdCheck: boolean = await bcrypt.compare(password, user.password);
  if (!pwdCheck) {
    throw new Error(`Password does'nt match`);
  }
  const authToken = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, data: user.email },
    privateKey
  );
  await UserModel.findOneAndUpdate({ email }, { authToken });
  return authToken;
};

// TODO make smarted token validation, read on internet about that
export const validateToken = async (token: string): Promise<IUser> =>
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
  await UserModel.findOneAndUpdate({ authToken }, { stravaToken });
};

export const getStravaActivities = async (token: string): Promise<IUser> => {
  let user: IUser | null = await userFromToken(token);
  if (!user.stravaToken) {
    const stravaToken = await getAuthCode(user.stravaAcccessCode);
    logger.info(`Updating user token`);
    await UserModel.findByIdAndUpdate({ email: user.email }, { stravaToken });
    user = await UserModel.findOne({ email: user.email });
    if (!user) {
      throw new Error("Something went wrong, please retry");
    }
  }
  logger.debug(`Fetching activities for user: ${user.email}`);
  const activities: IStravaActivity[] = await getActivities(user.stravaToken);
  await UserModel.findOneAndUpdate(
    { email: user.email },
    { stravaActivities: activities }
  );
  const updatedUser = await UserModel.findOne({ email: user.email });
  logger.info("User activities were updated and user was fetched");
  if (!updatedUser) {
    throw new Error("Something went wrong during update!");
  }
  return updatedUser;
};

export const activatePlan = async (
  token: string,
  plan: IPlan
): Promise<IUser> => {
  await UserModel.findOneAndUpdate(
    { authToken: token },
    { activePlan: plan, planStartedDate: new Date() }
  );
  return await userFromToken(token);
};

export const stopPlan = async (token: string): Promise<IUser> => {
  await UserModel.findOneAndUpdate(
    { authToken: token },
    { activePlan: null, planStartedDate: null }
  );
  return await userFromToken(token);
};

// TODO: Add email verification
export const addTelegram = async (tgInfo: TelegramInfo): Promise<boolean> => {
  logger.info(`Adding telegram info ${tgInfo.username}`);
  const tg = {
    chatId: tgInfo.chatId,
    firstName: tgInfo.firstName,
    username: tgInfo.username,
  };
  if (userWithEmailExists(tgInfo.email)) {
    logger.debug("Updating user with telegram info");
    try {
      await UserModel.findOneAndUpdate(
        { email: tgInfo.email },
        {
          telegramInfo: tg,
        },
        { new: true }
      );
    } catch (e) {
      logger.debug("Error while updating telegram info");
      logger.debug(e);
      throw e;
    }
    return true;
  }
  return false;
};
