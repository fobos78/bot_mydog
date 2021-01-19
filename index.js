const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const puppeteer = require("puppeteer");

const token = "1275537299:AAHXGkrVkqSAs3JGSrcNSIQ-P3VWRIkyHZw";
const bot = new TelegramBot(token, { polling: true });

let queryCat = 0;
let queryDog = 0;
let queryJoc = 0;

const keyboard = [
  [
    {
      text: "Фото собачки", // текст на кнопке
      callback_data: "dog", // данные для обработчика событий
    },
  ],
  [
    {
      text: "Фото кошечки", // текст на кнопке
      callback_data: "cat", // данные для обработчика событий
    },
  ],
  [
    {
      text: "Случайный анекдот", // текст на кнопке
      callback_data: "joc", // данные для обработчика событий
    },
  ],
];

async function getJoke(url) {
  // const browser = await puppeteer.launch({executablePath: 'google-chrome-unstable'});
  // const browser = await puppeteer.launch({
  //   executablePath: '/usr/bin/chromium-browser'
  // });
  //   const browser = await puppeteer.launch({
  //     headless:false,
  //     args: ["--no-sandbox"]
  // });
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
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
async function getCat(url) {
  const res = await axios(url);
  // console.log('=>',res.data[0].url);
  const result = res.data[0].url;
  return result;
}

// bot.on("message", async function (msg) {
//   const chatId = msg.chat.id; // Берем ID чата (не отправителя)
//   const url = "https://dog.ceo/api/breeds/image/random";
//   const photo = await getDog(url);
//   try {
//     const body = await getJoke("https://anekdot.ru/random/anekdot/");
//     bot.sendPhoto(chatId, photo, { caption: body });
//   } catch (err) {
//     console.log(err);
//   }
//     // bot.sendPhoto(chatId, photo, { caption: 'Собачка' });
//     // bot.sendText()
// });
bot.on("message", (msg) => {
  const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
  // отправляем сообщение
  bot.sendMessage(chatId, "Привет, Друг! чего хочешь?", {
    // прикрутим клаву
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
});
bot.on("callback_query", async (query) => {
  let body = "test";
  let img = "";
  const chatId = query.message.chat.id;
  if (query.data === "dog") {
    const photoDog = await getDog("https://dog.ceo/api/breeds/image/random");
    bot.sendPhoto(chatId, photoDog, {
      caption: ++queryDog,
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }
  if (query.data === "cat") {
    const photoCat = await getCat("https://api.thecatapi.com/v1/images/search");
    bot.sendPhoto(chatId, photoCat, {
      caption: ++queryCat,
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  if (query.data === "joc") {
    queryJoc++;
    try {
      body = await getJoke("https://anekdot.ru/random/anekdot/");
      // bot.sendPhoto(chatId, photo, { caption: body });
    } catch (err) {
      console.log(err);
    }
      bot.sendMessage(chatId, `${body} - анекдот № ${queryJoc}` , {
        reply_markup: {
          inline_keyboard: keyboard,
        },
    });
  } 
  // else {
  //   bot.sendMessage(chatId, "Непонятно, давай попробуем ещё раз?", {
  //     reply_markup: {
  //       inline_keyboard: keyboard,
  //     },
  //   });
  // }
});
