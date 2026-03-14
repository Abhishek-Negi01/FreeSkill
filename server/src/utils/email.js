import { Resend } from "resend";
import { FRONTEND_URL, RESEND_API_KEY } from "./dotenv.js";

const resend = new Resend(RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: "FreeSkill <onboarding@resend.dev>",
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
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: "FreeSkill <onboarding@resend.dev>",
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
