import { NextFunction, Request, Response } from "express";
import prisma from "../database/prisma.connections";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const user = await prisma.users.findFirst({
      where: {
        token: authHeader,
      },
    });
    if (user) {
      return next();
    }
  }

  return res.status(401).json({ success: false, msg: "User not logged" });
}

export default authMiddleware;
