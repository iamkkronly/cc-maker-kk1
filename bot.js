const { Telegraf } = require("telegraf");

// ==== CONFIG ====
const BOT_TOKEN = "8187078176:AAHaHM3_hgDUGnu5Cg1GculI4oic0x3-_aE";
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);

// ==== UTILITIES ====
function generateCC(bin) {
  const random = (length) => [...Array(length)].map(() => Math.floor(Math.random() * 10)).join('');
  const month = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
  const year = 2026 + Math.floor(Math.random() * 5); // Random year 2026–2030
  const cvv = random(3);
  const left = 16 - bin.length;
  const cc = bin + random(left);
  return `${cc}|${month}|${year}|${cvv}`;
}

// ==== BOT HANDLER ====
bot.on("text", async (ctx) => {
  const bin = ctx.message.text.replace(/\D/g, "");
  if (bin.length < 6 || bin.length > 15) {
    return ctx.reply("❌ Please send a valid BIN (6 to 15 digits).");
  }

  let result = "";
  for (let i = 0; i < 6; i++) {
    result += generateCC(bin) + "\n";
  }

  await ctx.reply("✅ Generated CCs:\n```" + result + "```", {
    parse_mode: "Markdown"
  });
});

// ==== START WEBHOOK ====
bot.launch({
  webhook: {
    domain: DOMAIN,
    port: PORT,
  },
});

console.log("🚀 Bot is running via webhook...");
