import { Request, Response } from "express";
import prisma from "../database/prisma.connections";
import generateHash from "../utils/generateHash";

class UserController {
  public async create(req: Request, res: Response) {
    const { name, username, email, password } = req.body;
    try {
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          username,
          password: generateHash(password),
        },
      });
      console.log(newUser);

      if (newUser) {
        return res.status(200).json({
          success: true,
          msg: "User created.",
          data: {
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
          },
        });
      }

      return res.status(500).json({ success: false, msg: "User not created." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const users = await prisma.users.findMany({
        select: {
          email: true,
          name: true,
          username: true,
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "List users.", data: users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { username } = req.params;
    const { name, user, email, password } = req.body;

    try {
      const findUser = await prisma.users.findUnique({
        where: {
          username,
        },
      });
      if (!findUser) {
        return res.status(404).json({ success: false, msg: "User not found." });
      }
      if (name || username || email || password) {
        const updateUser = await prisma.users.update({
          where: {
            username,
          },
          data: {
            name,
            email,
            username: user,
            password,
          },
        });
        return res.status(200).json({
          success: true,
          msg: "User updated.",
          data: {
            name: updateUser.name,
            username: updateUser.username,
            email: updateUser.email,
          },
        });
      }
      return res
        .status(400)
        .json({ success: true, msg: "Student not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { username } = req.params;

    try {
      const findUser = await prisma.users.findUnique({
        where: {
          username,
        },
      });

      if (!findUser) {
        return res.status(404).json({ success: false, msg: "User not found." });
      }

      await prisma.users.delete({
        where: {
          username,
        },
      });
      return res.status(200).json({ success: true, msg: "User deleted." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default UserController;
