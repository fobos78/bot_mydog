const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const puppeteer = require("puppeteer");

const token = "1275537299:AAHXGkrVkqSAs3JGSrcNSIQ-P3VWRIkyHZw";
const bot = new TelegramBot(token, { polling: true });

const keyboard = [
    [
      {
        text: 'Фото собачки', // текст на кнопке
        callback_data: 'dog' // данные для обработчика событий
      }
    ],
    [
        {
          text: 'Фото кошечки', // текст на кнопке
          callback_data: 'cat' // данные для обработчика событий
        }
      ],
];

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
// //   try {
// //     const body = await getJoke("https://anekdot.ru/random/anekdot/");
// //     bot.sendPhoto(chatId, photo, { caption: body });
// //   } catch (err) {
// //     console.log(err);
// //   }
//     bot.sendPhoto(chatId, photo, { caption: 'Собачка' });
//     bot.sendText()
// });
bot.on('message', (msg) => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    // отправляем сообщение
    bot.sendMessage(chatId, 'Привет, Друг! чего хочешь?', { // прикрутим клаву
          reply_markup: {
              inline_keyboard: keyboard
          }
      });
  });
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const photoDog = await getDog("https://dog.ceo/api/breeds/image/random");
    const photoCat = await getCat("https://api.thecatapi.com/v1/images/search");
  
    let img = '';
  
    if (query.data === 'dog') { // если кот
      img = photoDog;
    }
    if (query.data === 'cat') { // если кот
        img = photoCat;
      }
  
    if (img) {
      bot.sendPhoto(chatId, img, { // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    } else {
      bot.sendMessage(chatId, 'Непонятно, давай попробуем ещё раз?', {
        // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    }
  });