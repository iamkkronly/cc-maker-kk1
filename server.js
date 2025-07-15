const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// Start Express server to satisfy Render's port requirement
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Telegram bot is running and healthy!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});

// Use your provided bot token
const BOT_TOKEN = "8187078176:AAEHI5ugIW83D3xrODKdJn0HvQqcT_5M11k";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Random number generator
function randomNum(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// Luhn algorithm for card validation
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

// Generate valid credit card number using BIN
function generateCC(bin) {
  let cc = bin;
  while (cc.length < 15) {
    cc += Math.floor(Math.random() * 10).toString();
  }

  for (let i = 0; i <= 9; i++) {
    if (luhnCheck(cc + i)) {
      cc += i;
      break;
    }
  }

  const mm = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
  const yyyy = Math.floor(Math.random() * 5) + 2026;
  const cvv = randomNum(3);

  return `${cc}|${mm}|${yyyy}|${cvv}`;
}

// Telegram bot logic
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (!/^\d{6,8}$/.test(text)) {
    return bot.sendMessage(chatId, "❌ Please send a valid BIN (6–8 digits).");
  }

  const cards = Array.from({ length: 100 }, () => generateCC(text)).join("\n");
  bot.sendMessage(chatId, `✅ CCs for BIN ${text}:\n\n${cards}`);
});

console.log("🤖 Telegram bot is up and polling...");
