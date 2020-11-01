import { Router } from "express";
import { logger } from "../app";
import { addTelegram, TelegramInfo } from "../services/user";

const routes = Router();

routes.get("/api/telegram/start", (req, res) => {
  res.status(200).json({ message: "Heyo" });
});

routes.post("/api/telegram/update", (req, res) => {
  addTelegram(req.body)
    .then((r) => {
      if (r) {
        logger.info(
          `Telegram info for user ${req.body.email} successfully addeed`
        );
        res.send(r);
      } else {
        logger.error("Failed to add telegram info for user");
        res.status(400).send("Failed");
      }
    })
    .catch((e) => {
      logger.error("Error while adding telegram info, ", e.message);
      res.status(500).send("Error while processing request");
    });
});

export default routes;
