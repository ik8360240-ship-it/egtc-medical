import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Transporter (Lazy initialization logic)
  let transporter: nodemailer.Transporter | null = null;

  function getTransporter() {
    if (!transporter) {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
      
      // If we don't have SMTP credentials, we'll log to console for development
      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn("SMTP credentials not fully configured. Email notifications will be logged to console.");
        return null;
      }

      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587"),
        secure: SMTP_PORT === "465",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }
    return transporter;
  }

  // API Route for notifications
  app.post("/api/notify", async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields: to, subject, body" });
    }

    try {
      const emailTransporter = getTransporter();
      const from = process.env.EMAIL_FROM || "EGTC Staff Pro <noreply@example.com>";

      if (emailTransporter) {
        await emailTransporter.sendMail({
          from,
          to,
          subject,
          text: body,
          html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px">
            <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px">${subject}</h2>
            <div style="padding: 20px 0; color: #374151; line-height: 1.6">
              ${body.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af">
              This is an automated notification from the EGTC Staff Medical Treatment System. Please do not reply to this email.
            </div>
          </div>`,
        });
        console.log(`Email sent successfully to ${to}`);
      } else {
        console.log("--- MOCK EMAIL ---");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log("------------------");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

export default startServer();
