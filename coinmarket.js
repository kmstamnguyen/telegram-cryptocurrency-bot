const rp = require('request-promise');
const _ = require('lodash');

const URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency';
async function getLatestQuote(symbol) {
    const requestOptions = {
      method: 'GET',
      uri: `${URL}/quotes/latest?symbol=${symbol}`,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CRYPTO_API
      },
      json: true,
      gzip: true
    };

    const data = await rp(requestOptions);
    const coinData = _.get(data, `data.${_.toUpper(symbol)}.[0].quote`, {});
    return coinData;
}

module.exports = {
    getLatestQuote,
};
