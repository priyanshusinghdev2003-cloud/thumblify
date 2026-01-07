import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.ts";

export const getUserThubnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const thumbnail = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
    if (!thumbnail) {
      return res.status(404).json({
        message: "Thubnails not found or There is no Generated Thubnail",
      });
    }
    return res.status(200).json({ thumbnail });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const getSingleThubnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const thumbnail = await Thumbnail.findById({ _id: id, userId });
    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }
    return res.status(200).json({ thumbnail });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
