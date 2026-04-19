import "dotenv/config";
import nodemailer from "nodemailer";

const requiredEnvVars = [
  "GOOGLE_USER",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (missingEnvVars.length > 0) {
    console.error("Missing email env vars:", missingEnvVars.join(", "));
    return;
  }

  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});


export const sendEmail = async (to, subject, text, html) => {
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing email env vars: ${missingEnvVars.join(", ")}`);
  }

  try {
    const info = await transporter.sendMail({
      from: `"Aditya" <${process.env.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

