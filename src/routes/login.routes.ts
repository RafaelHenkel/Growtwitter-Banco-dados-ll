import { Router } from "express";
import LoginController from "../controller/login.controller";

const loginRoutes = () => {
  const router = Router();
  const controller = new LoginController();

  router.post("/", controller.create);

  return router;
};

export default loginRoutes;
