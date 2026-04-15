import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
    },
    name: {
      type: String,
      default: "Your Name",
    },
    title: {
      type: String,
      default: "Creative Developer",
    },
    intro: {
      type: String,
      default: "I build calm, thoughtful digital products with a focus on clarity and detail.",
    },
    bio: {
      type: String,
      default: "A multidisciplinary builder with an eye for polished interfaces, performant systems, and sustainable design decisions.",
    },
    aboutHtml: {
      type: String,
      default:
        "<p>I enjoy shaping products end to end, from research and interface systems to production-ready frontend and backend architecture.</p>",
    },
    profileImage: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "hello@example.com",
    },
    location: {
      type: String,
      default: "Colombo, Sri Lanka",
    },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
