import { Router } from "express";
import { getPublicContent, getPublicProject } from "../controllers/contentController.js";

const router = Router();

router.get("/content", getPublicContent);
router.get("/projects/:id", getPublicProject);

export default router;
