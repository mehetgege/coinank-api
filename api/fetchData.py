# Dosya Adı: api/fetchData.py

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
import json

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        # HTML'den gelen sorgu parametrelerini al (örn: ?symbol=BTCUSDT)
        query_components = parse_qs(urlparse(self.path).query)
        symbol = query_components.get('symbol', ['BTCUSDT'])[0]
        interval = query_components.get('interval', ['1d'])[0]
        exchange = query_components.get('exchange', ['Binance'])[0]

        # CoinAnk API URL'sini dinamik olarak oluştur
        url = f"https://api.coinank.com/api/liqMap/getLiqMap?exchange={exchange}&symbol={symbol}&interval={interval}"

        # --- DİKKAT: BU DEĞERLERİ GÜNCEL TUTMALISIN ---
        # Bu anahtarların süresi dolduğunda 403 hatası alırsın.
        # O zaman burayı yeni anahtarlarla güncelleyip tekrar deploy etmen gerekir.
        headers = {
            'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
            'Accept': "application/json, text/plain, */*",
            'Accept-Encoding': "gzip, deflate, br, zstd",
            'sec-ch-ua-platform': '"Android"',
            'coinank-apikey': "LWIzMWUtYzU0Ny1kMjk5LWI2ZDA3Yjc2MzFhYmEyYzkwM2NjfDI4NjYzNDU1MTE1MjAzNDc=",
            'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
            'sec-ch-ua-mobile': '?1',
            'client': "web",
            'web-version': "101",
            'dnt': "1",
            'token': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMjMwOGVkNTc3ZWQ0YjAyOGQxZTdlN2I3ZjE0ZTdiYiIsImlhdCI6MTc1NTIzMzA2OX0.zfUPYbUmpZBISVZDCrozdmeIq0HkZDq4hH6XFqfWKvIRba00PjFvKZGshVruhFxn64tN8vWOg_PhHZNScvW9Uw",
            'origin': "https://coinank.com",
            'sec-fetch-site': "same-site",
            'sec-fetch-mode': "cors",
            'sec-fetch-dest': "empty",
            'referer': "https://coinank.com/",
            'accept-language': "tr",
            'priority': 'u=1, i'
        }

        try:
            # CoinAnk'a isteği gönder
            response = requests.get(url, headers=headers, timeout=10)
            # Eğer istek başarısızsa (403, 500 vb.), hata fırlat
            response.raise_for_status()
            
            # Başarılı cevabı JSON olarak al
            data = response.json()
            
            # HTML dosyana başarılı cevabı gönder
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # CORS iznini ekle
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))

        except requests.exceptions.HTTPError as e:
            # CoinAnk'tan gelen 4xx veya 5xx hatalarını yönet
            self.send_response(e.response.status_code)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            # CoinAnk'ın hata mesajını doğrudan HTML'e ilet
            self.wfile.write(e.response.text.encode('utf-8'))
        except Exception as e:
            # Diğer tüm hataları (timeout vb.) yönet
            error_message = {"success": False, "code": "500", "msg": f"Vercel function error: {str(e)}"}
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_message).encode('utf-8'))
            
        return