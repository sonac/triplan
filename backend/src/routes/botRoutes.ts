import { Router } from "express";

const routes = Router();

routes.get("/api/telegram/start", (req, res) => {
  res.status(200).json({ message: "Heyo" });
});

export default routes;
