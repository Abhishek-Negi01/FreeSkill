import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, FRONTEND_URL } from "./dotenv.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: "Verify Your Email - FreeSkill",
    html: `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: "Reset Your Password - FreeSkill",
    html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `,
  });
};
