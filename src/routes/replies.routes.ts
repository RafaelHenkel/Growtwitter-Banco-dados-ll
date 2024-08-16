import { Router } from "express";
import ReplyController from "../controller/reply.controller";
import authMiddleware from "../middleware/auth.middleware";

const repliesRoutes = () => {
  const router = Router();
  const controller = new ReplyController();

  router.get("/", authMiddleware, controller.list); // LISTAR TODOS OS REPLY
  router.post("/", authMiddleware, controller.create); // CRIAR NOVO REPLY
  router.delete("/:tweetId", authMiddleware, controller.delete); // DELETAR REPLY

  return router;
};

export default repliesRoutes;
