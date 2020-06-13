import express from "express";
import cors from "cors";
import {
  getUsers,
  register,
  login,
  validateToken,
  getStravaActivities,
  addStravaAccessCode,
  updateRefreshToken,
} from "./services/user";
import bodyParser from "body-parser";
import { IncomingHttpHeaders } from "http";
import { getRefreshToken } from "./services/strava";
import { addPlan, getAllPlans } from "./services/plan";
import console from "console";

const app = express();

const hasToken = (headers: IncomingHttpHeaders): string | undefined => {
  const bearer = headers["authorization"];
  if (bearer) {
    return bearer.split(" ")[1];
  }
};

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Triplan!");
});

app.get("/api/v1/users", (req, res) => {
  res.send(getUsers());
});

app.post("/api/v1/user/register", (req, res) => {
  register(req.body)
    .then((token) => {
      res.send(JSON.stringify({ apiKey: token }));
    })
    .catch((e) => {
      let errMsg: string;
      if (e.toString().includes("ValidationError:")) {
        errMsg = "User already exists";
      } else {
        errMsg = "Something went wrong";
      }
      res.status(400).send(errMsg);
    });
});

app.post("/api/v1/user/login", (req, res) => {
  const { email, password } = req.body;
  login(email, password)
    .then((token) => {
      res.send(JSON.stringify({ apiKey: token }));
    })
    .catch((e) => {
      console.error(e);
      res.status(400).send(e.message);
    });
});

app.get("/api/v1/user/validate", (req, res) => {
  const token = hasToken(req.headers);
  if (!token) {
    res.status(400).send("No token");
  } else {
    validateToken(token).then((user) => {
      if (user) {
        res.send(
          JSON.stringify({
            email: user.email,
            connectedToStrava: user.connectedToStrava,
          })
        );
      } else {
        res.status(400).send("Token is not valid");
      }
    });
  }
});

app.post("/api/v1/user/strava-access-code", (req, res) => {
  const token = hasToken(req.headers);
  if (!token) {
    res.status(400).send("No token");
  } else {
    addStravaAccessCode(req.body.code, token)
      .then(() => {
        getRefreshToken(req.body.code)
          .then((stravaToken) => {
            if (stravaToken) {
              updateRefreshToken(stravaToken, token)
                .then(() => res.send("Code added"))
                .catch((err) => {
                  console.error(
                    "Error happened during strava token update " + err.message
                  );
                  res.status(500).send("Token update error");
                });
            }
          })
          .catch((err) => {
            console.error(
              "Error happened during strava token fetch " + err.message
            );
            res.status(500).send("Strava API call error");
          });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).send(err.message);
      });
  }
});

app.get("/api/v1/user/fetch-activities", (req, res) => {
  const token = hasToken(req.headers);
  if (!token) {
    res.status(400).send("No token");
  } else {
    getStravaActivities(token)
      .then((user) => {
        if (user) {
          res.send(
            JSON.stringify({
              email: user.email,
              connectedToStrava: user.connectedToStrava,
              stravaActivities: user.stravaActivities,
            })
          );
        } else {
          res.status(400).send("Something is wrong");
        }
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).send(err.message);
      });
  }
});

app.post("/api/v1/plan", (req, res) => {
  addPlan(req.body)
    .then(() => {
      console.log("Adding plan request was processed");
      res.send("Plan added successfully");
    })
    .catch((e) => {
      console.error("Error while adding plan" + e);
      res.status(400).send(e);
    });
});

app.get("/api/v1/plan/all", (req, res) => {
  getAllPlans()
    .then((plans) => {
      console.log("Plans retrieved");
      res.send(JSON.stringify(plans));
    })
    .catch((e) => {
      console.error("Error retrieving plans " + e.message);
      res.status(500).send(e.message);
    });
});

export default app;