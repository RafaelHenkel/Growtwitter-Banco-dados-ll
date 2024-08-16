import { Request, Response } from "express";
import prisma from "../database/prisma.connections";

class LikeController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { tweetId } = req.body;
    try {
      const findUser = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (!findUser) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }
      if (!tweetId) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }

      const alreadyLiked = await prisma.likes.findFirst({
        where: {
          tweetId,
          userId: findUser.id,
        },
      });

      if (alreadyLiked) {
        return res
          .status(400)
          .json({ success: false, msg: "You already liked this." });
      }
      const like = await prisma.likes.create({
        data: {
          tweetId,
          userId: findUser.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "You like this.",
        data: like,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const likes = await prisma.likes.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
          tweet: {
            select: {
              content: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, msg: "List likes.", data: likes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { tweetId } = req.params;
    try {
      const findTweet = await prisma.tweets.findUnique({
        where: {
          id: tweetId,
        },
      });

      if (!findTweet) {
        return res
          .status(400)
          .json({ success: false, msg: "Tweet not found." });
      }

      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }

      const like = await prisma.likes.findFirst({
        where: {
          tweetId,
          AND: {
            userId: user.id,
          },
        },
      });

      if (!like) {
        return res
          .status(400)
          .json({ success: false, msg: "You haven't liked this tweet." });
      }

      await prisma.likes.delete({
        where: {
          id: like.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Like removed.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default LikeController;
