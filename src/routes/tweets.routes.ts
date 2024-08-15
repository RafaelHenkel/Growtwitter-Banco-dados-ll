import { Router } from "express";
import TweetController from "../controller/tweet.controller";
import authMiddleware from "../middleware/auth.middleware";

const tweetsRoutes = () => {
  const router = Router();
  const controller = new TweetController();

  router.get("/", authMiddleware, controller.list); // LISTAR TODOS OS TWEETS
  router.put("/:id", authMiddleware, controller.update); // ATUALIZAR ALGUM TWEET
  router.post("/", authMiddleware, controller.create); // CRIAR ALGUM TWEET
  router.delete("/:id", authMiddleware, controller.delete); // DELETAR ALGUM TWEET

  return router;
};

export default tweetsRoutes;
