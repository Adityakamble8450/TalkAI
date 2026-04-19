import userModel from "../model/user.model.js";
import { sendEmail } from "../services/mail.services.js";

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
    });

    await sendEmail(
      email,
      "Welcome to TalkAI",
      `Hi ${username},\n\nThank you for registering at TalkAI. We are excited to have you on our platform.`,
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hi <strong>${username}</strong>,</p>
          <p>Thank you for registering at <strong>TalkAI</strong>.</p>
          <p>We are excited to have you on our platform.</p>
          <p>Best regards,<br />The TalkAI Team</p>
        </div>
      `
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
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
