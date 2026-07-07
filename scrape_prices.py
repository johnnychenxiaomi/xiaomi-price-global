"""
Amazon 多国价格抓取脚本 — 供 GitHub Actions 自动运行
从 8 个 Amazon 站点抓取小米产品价格，输出 prices.json
"""
import json, re, sys, time, random
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
]

STORES = [
    {"domain": "amazon.de", "cc": "DE", "currency": "EUR"},
    {"domain": "amazon.fr", "cc": "FR", "currency": "EUR"},
    {"domain": "amazon.it", "cc": "IT", "currency": "EUR"},
    {"domain": "amazon.es", "cc": "ES", "currency": "EUR"},
    {"domain": "amazon.nl", "cc": "NL", "currency": "EUR"},
    {"domain": "amazon.pl", "cc": "PL", "currency": "PLN"},
    {"domain": "amazon.se", "cc": "SE", "currency": "SEK"},
    {"domain": "amazon.co.uk", "cc": "GB", "currency": "GBP"},
]

SEARCH_QUERIES = ["Xiaomi+smartphone", "POCO+smartphone", "Redmi+smartphone"]

XIAOMI_KEYWORDS = [
    "xiaomi", "redmi", "poco", "mi ", "mi+", "mi-"
]

PRICE_PATTERNS = [
    re.compile(r'class="a-price-whole">(\d[\d\s.,]*)</span>'),
    re.compile(r'class="a-offscreen">\s*[€£]\s*([\d\s.,]+)'),
    re.compile(r'class="a-offscreen">\s*([\d\s.,]+)\s*[€£zł]'),
    re.compile(r'([\d]+[.,]\d{2})\s*[€£]'),
    re.compile(r'[€£]\s*([\d]+[.,]\d{2})'),
    re.compile(r'([\d\s]+[.,]\d{2})\s*(?:zł|kr|PLN|SEK|GBP)'),
]

PRODUCT_PATTERN = re.compile(
    r'(?:Xiaomi|Redmi|POCO)\s+[\w\d][\w\d\s+\-]*?(?:\d+\s*(?:GB|TB))',
    re.IGNORECASE
)

def parse_price(text):
    text = text.strip().replace('\xa0', ' ').replace(' ', '')
    text = text.replace('.', '').replace(',', '.')  # European format
    try:
        return float(text)
    except ValueError:
        return None

def is_xiaomi_product(name):
    lower = name.lower()
    return any(kw in lower for kw in XIAOMI_KEYWORDS)

def clean_product_name(raw):
    raw = re.sub(r'\s+', ' ', raw).strip()
    raw = re.sub(r'(?i)\b(case|cover|screen|protector|film|cable|charger|adapter|tempered|glass|silicone|rubber|leather|wallet|holder|stand|mount|ring|strap|band|earbuds|buds|watch|cam|router|power\s*bank)\b', '', raw)
    return raw.strip()

def fetch_page(url, retries=2):
    for attempt in range(retries + 1):
        try:
            req = Request(url, headers={
                "User-Agent": random.choice(USER_AGENTS),
                "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Encoding": "identity",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
            })
            with urlopen(req, timeout=20) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except (URLError, HTTPError, TimeoutError) as e:
            print(f"  Attempt {attempt+1} failed for {url}: {e}")
            if attempt < retries:
                time.sleep(3 * (attempt + 1))
    return None

def extract_products_from_html(html, country_code, currency, domain):
    results = []
    blocks = re.split(r'data-asin="[A-Z0-9]+"', html)

    for block in blocks:
        names = PRODUCT_PATTERN.findall(block)
        if not names:
            continue
        name = clean_product_name(names[0])
        if not is_xiaomi_product(name) or len(name) < 8:
            continue
        if any(kw in name.lower() for kw in ['case', 'cover', 'screen', 'protector', 'film', 'cable', 'charger']):
            continue

        for pat in PRICE_PATTERNS:
            m = pat.search(block)
            if m:
                price = parse_price(m.group(1))
                if price and 30 < price < 50000:
                    results.append({
                        "product_name": name,
                        "platform": f"Amazon.{domain.split('amazon.')[-1]}",
                        "country_code": country_code,
                        "currency": currency,
                        "price": round(price, 2),
                        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
                    })
                    break
    return results

def scrape_all():
    all_prices = []
    seen = set()

    for store in STORES:
        domain = store["domain"]
        cc = store["cc"]
        currency = store["currency"]
        print(f"\n--- {domain} ({cc}, {currency}) ---")

        for query in SEARCH_QUERIES:
            url = f"https://www.{domain}/s?k={query}"
            print(f"  Fetching: {query}...")
            html = fetch_page(url)
            if not html:
                print(f"  Failed to fetch {domain}")
                continue

            products = extract_products_from_html(html, cc, currency, domain)
            for p in products:
                key = (p["product_name"].lower(), p["country_code"])
                if key not in seen:
                    seen.add(key)
                    all_prices.append(p)
                    print(f"    {p['product_name']}: {p['price']} {p['currency']}")

            time.sleep(random.uniform(2, 4))

    print(f"\n=== Total: {len(all_prices)} products from {len(set(p['country_code'] for p in all_prices))} countries ===")
    return all_prices

def main():
    prices = scrape_all()

    # 如果抓取失败（少于10条），保留现有 prices.json 不覆盖
    if len(prices) < 10:
        print(f"Only {len(prices)} results — keeping existing prices.json unchanged")
        sys.exit(0)

    output = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "total": len(prices),
        "prices": sorted(prices, key=lambda p: (p["country_code"], p["product_name"]))
    }

    with open("prices.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nWritten {len(prices)} records to prices.json")

if __name__ == "__main__":
    main()
