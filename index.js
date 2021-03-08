const debug = require("debug")("bot");
require("dotenv-flow").config();
const TelegramBot = require("node-telegram-bot-api");
const { parse } = require("date-fns");
const _ = require("lodash");
const table = require("markdown-table");

const { getLatestQuote } = require("./coinmarket");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/coin (.+)/, async (msg, match) => {
  const coin = _.get(match, "[1]", "");
  const data = await getLatestQuote(coin);
  console.log(data);
  var number = 123456.789;

  // request a currency format
  console.log(
    new Intl.NumberFormat("en-IN").format(_.get(data, "USD.price", 0))
  );
  const format = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };
  try {
    bot.sendMessage(
      msg.chat.id,
      `
        \`\`\`\`\`\`\`
        ${table([
          ["price", "1h %", "24h %", "7d %", "1m %", "volume", "cap"],
          [
            `$${format(_.get(data, "USD.price", 0))}`,
            `${format(_.get(data, "USD.percent_change_1h", 0))}%`,
            `${format(_.get(data, "USD.percent_change_24h", 0))}%`,
            `${format(_.get(data, "USD.percent_change_7d", 0))}%`,
            `${format(_.get(data, "USD.percent_change_30d", 0))}%`,
            format(_.get(data, "USD.volume_24h", 0)),
            format(_.get(data, "USD.market_cap", 0)),
          ],
        ])}
        \`\`\`\`\`\`\`
        `,
      {
        parse_mode: "Markdown",
      }
    );
  } catch ({ message }) {
    bot.sendMessage(msg.chat.id, message);
  }
});
