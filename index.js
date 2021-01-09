const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const puppeteer = require("puppeteer");

const token = "1275537299:AAHXGkrVkqSAs3JGSrcNSIQ-P3VWRIkyHZw";
const bot = new TelegramBot(token, { polling: true });

async function getJoke(url) {
//   const browser = await puppeteer.launch({executablePath: 'google-chrome-unstable'});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const body = await page.evaluate(() => {
    return document.querySelectorAll("div.text")[0].innerText;
  });

  await browser.close();

  // console.log(body);
  return body;
}

async function getDog(url) {
  const res = await axios(url);
  const result = res.data.message;
  return result;
}

bot.on("message", async function (msg) {
  const chatId = msg.chat.id; // Берем ID чата (не отправителя)
  const url = "https://dog.ceo/api/breeds/image/random";
  const photo = await getDog(url);
  try {
    const body = await getJoke("https://anekdot.ru/random/anekdot/");
    bot.sendPhoto(chatId, photo, { caption: body });
  } catch (err) {
    console.log(err);
  }
    // bot.sendPhoto(chatId, photo, { caption: 'Собачка' });
    // bot.sendText()
});
