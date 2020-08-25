import fetch, { HeadersInit, Headers } from "node-fetch";
import { IStravaActivity } from "../models/user";
import { camelCaseKeys, parseFloatOrNull } from "../utils/anyUtils";
import { logger } from "../app";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const getAccessToken = async (refreshToken: string): Promise<string> => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  logger.debug("Headers are: ", headers);
  const req = fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
  const resp = await req;
  logger.debug(`Resp is: ${resp}`);
  const stravaUser = await resp.json();
  return stravaUser.access_token;
};

export const jsonToStravaActivity = (parsed: any): IStravaActivity => {
  logger.debug(parsed);
  // @ts-ignore
  return {
    id: parseInt(parsed.id, 10),
    distance: parseFloat(parsed.distance),
    movingTime: parseFloat(parsed.movingTime),
    elapsedTime: parseFloat(parsed.elapsedTime),
    activityType: parsed.type.toString(),
    startDate: new Date(parsed.startDate.toString()),
    averageSpeed: parseFloatOrNull(parsed.averageSpeed),
    averageWatts: parseFloatOrNull(parsed.averageWatts),
    mapPolyline: parsed.map.summaryPolyline
      ? parsed.map.summaryPolyline.toString()
      : null,
  };
};

export const getAuthCode = async (code: string): Promise<string> => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
  };
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const req = fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
  const resp = await req;
  const stravaUser = await resp.json();
  return stravaUser.refresh_token;
};

export const getActivities = async (
  token: string
): Promise<IStravaActivity[]> => {
  const accessToken = await getAccessToken(token);
  const authHeader: HeadersInit = { Authorization: `Bearer ${accessToken}` };
  const headers = new Headers(authHeader);
  logger.debug("Headers are: ", headers);
  const resp = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    method: "GET",
    headers: headers,
  });
  logger.debug(`Response is: ${resp}`);
  const stravaActivitiesJson = await resp.json();
  logger.debug(`Fetched activities: ${stravaActivitiesJson}`);
  const caramelized = camelCaseKeys(stravaActivitiesJson);
  // @ts-ignore
  const stravaActivities = caramelized.map((activity: any) =>
    jsonToStravaActivity(activity)
  );
  logger.info("Strava activities from API were successfully fetched");
  return stravaActivities;
};
