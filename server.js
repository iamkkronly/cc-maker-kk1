const TelegramBot = require("node-telegram-bot-api");
const https = require("https");

// Your Telegram Bot Token
const BOT_TOKEN = "8187078176:AAGcjeQQ4NfbifpzMHA8p_H8flnLWI_IWDM";

// Replace this with your Render Deploy Hook URL
const DEPLOY_HOOK_URL = "https://api.render.com/deploy/srv-xxxxxxxxxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxx";

// Start the bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ⏰ Auto redeploy after 30 minutes
setTimeout(() => {
  console.log("🕒 30 minutes passed. Triggering redeploy...");

  const req = https.request(DEPLOY_HOOK_URL, { method: "POST" }, (res) => {
    console.log(`✅ Redeploy triggered. Status code: ${res.statusCode}`);
  });

  req.on("error", (e) => console.error("❌ Redeploy failed:", e));
  req.end();
}, 30 * 60 * 1000); // 30 minutes

// Utility: Generate random digits
function randomNum(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// Luhn Algorithm for card number validation
function luhnCheck(number) {
  let sum = 0;
  let double = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

// Generate a valid CC from BIN
function generateCC(bin) {
  let cc = bin;

  while (cc.length < 15) {
    cc += Math.floor(Math.random() * 10).toString();
  }

  for (let i = 0; i <= 9; i++) {
    const testCC = cc + i.toString();
    if (luhnCheck(testCC)) {
      cc = testCC;
      break;
    }
  }

  const mm = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
  const yyyy = Math.floor(Math.random() * 5) + 2026;
  const cvv = randomNum(3);

  return `${cc}|${mm}|${yyyy}|${cvv}`;
}

// Bot message handler
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (!/^\d{6,8}$/.test(text)) {
    return bot.sendMessage(chatId, "❌ Please send a valid BIN (6–8 digits).");
  }

  const cards = Array.from({ length: 6 }, () => generateCC(text)).join("\n");
  bot.sendMessage(chatId, `✅ Generated CCs for BIN ${text}:\n\n${cards}`);
});
