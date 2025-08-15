// Dosya Adı: api/fetchData.js

const fetch = require('node-fetch');

export default async function (req, res) {
    
    // --- ÖNEMLİ: CORS İzinleri ---
    // Bu başlıklar, tarayıcının bu API'den gelen veriyi okumasına izin verir.
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Herhangi bir kaynaktan gelen isteklere izin ver
    // VEYA daha güvenli bir yaklaşım:
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Tarayıcılar, asıl istekten önce bir "preflight" (ön kontrol) isteği (OPTIONS metoduyla) gönderir.
    // Bu isteğe 204 (No Content) ile cevap vererek CORS kontrolünü geçmesini sağlamalıyız.
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    
    // API anahtarınızı ve token'ınızı buraya veya ortam değişkenlerine girin
    const COINANK_API_KEY = "LWIzMWUtYzU0Ny1kMjk5LWI2ZDA3Yjc2MzFhYmEyYzkwM2NjfDI4NjYzNDA4MTkxNTEzNDc=";
    const COINANK_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMjMwOGVkNTc3ZWQ0YjAyOGQxZTdlN2I3ZjE0ZTdiYiIsImlhdCI6MTc1NTIyMDExMn0.afXUrcg3aoNslxZpOOsxOqLmgsvQA1Mor59ri1boJasq32JZgiLN6pZoj0ohIHDtCWpO7EjzLu1m9qSm3JFz9Q";

    const { 
        symbol = 'BTCUSDT', 
        interval = '1d', 
        exchange = 'Binance' 
    } = req.query;

    const coinankUrl = `https://api.coinank.com/api/liqMap/getLiqMap?exchange=${exchange}&symbol=${symbol}&interval=${interval}`;

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'coinank-apikey': COINANK_API_KEY,
            'token': COINANK_TOKEN,
            'origin': 'https://coinank.com',
            'referer': 'https://coinank.com/',
        }
    };

    try {
        const response = await fetch(coinankUrl, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`CoinAnk API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Gelen veriyi frontend'e (HTML dosyanıza) JSON olarak gönder
        res.status(200).json(data);

    } catch (error) {
        console.error("Vercel Fonksiyon Hatası:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}