import { Request, Response, NextFunction } from "express";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isLoggedIn, userId } = req.session;
    if (!isLoggedIn || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default protect;
