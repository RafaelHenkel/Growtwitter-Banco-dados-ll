import { Request, Response } from "express";
import prisma from "../database/prisma.connections";

class FollowController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { username } = req.body;
    try {
      const following = await prisma.users.findUnique({
        where: {
          username,
        },
      });
      if (!following) {
        return res
          .status(400)
          .json({ success: false, msg: "Following not found." });
      }
      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }

      if (user.username === following.username) {
        return res
          .status(400)
          .json({ success: false, msg: "You can't follow yourself." });
      }

      const alreadyFollow = await prisma.follows.findFirst({
        where: {
          userId: user.id,
          followId: following.id,
        },
      });

      if (alreadyFollow) {
        return res
          .status(400)
          .json({ success: false, msg: "You already follow this user." });
      }

      const follow = await prisma.follows.create({
        data: {
          userId: user.id,
          followId: following.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Followed successful.",
        data: { User: follow.userId, Seguindo: follow.followId },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const follows = await prisma.follows.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
          follow: {
            select: {
              username: true,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        msg: "List follows.",
        data: follows,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { username } = req.body;
    try {
      const following = await prisma.users.findUnique({
        where: {
          username,
        },
      });
      if (!following) {
        return res
          .status(400)
          .json({ success: false, msg: "Following not found." });
      }
      const user = await prisma.users.findFirst({
        where: {
          token,
        },
      });
      if (!user) {
        return res.status(400).json({ success: false, msg: "User not found." });
      }

      const follow = await prisma.follows.findFirst({
        where: {
          userId: user.id,
          AND: {
            followId: following.id,
          },
        },
      });
      if (!follow) {
        return res
          .status(400)
          .json({ success: false, msg: "User not follow this user." });
      }

      await prisma.follows.delete({
        where: {
          id: follow.id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Stopped following.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default FollowController;
