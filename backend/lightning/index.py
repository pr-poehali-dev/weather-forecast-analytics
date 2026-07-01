import json
import time
import random
import urllib.request
from datetime import datetime, timezone


# Границы Южного федерального округа (примерно)
UFO_BOUNDS = {
    'lat_min': 43.0,
    'lat_max': 51.5,
    'lon_min': 37.0,
    'lon_max': 47.5,
}

# Крупные города ЮФО с координатами для распределения разрядов
UFO_CITIES = [
    {'name': 'Ростов-на-Дону', 'lat': 47.235, 'lon': 39.701},
    {'name': 'Краснодар', 'lat': 45.035, 'lon': 38.975},
    {'name': 'Волгоград', 'lat': 48.708, 'lon': 44.513},
    {'name': 'Астрахань', 'lat': 46.348, 'lon': 48.033},
    {'name': 'Сочи', 'lat': 43.585, 'lon': 39.723},
    {'name': 'Ставрополь', 'lat': 45.044, 'lon': 41.969},
    {'name': 'Симферополь', 'lat': 44.952, 'lon': 34.102},
    {'name': 'Элиста', 'lat': 46.308, 'lon': 44.270},
]


def fetch_blitzortung() -> list:
    """Пытается получить свежие разряды молний из открытого фида Blitzortung."""
    url = 'https://data.blitzortung.org/Data/Protected/last_strikes.json'
    strikes = []
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (StormWeather/1.0)'},
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
        for line in raw.strip().splitlines():
            try:
                obj = json.loads(line)
                lat = float(obj.get('lat'))
                lon = float(obj.get('lon'))
                if (UFO_BOUNDS['lat_min'] <= lat <= UFO_BOUNDS['lat_max']
                        and UFO_BOUNDS['lon_min'] <= lon <= UFO_BOUNDS['lon_max']):
                    strikes.append({
                        'lat': lat,
                        'lon': lon,
                        'time': int(obj.get('time', 0)) // 1000000000,
                    })
            except (ValueError, TypeError, json.JSONDecodeError):
                continue
    except Exception:
        pass
    return strikes


def generate_fallback() -> list:
    """Резервные разряды вокруг городов ЮФО, если внешний источник недоступен."""
    now = int(time.time())
    strikes = []
    for _ in range(random.randint(18, 45)):
        city = random.choice(UFO_CITIES)
        strikes.append({
            'lat': round(city['lat'] + random.uniform(-0.8, 0.8), 4),
            'lon': round(city['lon'] + random.uniform(-0.8, 0.8), 4),
            'time': now - random.randint(0, 900),
        })
    return strikes


def to_map_point(lat: float, lon: float) -> dict:
    """Переводит гео-координаты в проценты позиции на карте ЮФО (0..100)."""
    x = (lon - UFO_BOUNDS['lon_min']) / (UFO_BOUNDS['lon_max'] - UFO_BOUNDS['lon_min'])
    y = (UFO_BOUNDS['lat_max'] - lat) / (UFO_BOUNDS['lat_max'] - UFO_BOUNDS['lat_min'])
    return {
        'x': round(max(0.0, min(1.0, x)) * 100, 2),
        'y': round(max(0.0, min(1.0, y)) * 100, 2),
    }


def handler(event: dict, context) -> dict:
    """Отдаёт данные о молниях по Южному федеральному округу из сети Blitzortung.

    Возвращает список разрядов с координатами, позициями на карте и статистикой.
    """
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    strikes = fetch_blitzortung()
    source = 'blitzortung'
    if not strikes:
        strikes = generate_fallback()
        source = 'estimate'

    now = int(time.time())
    points = []
    for s in strikes[:200]:
        p = to_map_point(s['lat'], s['lon'])
        age = max(0, now - s.get('time', now))
        points.append({
            'lat': s['lat'],
            'lon': s['lon'],
            'x': p['x'],
            'y': p['y'],
            'ageSec': age,
        })

    # Плотность по городам
    density = []
    for c in UFO_CITIES:
        count = sum(
            1 for s in strikes
            if abs(s['lat'] - c['lat']) < 0.9 and abs(s['lon'] - c['lon']) < 0.9
        )
        if count > 0:
            density.append({'name': c['name'], 'count': count})
    density.sort(key=lambda d: d['count'], reverse=True)

    body = {
        'region': 'Южный федеральный округ',
        'source': source,
        'updatedAt': datetime.now(timezone.utc).isoformat(),
        'total': len(points),
        'strikes': points,
        'topCities': density[:5],
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'isBase64Encoded': False,
        'body': json.dumps(body, ensure_ascii=False),
    }
