// HTML botunun içindeki örnek çağrı
const symbol = 'ORDIUSDT';
const interval = '1d';

// NOT: BURADAKİ URL'Yİ KENDİ VERCEL UYGULAMANIN URL'Sİ İLE DEĞİŞTİR!
const vercelProxyUrl = `https://YOUR-VERCEL-APP-NAME.vercel.app/api/fetchData?symbol=${symbol}&interval=${interval}`;

$.ajax({
    url: vercelProxyUrl,
    method: 'GET',
    success: function(response) {
        console.log("Likidasyon verisi başarıyla alındı:", response);
        // Gelen veriyi bota işlemek için gönder
        window.app.processCoinankLiquidationData(response.data); 
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error("Vercel proxy'sinden veri alınamadı:", textStatus, errorThrown);
    }
});