import { Router } from "express";
import UserController from "../controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";

const userRoutes = () => {
  const router = Router();
  const controller = new UserController();

  router.get("/", authMiddleware, controller.list);
  router.put("/:username", authMiddleware, controller.update);
  router.post("/", controller.create);
  router.delete("/:username", authMiddleware, controller.delete);

  return router;
};

export default userRoutes;
