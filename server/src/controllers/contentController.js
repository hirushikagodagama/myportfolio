import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { SkillCategory } from "../models/SkillCategory.js";
import { SocialLink } from "../models/SocialLink.js";

export const getPublicContent = async (_req, res) => {
  const [profile, projects, skills, links] = await Promise.all([
    SiteContent.findOne({ key: "main" }),
    Project.find().sort({ order: 1, createdAt: -1 }),
    SkillCategory.find().sort({ order: 1, createdAt: 1 }),
    SocialLink.find().sort({ order: 1, createdAt: 1 }),
  ]);

  return res.json({ profile, projects, skills, links });
};

export const getDashboardOverview = async (_req, res) => {
  const [projectsCount, skillsCount, linksCount, profile] = await Promise.all([
    Project.countDocuments(),
    SkillCategory.countDocuments(),
    SocialLink.countDocuments(),
    SiteContent.findOne({ key: "main" }),
  ]);

  return res.json({
    projectsCount,
    skillsCount,
    linksCount,
    completionScore: [
      profile?.name,
      profile?.title,
      profile?.intro,
      profile?.profileImage,
      profile?.aboutHtml,
    ].filter(Boolean).length * 20,
  });
};

export const getAdminContent = async (_req, res) => {
  const [profile, projects, skills, links] = await Promise.all([
    SiteContent.findOne({ key: "main" }),
    Project.find().sort({ order: 1, createdAt: -1 }),
    SkillCategory.find().sort({ order: 1, createdAt: 1 }),
    SocialLink.find().sort({ order: 1, createdAt: 1 }),
  ]);

  return res.json({ profile, projects, skills, links });
};

export const updateProfile = async (req, res) => {
  const payload = (({
    name,
    title,
    intro,
    bio,
    email,
    location,
    profileImage,
  }) => ({
    name,
    title,
    intro,
    bio,
    email,
    location,
    profileImage,
  }))(req.body);

  const profile = await SiteContent.findOneAndUpdate({ key: "main" }, payload, {
    new: true,
    upsert: true,
  });

  return res.json(profile);
};

export const updateAbout = async (req, res) => {
  const profile = await SiteContent.findOneAndUpdate(
    { key: "main" },
    { aboutHtml: req.body.aboutHtml },
    { new: true, upsert: true }
  );

  return res.json(profile);
};

export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    techStack: Array.isArray(req.body.techStack)
      ? req.body.techStack
      : String(req.body.techStack || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  });

  return res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      techStack: Array.isArray(req.body.techStack)
        ? req.body.techStack
        : String(req.body.techStack || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    },
    { new: true }
  );

  return res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};

export const createSkillCategory = async (req, res) => {
  const category = await SkillCategory.create({
    ...req.body,
    items: Array.isArray(req.body.items)
      ? req.body.items
      : String(req.body.items || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  });

  return res.status(201).json(category);
};

export const updateSkillCategory = async (req, res) => {
  const category = await SkillCategory.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      items: Array.isArray(req.body.items)
        ? req.body.items
        : String(req.body.items || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    },
    { new: true }
  );

  return res.json(category);
};

export const deleteSkillCategory = async (req, res) => {
  await SkillCategory.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};

export const createLink = async (req, res) => {
  const link = await SocialLink.create(req.body);
  return res.status(201).json(link);
};

export const updateLink = async (req, res) => {
  const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.json(link);
};

export const deleteLink = async (req, res) => {
  await SocialLink.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  return res.status(201).json({
    url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
};
