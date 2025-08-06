import express from "express";
import {
  sendOrderMail,
  sendContactsMail,
} from "../controller/mailer/mailController.js";

const router = express.Router();

router.post("/contacts", async (req, res) => {
  const { name, email, phone, subject, message, title } = req.body;

  if (!name || !email || !subject || !message || !title) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await sendContactsMail(title, name, email, phone || "-", subject, message);
  } catch (error) {
    console.error("Error sending contacts email:", error);
    return res.status(500).json({ error: "Failed to send contacts email." });
  }

  res.status(200).json({ message: "Contact form submitted successfully!" });
});

router.post("/send-order", async (req, res) => {
  const data = req.body;
  try {
    await sendOrderMail(data);
    res
      .status(200)
      .json({ message: "Order confirmation email sent successfully!" });
  } catch (error) {
    console.error("Error sending order email:", error);
    res.status(500).json({ error: "Failed to send order confirmation email." });
  }
});

export default router;
