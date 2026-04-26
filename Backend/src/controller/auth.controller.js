import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isUserAlredyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlredyExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
      verified: true,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        verified: user.verified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  return res.status(410).json({
    success: false,
    message: "Email verification is disabled",
  });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
    });
  }

  const compareHashPass = await bcrypt.compare(password, user.password);

  if (!compareHashPass) {
    return res.status(400).json({
      message: "invalid email or password",
      success: false,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "login succesfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const getme = async (req, res) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "user Not found",
    });
  }

  return res.status(200).json({
    message: "User Featch sussesfully",
    success: true,
    user,
  });
};

export const resendVerifyEmail = async (req, res) => {
  return res.status(410).json({
    success: false,
    message: "Email verification is disabled",
  });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "logout successfully",
    success: true,
  });
};
