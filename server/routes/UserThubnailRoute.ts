import express from "express";
import {
  getUserThubnail,
  getSingleThubnail,
} from "../controller/UserController.ts";
import protect from "../middlewares/auth.ts";

const router = express.Router();

router.route("/").get(protect, getUserThubnail);
router.route("/:id").get(protect, getSingleThubnail);

export default router;
