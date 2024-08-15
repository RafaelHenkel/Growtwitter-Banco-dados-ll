import { Request, Response } from "express";
import prisma from "../database/prisma.connections";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

class LoginController {
  public async create(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
      if ((!username && !email) || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }

      const userFind = await prisma.users.findUnique({
        where: {
          email,
          username,
        },
      });

      if (!userFind || !bcrypt.compareSync(password, userFind.password)) {
        return res.status(401).json({
          success: false,
          msg: "Email/Username or password incorrect.",
        });
      }

      const token = uuid();

      await prisma.users.update({
        where: {
          id: userFind.id,
        },
        data: {
          token,
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "Login success", data: { token } });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default LoginController;
