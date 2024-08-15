import { Router } from "express";
import UserController from "../controller/user.controller";

const userRoutes = () => {
  const router = Router();
  const controller = new UserController();

  router.get("/", controller.list);
  router.put("/:username", controller.update);
  router.post("/", controller.create);
  router.delete("/:username", controller.delete);

  return router;
};

export default userRoutes;
