import { Router } from "express";
import {
  createLink,
  createProject,
  createSkillCategory,
  deleteLink,
  deleteProject,
  deleteSkillCategory,
  getAdminContent,
  getDashboardOverview,
  updateAbout,
  updateLink,
  updateProfile,
  updateProject,
  updateSkillCategory,
  uploadImage,
} from "../controllers/contentController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", getDashboardOverview);
router.get("/content", getAdminContent);
router.put("/profile", updateProfile);
router.put("/about", updateAbout);

router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

router.post("/skills", createSkillCategory);
router.put("/skills/:id", updateSkillCategory);
router.delete("/skills/:id", deleteSkillCategory);

router.post("/links", createLink);
router.put("/links/:id", updateLink);
router.delete("/links/:id", deleteLink);

router.post("/upload", upload.single("image"), uploadImage);

export default router;
