import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "suraksha_setu_secret_key_12345";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name?: string;
    role: "patient" | "doctor" | "admin";
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name?: string; role: "patient" | "doctor" | "admin" };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is not valid" });
  }
};

export const requireRole = (roles: ("patient" | "doctor" | "admin")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};
