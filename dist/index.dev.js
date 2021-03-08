"use strict";

var debug = require("debug")("bot");

require("dotenv-flow").config();

var TelegramBot = require("node-telegram-bot-api");

var _require = require("date-fns"),
    parse = _require.parse;

var _ = require("lodash");

var table = require("markdown-table");

var _require2 = require("./coinmarket"),
    getLatestQuote = _require2.getLatestQuote;

var bot = new TelegramBot(process.env.TOKEN, {
  polling: true
}); // Matches "/echo [whatever]"

bot.onText(/\/echo (.+)/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  var chatId = msg.chat.id;
  var resp = match[1]; // the captured "whatever"
  // send back the matched "whatever" to the chat

  bot.sendMessage(chatId, resp);
});
bot.onText(/\/coin (.+)/, function _callee(msg, match) {
  var coin, data, number, format, message;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          coin = _.get(match, "[1]", "");
          _context.next = 3;
          return regeneratorRuntime.awrap(getLatestQuote(coin));

        case 3:
          data = _context.sent;
          console.log(data);
          number = 123456.789; // request a currency format

          console.log(new Intl.NumberFormat("en-IN").format(_.get(data, "USD.price", 0)));

          format = function format(value) {
            return new Intl.NumberFormat("en-IN").format(value);
          };

          try {
            bot.sendMessage(msg.chat.id, "\n        ```````\n        ".concat(table([["price", "1h %", "24h %", "7d %", "1m %", "volume", "cap"], ["$".concat(format(_.get(data, "USD.price", 0))), "".concat(format(_.get(data, "USD.percent_change_1h", 0)), "%"), "".concat(format(_.get(data, "USD.percent_change_24h", 0)), "%"), "".concat(format(_.get(data, "USD.percent_change_7d", 0)), "%"), "".concat(format(_.get(data, "USD.percent_change_30d", 0)), "%"), format(_.get(data, "USD.volume_24h", 0)), format(_.get(data, "USD.market_cap", 0))]]), "\n        ```````\n        "), {
              parse_mode: "Markdown"
            });
          } catch (_ref) {
            message = _ref.message;
            bot.sendMessage(msg.chat.id, message);
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});