import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.resolve(__dirname, "..", "..");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const orderTemplatePath = path.join(
  parentDir,
  "template",
  "order-confirmation.html"
);
const orderSource = fs.readFileSync(orderTemplatePath, "utf8");
const orderTemplate = handlebars.compile(orderSource);

export async function sendOrderMail(data) {
  function buildItemsRows(items) {
    return items.map((it) => ({
      productName: it.name || it.productName,
      quantity: it.quantity,
      price: it.price,
      total: it.quantity * it.price,
      birthdayDate: it.birthdayDate,
    }));
  }

  const mailData = {
    ...data,
    items: buildItemsRows(data.items),
    subtotal: data.subtotal,
    discount: data.discount,
    shipping: data.shipping,
    totalAmount: data.totalAmount,
  };

  const html = orderTemplate(mailData);

  const mailOptions = {
    from: process.env.SMTP_ORDERS_USER,
    to: data.email,
    bcc: process.env.SMTP_USER,
    subject: `Order #${data.orderId} confirmed`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
}

const newsletterTemplatePath = path.join(
  parentDir,
  "template",
  "newsletter-welcome.html"
);
const newsletterSource = fs.readFileSync(newsletterTemplatePath, "utf8");
const newsletterTemplate = handlebars.compile(newsletterSource);

export async function sendNewsletterConfirmationMail(email) {
  const html = newsletterTemplate();

  const mailOptions = {
    from: process.env.SMTP_NO_REPLY_USER,
    to: email,
    subject: "Newsletter Subscription Confirmation",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending newsletter confirmation email:", error);
  }
}
// rename sell-to-us to contacts
const contactsTemplatePath = path.join(parentDir, "template", "contacts.html");
const contactsSource = fs.readFileSync(contactsTemplatePath, "utf8");
const contactsTemplate = handlebars.compile(contactsSource);

export async function sendContactsMail(
  title,
  name,
  email,
  phone,
  subject,
  message
) {
  const html = contactsTemplate({
    title,
    name,
    email,
    phone,
    subject,
    message,
  });

  const mailOptions = {
    from: process.env.SMTP_NO_REPLY_USER,
    to: process.env.SMTP_USER,
    subject: `${title} from ${name}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending sell to us email:", error);
  }
}

// stock alert
const stockAlertTemplatePath = path.join(
  parentDir,
  "template",
  "stock-update.html"
);
const stockAlertSource = fs.readFileSync(stockAlertTemplatePath, "utf8");
const stockAlertTemplate = handlebars.compile(stockAlertSource);

export async function sendStockUpdateMail(emails, productDetails) {
  const html = stockAlertTemplate(productDetails);

  const mailOptions = {
    from: process.env.SMTP_NO_REPLY_USER,
    to: emails,
    subject: "Product Back in Stock Alert",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Stock alert email sent to: ${emails.join(", ")}`);
  } catch (error) {
    console.error("Error sending stock alert email:", error);
  }
}
