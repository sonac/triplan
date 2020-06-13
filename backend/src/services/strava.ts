import fetch, { HeadersInit, Headers } from "node-fetch";
import { IStravaActivity } from "../models/user";

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
  const req = fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const resp = await req;
  const stravaUser = await resp.json();
  return stravaUser["access_token"];
};

const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );

const camelCaseKeys = (obj: any): Record<string, unknown> | Array<unknown> => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key: string) => ({
        ...result,
        [snakeToCamel(key)]: camelCaseKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

const parseFloatOrNull = (val: string): number | null => {
  const parsed = parseFloat(val);
  if (!parsed) {
    console.log(`${val} cannot be parsed to float, returning null`);
    return null;
  }
  return parsed;
};

export const jsonToStravaActivity = (parsed: any): IStravaActivity => {
  //@ts-ignore
  return {
    id: parseInt(parsed.id),
    distance: parseFloat(parsed.distance),
    movingTime: parseFloat(parsed.movingTime),
    elapsedTime: parseFloat(parsed.elapsedTime),
    activityType: parsed.type.toString(),
    startDate: new Date(parsed.startDate.toString()),
    averageSpeed: parseFloatOrNull(parsed.averageSpeed),
    averageWatts: parseFloatOrNull(parsed.averageWatts),
    mapPolyline: parsed.map.summaryPolyline.toString(),
  };
};

export const getRefreshToken = async (code: string): Promise<string> => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
  };
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const req = fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const resp = await req;
  const stravaUser = await resp.json();
  return stravaUser["refresh_token"];
};

export const refreshToken = async (token: string): Promise<string> => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: token,
    grant_type: "refresh_token",
  };
  const resp = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const stravaUser = await resp.json();
  return stravaUser.stravaToken;
};

export const getActivities = async (
  token: string
): Promise<IStravaActivity[]> => {
  const accessToken = await getAccessToken(token);
  const authHeader: HeadersInit = { Authorization: `Bearer ${accessToken}` };
  const headers = new Headers(authHeader);
  const resp = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    method: "GET",
    headers: headers,
  });
  const stravaActivitiesJson = await resp.json();
  const caramelized = camelCaseKeys(stravaActivitiesJson);
  //@ts-ignore
  const stravaActivities = caramelized.map((activity: any) =>
    jsonToStravaActivity(activity)
  );
  console.log("Strava activities from API were successfully fetched");
  return stravaActivities;
};
