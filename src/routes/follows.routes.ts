import { Router } from "express";
import FollowController from "../controller/follow.controller";
import authMiddleware from "../middleware/auth.middleware";

const followsRoutes = () => {
  const router = Router();
  const controller = new FollowController();

  router.post("/", authMiddleware, controller.create); // SEGUIR ALGUM USER
  router.get("/", authMiddleware, controller.list); // PARAR DE SEGUIR ALGUM USER
  router.delete("/", authMiddleware, controller.delete); // PARAR DE SEGUIR ALGUM USER

  return router;
};

export default followsRoutes;
