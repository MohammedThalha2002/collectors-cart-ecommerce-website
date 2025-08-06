import Subscriber from "../../model/subscriber.js";
import { validator } from "sequelize/lib/utils/validator-extras";
import { sendNewsletterConfirmationMail } from "../mailer/mailController.js";

export const subscribe = async (req, res) => {
  const { email } = req.body;

  // Basic email format check
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const [subscriber, created] = await Subscriber.findOrCreate({
      where: { email: email.toLowerCase() },
    });

    if (!created) {
      return res.status(409).json({ message: "Already subscribed!" });
    }

    await sendNewsletterConfirmationMail(email);

    res.status(200).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// unsubscribe a subscriber
export const unsubscribe = async (req, res) => {
  const { email } = req.body;

  // Basic email format check
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const subscriber = await Subscriber.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    await subscriber.destroy();
    res.status(200).json({ message: "Unsubscribed successfully!" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// get all subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.findAll({
      attributes: ["email", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Server error." });
  }
};
