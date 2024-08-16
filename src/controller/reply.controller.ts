import { Request, Response } from "express";
import prisma from "../database/prisma.connections";

class ReplyController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { tweetId, referenceId } = req.body;
    try {
      if (!tweetId || !referenceId) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }
      const tweet = await prisma.tweets.findUnique({
        where: {
          id: tweetId,
        },
      });
      if (!tweet) {
        return res
          .status(400)
          .json({ success: false, msg: "Tweet reply not found." });
      }

      const reference = await prisma.tweets.findUnique({
        where: {
          id: referenceId,
        },
      });
      if (!reference) {
        return res
          .status(400)
          .json({ success: false, msg: "Tweet reference not found." });
      }

      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });

      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }
      await prisma.tweets.update({
        where: {
          id: tweetId,
        },
        data: {
          tweetType: "R",
        },
      });
      const reply = await prisma.replies.create({
        data: {
          userId: user?.id,
          tweetId,
          referenceId,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Retweet posted.",
        data: reply,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const replies = await prisma.replies.findMany({
        include: {
          reference: {
            select: {
              content: true,
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          },
          tweet: {
            select: {
              content: true,
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "List tweets.", data: replies });
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
      const reply = await prisma.replies.findFirst({
        where: {
          tweetId,
          AND: {
            userId: user.id,
          },
        },
      });
      if (!reply) {
        return res
          .status(400)
          .json({ success: false, msg: "This reply is not from this user." });
      }

      await prisma.replies.delete({
        where: {
          id: reply.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Reply deleted.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default ReplyController;
