// api/fetchData.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS için tüm kaynaklara izin
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const url = 'https://api.coinank.com/api/liqMap/getLiqMap?exchange=Binance&symbol=ORDIUSDT&interval=1d';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'sec-ch-ua-platform': '"Android"',
    'coinank-apikey': 'LWIzMWUtYzU0Ny1kMjk5LWI2ZDA3Yjc2MzFhYmEyYzkwM2NjfDI4NjYzNDA4MTkxNTEzNDc=',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?1',
    'client': 'web',
    'web-version': '101',
    'dnt': '1',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMjMwOGVkNTc3ZWQ0YjAyOGQxZTdlN2I3ZjE0ZTdiYiIsImlhdCI6MTc1NTIyMDExMn0.afXUrcg3aoNslxZpOOsxOqLmgsvQA1Mor59ri1boJasq32JZgiLN6pZoj0ohIHDtCWpO7EjzLu1m9qSm3JFz9Q',
    'origin': 'https://coinank.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://coinank.com/',
    'accept-language': 'tr',
    'priority': 'u=1, i'
  }
};

  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası!', message: error.message });
  }
};
