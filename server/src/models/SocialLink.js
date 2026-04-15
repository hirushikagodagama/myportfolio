import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "link",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const SocialLink = mongoose.model("SocialLink", socialLinkSchema);
