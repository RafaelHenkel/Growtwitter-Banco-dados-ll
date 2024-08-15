import { Router } from "express";
import UserController from "../controller/user.controller";

const userRoutes = () => {
  const router = Router();
  const controller = new UserController();

  router.get("/", controller.list); // LISTAR TODOS OS USERS
  router.put("/:username", controller.update); // ATUALIZAR ALGUM DADO DO USER
  router.post("/", controller.create); // CRIAR UM NOVO USER
  router.delete("/:username", controller.delete); // DELETAR ALGUM USER

  return router;
};

export default userRoutes;
