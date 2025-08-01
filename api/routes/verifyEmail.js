import express from "express";
import nodemailer from "nodemailer";
import { db } from "../config/firebase-admin.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail", // or your provider
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS, // use app password or env var
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  if (
    !email
    // || !uid
  ) {
    return res.status(400).json({ error: "Missing email or UID" });
  }

  const code = generateCode();

  try {
    // await db.collection("verifications").doc(uid).set({
    //   email,
    //   code,
    //   createdAt: new Date(),
    // });

    await transporter.sendMail({
      //   from: `"Spa Management" <${process.env.EMAIL_USER}>`,
      from: `"Spa Management" <"ing.hatim.fangour@gmail.com">`,
      to: email,
      subject: "Your Verification Code",
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

export default router;
