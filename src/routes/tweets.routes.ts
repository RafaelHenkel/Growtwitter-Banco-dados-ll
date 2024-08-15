import { Router } from "express";
import TweetController from "../controller/tweet.controller";
import authMiddleware from "../middleware/auth.middleware";

const tweetsRoutes = () => {
  const router = Router();
  const controller = new TweetController();

  router.get("/", authMiddleware, controller.list);
  router.put("/:id", authMiddleware, controller.update);
  router.post("/", authMiddleware, controller.create);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

export default tweetsRoutes;
