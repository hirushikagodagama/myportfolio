import bcrypt from "bcryptjs";
import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { SkillCategory } from "../models/SkillCategory.js";
import { SocialLink } from "../models/SocialLink.js";
import { User } from "../models/User.js";

export const seedInitialData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured");
  }

  const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      email: adminEmail.toLowerCase(),
      passwordHash,
    });
  }

  await SiteContent.updateOne(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        name: "Hirushika Godagama",
        title: "Full-Stack Developer",
        intro: "I design and ship elegant digital experiences with a strong bias for simplicity.",
        bio: "Focused on modern interfaces, maintainable backend systems, and product-minded execution.",
        email: "hello@hirushika.dev",
        location: "Sri Lanka",
        aboutHtml:
          "<p>I help turn ideas into thoughtful, scalable products. My work sits at the intersection of product design, frontend engineering, and practical backend architecture.</p><p>I care about clear communication, refined interfaces, and systems that remain pleasant to maintain over time.</p>",
      },
    },
    { upsert: true }
  );

  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: "Portfolio CMS",
        description:
          "A minimal portfolio platform with a streamlined admin workflow for managing content without touching code.",
        techStack: ["React", "Tailwind CSS", "Express", "MongoDB"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/example/portfolio",
        order: 1,
      },
      {
        title: "Brand Studio Site",
        description:
          "Marketing website for a boutique creative studio with editorial layouts, micro-interactions, and lightweight content management.",
        techStack: ["React", "GSAP", "Node.js"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/example/studio-site",
        order: 2,
      },
    ]);
  }

  if ((await SkillCategory.countDocuments()) === 0) {
    await SkillCategory.insertMany([
      {
        name: "Frontend",
        items: ["React", "Tailwind CSS", "TypeScript", "Design Systems"],
        order: 1,
      },
      {
        name: "Backend",
        items: ["Node.js", "Express", "MongoDB", "REST APIs"],
        order: 2,
      },
      {
        name: "Workflow",
        items: ["Figma", "Git", "Content Strategy", "Performance"],
        order: 3,
      },
    ]);
  }

  if ((await SocialLink.countDocuments()) === 0) {
    await SocialLink.insertMany([
      {
        label: "GitHub",
        url: "https://github.com",
        icon: "github",
        order: 1,
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com",
        icon: "linkedin",
        order: 2,
      },
      {
        label: "Instagram",
        url: "https://instagram.com",
        icon: "instagram",
        order: 3,
      },
    ]);
  }
};
