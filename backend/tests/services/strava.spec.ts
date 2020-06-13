import { expect } from "chai";
import { IStravaActivity } from "../../src/models/user";
import { jsonToStravaActivity } from "../../src/services/strava";

describe("json to interface", () => {
  it("should properly transform json to IStravaActivity interface", () => {
    const data = `{   "resourceState":2,
          "athlete":{
            "id":123,
            "resourceState":1
          
      },
          "name":"Evening Ride",
          "distance":123.1,
          "movingTime":4020,
          "elapsedTime":4472,
          "totalElevationGain":150.9,
          "type":"Ride",
          "workoutType":null,
          "id":123123123,
          "externalId":"garmin_push_333",
          "uploadId":123,
          "startDate":"2010-01-15T17:25:26Z",
          "startDateLocal":"2010-01-15T19:25:26Z",
          "timezone":"(GMT+01:00) Europe/Berlin",
          "utcOffset":7200,
          "startLatlng":[
            111.222,
            11.44444
          
      ],
          "endLatlng":[
            111.333,
            11.3333
          
      ],
          "locationCity":null,
          "locationState":null,
          "locationCountry":null,
          "startLatitude":33.2222,
          "startLongitude":33.22222,
          "achievementCount":1,
          "kudosCount":4,
          "commentCount":0,
          "athleteCount":2,
          "photoCount":0,
          "map":{
            "id":"a123123123",
            "summaryPolyline":"osxpHs_",
            "resourceState":2
          
      },
          "trainer":false,
          "commute":false,
          "manual":false,
          "private":false,
          "visibility":"everyone",
          "flagged":false,
          "gearId":null,
          "fromAcceptedTag":false,
          "uploadIdStr":"123123123",
          "averageSpeed":7.955,
          "maxSpeed":12.8,
          "deviceWatts":false,
          "hasHeartrate":true,
          "averageHeartrate":144.6,
          "maxHeartrate":167,
          "heartrateOptOut":false,
          "displayHideHeartrateOption":true,
          "elevHigh":169.9,
          "elevLow":102.9,
          "prCount":0,
          "totalPhotoCount":0,
          "hasKudoed":false
      }`;
    const parsedActivity = jsonToStravaActivity(JSON.parse(data));
    const expected: IStravaActivity = {
      id: 123123123,
      distance: 123.1,
      movingTime: 4020,
      elapsedTime: 4472,
      activityType: "Ride",
      startDate: new Date("2010-01-15T17:25:26Z"),
      averageSpeed: 7.955,
      averageWatts: null,
      mapPolyline: "osxpHs_",
    };
    expect(parsedActivity).to.eql(expected);
  });
  it("should parse array of activities", () => {
    const data = `[
      {
          "resourceState": 2,
          "athlete": {
              "id": 123,
              "resourceState": 1
          },
          "name": "Evening Ride",
          "distance": 123.1,
          "movingTime": 4020,
          "elapsedTime": 4472,
          "totalElevationGain": 150.9,
          "type": "Ride",
          "workoutType": null,
          "id": 123123123,
          "externalId": "garmin_push_333",
          "uploadId": 123,
          "startDate": "2010-01-15T17:25:26Z",
          "startDateLocal": "2010-01-15T19:25:26Z",
          "timezone": "(GMT+01:00) Europe/Berlin",
          "utcOffset": 7200,
          "startLatlng": [
              111.222,
              11.44444
          ],
          "endLatlng": [
              111.333,
              11.3333
          ],
          "locationCity": null,
          "locationState": null,
          "locationCountry": null,
          "startLatitude": 33.2222,
          "startLongitude": 33.22222,
          "achievementCount": 1,
          "kudosCount": 4,
          "commentCount": 0,
          "athleteCount": 2,
          "photoCount": 0,
          "map": {
              "id": "a123123123",
              "summaryPolyline": "osxpHs_",
              "resourceState": 2
          },
          "trainer": false,
          "commute": false,
          "manual": false,
          "private": false,
          "visibility": "everyone",
          "flagged": false,
          "gearId": null,
          "fromAcceptedTag": false,
          "uploadIdStr": "123123123",
          "averageSpeed": 7.955,
          "maxSpeed": 12.8,
          "deviceWatts": false,
          "hasHeartrate": true,
          "averageHeartrate": 144.6,
          "maxHeartrate": 167,
          "heartrateOptOut": false,
          "displayHideHeartrateOption": true,
          "elevHigh": 169.9,
          "elevLow": 102.9,
          "prCount": 0,
          "totalPhotoCount": 0,
          "hasKudoed": false
      },
      {
          "resourceState": 2,
          "athlete": {
              "id": 123,
              "resourceState": 1
          },
          "name": "Evening Ride",
          "distance": 123.1,
          "movingTime": 4020,
          "elapsedTime": 4472,
          "totalElevationGain": 150.9,
          "type": "Ride",
          "workoutType": null,
          "id": 123123123,
          "externalId": "garmin_push_333",
          "uploadId": 123,
          "startDate": "2010-01-15T17:25:26Z",
          "startDateLocal": "2010-01-15T19:25:26Z",
          "timezone": "(GMT+01:00) Europe/Berlin",
          "utcOffset": 7200,
          "startLatlng": [
              111.222,
              11.44444
          ],
          "endLatlng": [
              111.333,
              11.3333
          ],
          "locationCity": null,
          "locationState": null,
          "locationCountry": null,
          "startLatitude": 33.2222,
          "startLongitude": 33.22222,
          "achievementCount": 1,
          "kudosCount": 4,
          "commentCount": 0,
          "athleteCount": 2,
          "photoCount": 0,
          "map": {
              "id": "a123123123",
              "summaryPolyline": "osxpHs_",
              "resourceState": 2
          },
          "trainer": false,
          "commute": false,
          "manual": false,
          "private": false,
          "visibility": "everyone",
          "flagged": false,
          "gearId": null,
          "fromAcceptedTag": false,
          "uploadIdStr": "123123123",
          "averageSpeed": 7.955,
          "maxSpeed": 12.8,
          "deviceWatts": false,
          "hasHeartrate": true,
          "averageHeartrate": 144.6,
          "maxHeartrate": 167,
          "heartrateOptOut": false,
          "displayHideHeartrateOption": true,
          "elevHigh": 169.9,
          "elevLow": 102.9,
          "prCount": 0,
          "totalPhotoCount": 0,
          "hasKudoed": false
      }
  ]`;
    const parsedActivities = JSON.parse(data).map((activity: object) =>
      jsonToStravaActivity(activity)
    );
    const expected: IStravaActivity[] = [
      {
        id: 123123123,
        distance: 123.1,
        movingTime: 4020,
        elapsedTime: 4472,
        activityType: "Ride",
        startDate: new Date("2010-01-15T17:25:26Z"),
        averageSpeed: 7.955,
        averageWatts: null,
        mapPolyline: "osxpHs_",
      },
      {
        id: 123123123,
        distance: 123.1,
        movingTime: 4020,
        elapsedTime: 4472,
        activityType: "Ride",
        startDate: new Date("2010-01-15T17:25:26Z"),
        averageSpeed: 7.955,
        averageWatts: null,
        mapPolyline: "osxpHs_",
      },
    ];
    expect(parsedActivities).to.eql(expected);
  });
});
