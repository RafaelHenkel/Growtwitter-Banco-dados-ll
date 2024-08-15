import { Router } from "express";
import LikeController from "../controller/like.controller";
import authMiddleware from "../middleware/auth.middleware";

const likesRoutes = () => {
  const router = Router();
  const controller = new LikeController();

  router.post("/", authMiddleware, controller.create); // CRIAR UM LIKE
  router.get("/", authMiddleware, controller.list); // LISTAR TODOS OS LIKES
  router.delete("/:tweetId", authMiddleware, controller.delete); // DELETAR ALGUM LIKE

  return router;
};

export default likesRoutes;
