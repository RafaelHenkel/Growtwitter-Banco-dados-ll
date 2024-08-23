import { Request, Response } from "express";
import prisma from "../database/prisma.connections";

class TweetController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { content } = req.body;
    try {
      if (!content) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }

      const findUser = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (!findUser) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }

      const tweet = await prisma.tweets.create({
        data: {
          content,
          userId: findUser.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Tweet created.",
        data: tweet,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const tweets = await prisma.tweets.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, msg: "List tweets.", data: tweets });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    const { content } = req.body;

    try {
      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });

      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }

      const tweet = await prisma.tweets.findFirst({
        where: {
          id,
          AND: {
            userId: user.id,
          },
        },
      });

      if (!tweet) {
        return res
          .status(400)
          .json({ success: false, msg: "This tweet is not from this user." });
      }

      const findTweet = await prisma.tweets.findUnique({
        where: {
          id,
        },
      });
      if (!findTweet) {
        return res
          .status(400)
          .json({ success: false, msg: "Tweet not found." });
      }

      const tweetUpdate = await prisma.tweets.update({
        where: {
          id,
        },
        data: {
          content,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Tweet updated.",
        data: tweetUpdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;

    try {
      const findTweet = await prisma.tweets.findUnique({
        where: {
          id,
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

      const tweet = await prisma.tweets.findFirst({
        where: {
          id,
          AND: {
            userId: user.id,
          },
        },
      });

      if (!tweet) {
        return res
          .status(400)
          .json({ success: false, msg: "This tweet is not from this user." });
      }

      await prisma.tweets.delete({
        where: {
          id: tweet.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Tweet deleted.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default TweetController;
