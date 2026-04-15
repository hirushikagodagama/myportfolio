import mongoose from "mongoose";

const skillCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const SkillCategory = mongoose.model("SkillCategory", skillCategorySchema);
