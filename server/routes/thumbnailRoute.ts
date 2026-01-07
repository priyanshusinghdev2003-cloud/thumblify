import express from "express";

import protect from "../middlewares/auth.ts";
import {
  deleteThumbnail,
  generateThumbnail,
} from "../controller/thumbnailController.ts";

const router = express.Router();

router.route("/generate").post(protect, generateThumbnail);
router.route("/delete/:thumbnailId").delete(protect, deleteThumbnail);

export default router;
