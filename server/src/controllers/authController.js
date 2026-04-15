import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { createToken } from "../utils/token.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createToken({ id: user._id, email: user.email, role: user.role });

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};
