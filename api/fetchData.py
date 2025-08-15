# Dosya Adı: api/fetchData.py

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
import json

# --- GLOBAL OTURUM (SESSION) HAFIZASI ---
# Fonksiyon, giriş yaptıktan sonra token ve apikey'i burada saklayacak.
SESSION_DATA = {
    "token": None,
    "apikey": None
}

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            # Hafızada token yoksa veya geçersizse, bu fonksiyon yeniden giriş yapacak.
            self._ensure_login()
            
            # Güncel anahtarlarla likidasyon verisini çek.
            data = self._fetch_liquidation_data()
            
            # Başarılı cevabı HTML'e gönder.
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # CORS izni
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))

        except Exception as e:
            # Herhangi bir hata olursa, hatayı doğrudan HTML'e gönder.
            error_message = {"success": False, "code": "500", "msg": f"Vercel function error: {str(e)}"}
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_message).encode('utf-8'))

    def _login(self):
        print("CoinAnk'a giriş yapılıyor...")
        
        # --- KULLANICI BİLGİLERİNİ BURAYA YAZ ---
        USERNAME = "senin-emailin@ornek.com"
        PASSWORD = "senin-sifren"
        
        login_url = "https://api.coinank.com/api/user/login"
        login_payload = {"email": mehetgege@gmail.com, "password":Bnm00bnm}
        
        response = requests.post(login_url, json=login_payload, timeout=10)
        response.raise_for_status()
        
        login_data = response.json()
        if not login_data.get("success"):
            raise Exception(f"Giriş Başarısız: {login_data.get('msg')}")

        # Yeni token ve apikey'i alıp hafızaya kaydet.
        SESSION_DATA["token"] = login_data["data"]["token"]
        SESSION_DATA["apikey"] = login_data["data"]["apikey"]
        print("Giriş başarılı, yeni anahtarlar alındı.")

    def _fetch_liquidation_data(self):
        query_components = parse_qs(urlparse(self.path).query)
        symbol = query_components.get('symbol', ['BTCUSDT'])[0]
        
        url = f"https://api.coinank.com/api/liqMap/getLiqMap?exchange=Binance&symbol={symbol}&interval=1d"
        
        headers = {
            'token': SESSION_DATA["token"],
            'coinank-apikey': SESSION_DATA["apikey"]
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        # Eğer 403 (Yasaklandı) hatası gelirse, bu token'ın süresinin dolduğu anlamına gelir.
        if response.status_code == 403:
            raise Exception("Token expired or invalid (403 Forbidden).")
            
        response.raise_for_status() # Diğer hatalar için (500 vb.)
        
        return response.json()

    def _ensure_login(self):
        # Eğer hafızada token yoksa, direkt giriş yap.
        if not SESSION_DATA.get("token"):
            self._login()
            return

        # Token varsa, geçerli olup olmadığını test etmek için veri çekmeyi dene.
        try:
            print("Mevcut token ile veri çekiliyor...")
            self._fetch_liquidation_data()
            print("Mevcut token geçerli.")
        except Exception:
            # Eğer veri çekme başarısız olursa (büyük ihtimalle token süresi doldu), yeniden giriş yap.
            print("Mevcut token geçersiz. Yeniden giriş yapılıyor...")
            self._login()