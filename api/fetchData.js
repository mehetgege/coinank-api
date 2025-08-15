// Dosya Adı: api/fetchData.js

// Bu dosyanın en üstüne bu satırı ekleyerek Vercel'e bu fonksiyonun
// Edge ortamında çalışmasını söyleyebiliriz, bu genellikle daha hızlıdır.
export const config = {
  runtime: 'edge',
};

// Vercel Edge fonksiyonu tanımı
export default async function handler(req) {
    
    // Tarayıcının 'preflight' (OPTIONS) isteğini otomatik olarak yönet
    // Edge ortamı genellikle bunu daha iyi yapar, ancak manuel eklemek garanti sağlar.
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    // API anahtarlarını burada veya Vercel Ortam Değişkenlerinde saklayın
    const COINANK_API_KEY = "LWIzMWUtYzU0Ny1kMjk5LWI2ZDA3Yjc2MzFhYmEyYzkwM2NjfDI4NjYzNDIzMDAwOTUzNDc=";
    const COINANK_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMjMwOGVkNTc3ZWQ0YjAyOGQxZTdlN2I3ZjE0ZTdiYiIsImlhdCI6MTc1NTIyMDExMn0.afXUrcg3aoNslxZpOOsxOqLmgsvQA1Mor59ri1boJasq32JZgiLN6pZoj0ohIHDtCWpO7EjzLu1m9qSm3JFz9Q";

    // Gelen isteğin URL'sinden sorgu parametrelerini al
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'BTCUSDT';
    const interval = searchParams.get('interval') || '1d';
    const exchange = searchParams.get('exchange') || 'Binance';

    const coinankUrl = `https://api.coinank.com/api/liqMap/getLiqMap?exchange=${exchange}&symbol=${symbol}&interval=${interval}`;

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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

        // JSON cevabını oluştur ve gerekli CORS başlıklarını ekle
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error("Vercel Fonksiyon Hatası:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}