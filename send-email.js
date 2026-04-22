const fs = require("fs");
const nodemailer = require("nodemailer");

async function send() {
  let result = null;

  try {
    result = JSON.parse(fs.readFileSync("result.json"));
  } catch {
    console.log("No result file, probably failure");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // אם אין result → כנראה קריסה
  if (!result) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "🚨 Canada Mail Checker FAILED",
      text: "The workflow failed before producing results.",
    });

    console.log("Failure email sent");
    return;
  }

  if (!result.changed) {
    console.log("No change, no email.");
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Canada Post changed: ${result.prev} → ${result.status}`,
    text: `Status changed:\n${result.prev} → ${result.status}`,
  });

  console.log("Change email sent");
}

send();
