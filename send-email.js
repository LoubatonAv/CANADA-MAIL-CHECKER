const fs = require("fs");
const nodemailer = require("nodemailer");

async function send() {
  const result = JSON.parse(fs.readFileSync("result.json"));

  if (!result.changed) {
    console.log("No change, no email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Canada Post changed: ${result.prev} → ${result.status}`,
    text: `Status changed:\n${result.prev} → ${result.status}`,
  });
  console.log(process.env.EMAIL_USER);
  console.log("Email sent");
}

send();
