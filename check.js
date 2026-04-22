const { chromium } = require("playwright");
const fs = require("fs");

const URL =
  "https://www.canadapost-postescanada.ca/cpc/en/our-company/news-and-media/service-alerts.page";

function extractStatus(text) {
  const lower = text.toLowerCase();

  if (!lower.includes("israel")) return "unknown";

  if (
    lower.includes("postal services suspended") ||
    lower.includes("not accepting mail and parcels")
  ) {
    return "suspended";
  }

  return "available";
}

async function check() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "domcontentloaded" });

  const text = await page.evaluate(() => document.body.innerText);
  const status = extractStatus(text);

  console.log("Current:", status);

  let prev = null;

  if (fs.existsSync("state.json")) {
    prev = JSON.parse(fs.readFileSync("state.json")).status;
  }

  const changed = prev && prev !== status;

  fs.writeFileSync("state.json", JSON.stringify({ status }, null, 2));
  fs.writeFileSync(
    "result.json",
    JSON.stringify({ status, prev, changed }, null, 2),
  );

  if (changed) {
    console.log(`🚨 CHANGED: ${prev} → ${status}`);
  } else {
    console.log("No change");
  }

  await browser.close();
}

check();
