"use strict";

var rp = require('request-promise');

var _ = require('lodash');

var URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency';

function getLatestQuote(symbol) {
  var requestOptions, data, coinData;
  return regeneratorRuntime.async(function getLatestQuote$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestOptions = {
            method: 'GET',
            uri: "".concat(URL, "/quotes/latest?symbol=").concat(symbol),
            headers: {
              'X-CMC_PRO_API_KEY': process.env.CRYPTO_API
            },
            json: true,
            gzip: true
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(rp(requestOptions));

        case 3:
          data = _context.sent;
          coinData = _.get(data, "data.".concat(_.toUpper(symbol), ".[0].quote"), {});
          return _context.abrupt("return", coinData);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  getLatestQuote: getLatestQuote
};