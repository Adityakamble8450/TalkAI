import userModel from "../model/user.model.js";
import { sendEmail } from "../services/mail.services.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import messageModel from "../model/message.model.js";
import bcrypt from "bcryptjs";


dotenv.config()

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

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET,)

        const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`

        await sendEmail(
            email,
            "Welcome to TalkAI",
            `Hi ${username},\n\nPlease verify your email to continue using TalkAI.`,
            `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hi <strong>${username}</strong>,</p>
      <p>Thank you for registering at <strong>TalkAI</strong>.</p>

      <p>Please verify your email to activate your account:</p>

      <a href="${verifyUrl}" 
         style="
           display: inline-block;
           padding: 10px 20px;
           margin: 15px 0;
           font-size: 16px;
           color: #fff;
           background-color: #4CAF50;
           text-decoration: none;
           border-radius: 5px;
         ">
         Verify Email
      </a>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p>${verifyUrl}</p>

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
            token: token
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
    const { token } = req.query

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findOne({ email: decoded.email })

    if (!user) {
        res.status(400).json({
            message: "token invalid",
            success: false,
            error: "user invalid"
        })
    }

    user.verified = true;

    await user.save()

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <div style="max-width:500px; margin:60px auto; background:#fff; padding:30px; border-radius:10px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

    <h2 style="color:#4CAF50;">✅ Email Verified</h2>

    <p style="font-size:16px; color:#333;">
      Your email has been successfully verified.
    </p>

    <p style="font-size:14px; color:#666;">
      You can now log in to your TalkAI account and start chatting.
    </p>

    <a href="http://localhost:3000/login"
       style="
         display:inline-block;
         margin-top:20px;
         padding:12px 20px;
         background-color:#4CAF50;
         color:#fff;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;
       ">
       Go to Login
    </a>

  </div>

</body>
</html>
`;


    res.send(html)

}

export const userLogin = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        res.status(400).json({
            message: "invalid email or password",
            success: false,
        })
    }

    const compareHashPass = bcrypt.compare(password, user.password)

    if (!compareHashPass) {
        res.status(400).json({
            message: 'invalid email or password',
            success: false
        })
    }

    if (!user.verified) {
        res.status(400).json({
            message: 'please verify your email first',
            success: false,
            err: 'email is not verified'

        })
    }
    const token = jwt.sign({
        id: user._id,
        email: email
    }, process.env.JWT_SECRET, { expiresIn: '3d' })


    res.cookie(token)

    res.status(201).json({
        message: 'login succesfully',
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}

export const getme = async (req, res) => {

    const userId = req.user.id;

    const user = await userModel.findById(userId).select('-password');

    if (!user) {
        res.status(404).json({
            message: 'User not found',
            success: false,
            err: 'user Not found'
        })
    }


    res.status(200).json({
        message: 'User Featch sussesfully',
        success: true,
        user
    })

}