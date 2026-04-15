import { Router } from "express";
import { getPublicContent } from "../controllers/contentController.js";

const router = Router();

router.get("/content", getPublicContent);

export default router;
