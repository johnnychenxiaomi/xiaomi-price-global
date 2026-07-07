"""
多源价格抓取脚本 — GitHub Actions 自动运行
1. Amazon 各国站点（直接抓取，免费）
2. 聚合比价网站（通过 ScrapingBee API 绕过反爬）
输出 prices.json
"""
import json, re, sys, time, random, os
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import quote_plus

SCRAPINGBEE_KEY = os.environ.get("SCRAPINGBEE_API_KEY", "")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
]

# ==================== Amazon 配置 ====================
AMAZON_STORES = [
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

# ==================== 聚合网站配置 ====================
AGGREGATOR_SITES = [
    {"name": "Idealo.de", "cc": "DE", "currency": "EUR",
     "url": "https://www.idealo.de/preisvergleich/ProductCategory/19116.html?q=Xiaomi"},
    {"name": "Idealo.fr", "cc": "FR", "currency": "EUR",
     "url": "https://www.idealo.fr/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Idealo.es", "cc": "ES", "currency": "EUR",
     "url": "https://www.idealo.es/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Idealo.it", "cc": "IT", "currency": "EUR",
     "url": "https://www.idealo.it/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Ceneo.pl", "cc": "PL", "currency": "PLN",
     "url": "https://www.ceneo.pl/Smartfony;szukaj-Xiaomi"},
    {"name": "Geizhals.at", "cc": "AT", "currency": "EUR",
     "url": "https://geizhals.at/?fs=Xiaomi&cat=umtsover"},
    {"name": "PriceRunner.se", "cc": "SE", "currency": "SEK",
     "url": "https://www.pricerunner.se/cl/36/Mobiltelefoner?q=Xiaomi"},
    {"name": "PriceRunner.dk", "cc": "DK", "currency": "DKK",
     "url": "https://www.pricerunner.dk/cl/36/Mobiltelefoner?q=Xiaomi"},
    {"name": "Skroutz.gr", "cc": "GR", "currency": "EUR",
     "url": "https://www.skroutz.gr/search?keyphrase=Xiaomi+smartphone"},
    {"name": "Heureka.cz", "cc": "CZ", "currency": "CZK",
     "url": "https://www.heureka.cz/?h%5Bfraze%5D=Xiaomi+smartphone"},
]

XIAOMI_KEYWORDS = ["xiaomi", "redmi", "poco"]
ACCESSORY_KEYWORDS = ['case', 'cover', 'screen', 'protector', 'film', 'cable', 'charger',
                      'adapter', 'tempered', 'glass', 'silicone', 'holder', 'stand',
                      'earbuds', 'buds', 'watch', 'band', 'router', 'power bank',
                      'powerbank', 'scooter', 'vacuum', 'purifier', 'camera', 'dashcam']

AMAZON_PRICE_PATTERNS = [
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

GENERIC_PRICE_PATTERNS = [
    re.compile(r'([\d]+[.,]\d{2})\s*€'),
    re.compile(r'€\s*([\d]+[.,]\d{2})'),
    re.compile(r'([\d\s]+[.,]\d{2})\s*(?:zł|PLN)'),
    re.compile(r'([\d\s]+[.,]\d{2})\s*(?:kr|SEK|DKK|NOK)'),
    re.compile(r'([\d\s]+[.,]\d{2})\s*(?:Kč|CZK)'),
    re.compile(r'([\d]+[.,]\d{2})\s*(?:£|GBP)'),
]

GENERIC_PRODUCT_PATTERN = re.compile(
    r'((?:Xiaomi|Redmi|POCO)\s+[\w\d][\w\d\s+\-/]*?)(?:\s*[-–|,]|\s*$)',
    re.IGNORECASE
)

# ==================== 公共工具 ====================
def now_str():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

def parse_price(text):
    text = text.strip().replace('\xa0', ' ').replace(' ', '')
    text = text.replace('.', '').replace(',', '.')
    try:
        v = float(text)
        return v if 30 < v < 50000 else None
    except ValueError:
        return None

def is_xiaomi_phone(name):
    lower = name.lower()
    if not any(kw in lower for kw in XIAOMI_KEYWORDS):
        return False
    if any(kw in lower for kw in ACCESSORY_KEYWORDS):
        return False
    return len(name) >= 8

def clean_name(raw):
    raw = re.sub(r'\s+', ' ', raw).strip()
    raw = re.sub(r'(?i)\b(' + '|'.join(ACCESSORY_KEYWORDS) + r')\b', '', raw)
    return raw.strip()

# ==================== 直接抓取 (Amazon) ====================
def fetch_direct(url, retries=2):
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
            print(f"    Attempt {attempt+1} failed: {e}")
            if attempt < retries:
                time.sleep(3 * (attempt + 1))
    return None

# ==================== ScrapingBee 抓取 (聚合网站) ====================
def fetch_via_scrapingbee(url, render_js=True):
    if not SCRAPINGBEE_KEY:
        print("    No ScrapingBee API key, skipping")
        return None
    params = f"api_key={SCRAPINGBEE_KEY}&url={quote_plus(url)}&render_js={'true' if render_js else 'false'}&premium_proxy=true&country_code=de"
    api_url = f"https://app.scrapingbee.com/api/v1/?{params}"
    try:
        req = Request(api_url, headers={"Accept": "text/html"})
        with urlopen(req, timeout=60) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            print(f"    ScrapingBee OK, {len(html)} bytes")
            return html
    except HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if hasattr(e, 'read') else ""
        print(f"    ScrapingBee HTTP {e.code}: {body[:200]}")
        return None
    except (URLError, TimeoutError) as e:
        print(f"    ScrapingBee error: {e}")
        return None

# ==================== Amazon 解析 ====================
def extract_amazon_products(html, cc, currency, domain):
    results = []
    blocks = re.split(r'data-asin="[A-Z0-9]+"', html)
    for block in blocks:
        names = PRODUCT_PATTERN.findall(block)
        if not names:
            continue
        name = clean_name(names[0])
        if not is_xiaomi_phone(name):
            continue
        for pat in AMAZON_PRICE_PATTERNS:
            m = pat.search(block)
            if m:
                price = parse_price(m.group(1))
                if price:
                    results.append({
                        "product_name": name,
                        "platform": f"Amazon.{domain.split('amazon.')[-1]}",
                        "country_code": cc,
                        "currency": currency,
                        "price": round(price, 2),
                        "timestamp": now_str()
                    })
                    break
    return results

# ==================== 聚合网站解析 ====================
def extract_aggregator_products(html, site_name, cc, currency):
    results = []
    lines = html.split('\n')
    full_text = html

    product_names = GENERIC_PRODUCT_PATTERN.findall(full_text)
    seen_names = set()

    for raw_name in product_names:
        name = clean_name(raw_name)
        if not is_xiaomi_phone(name):
            continue
        name_key = name.lower().strip()
        if name_key in seen_names:
            continue

        name_pos = full_text.find(raw_name)
        if name_pos == -1:
            continue
        context = full_text[name_pos:name_pos + 500]

        for pat in GENERIC_PRICE_PATTERNS:
            m = pat.search(context)
            if m:
                price = parse_price(m.group(1))
                if price:
                    seen_names.add(name_key)
                    results.append({
                        "product_name": name,
                        "platform": site_name,
                        "country_code": cc,
                        "currency": currency,
                        "price": round(price, 2),
                        "timestamp": now_str()
                    })
                    break
    return results

# ==================== 主流程 ====================
def scrape_amazon():
    print("=" * 60)
    print("Phase 1: Amazon (direct fetch, free)")
    print("=" * 60)
    all_prices = []
    seen = set()

    for store in AMAZON_STORES:
        domain, cc, currency = store["domain"], store["cc"], store["currency"]
        print(f"\n--- {domain} ({cc}, {currency}) ---")
        for query in SEARCH_QUERIES:
            url = f"https://www.{domain}/s?k={query}"
            print(f"  Fetching: {query}...")
            html = fetch_direct(url)
            if not html:
                continue
            products = extract_amazon_products(html, cc, currency, domain)
            for p in products:
                key = (p["product_name"].lower(), p["country_code"])
                if key not in seen:
                    seen.add(key)
                    all_prices.append(p)
                    print(f"    {p['product_name']}: {p['price']} {p['currency']}")
            time.sleep(random.uniform(2, 4))

    print(f"\nAmazon total: {len(all_prices)} products")
    return all_prices, seen

def scrape_aggregators(seen):
    if not SCRAPINGBEE_KEY:
        print("\nNo SCRAPINGBEE_API_KEY — skipping aggregator sites")
        return []

    print("\n" + "=" * 60)
    print("Phase 2: Aggregator sites (via ScrapingBee)")
    print(f"API Key: {SCRAPINGBEE_KEY[:8]}...")
    print("=" * 60)

    all_prices = []
    api_calls = 0

    for site in AGGREGATOR_SITES:
        name, cc, currency, url = site["name"], site["cc"], site["currency"], site["url"]
        print(f"\n--- {name} ({cc}, {currency}) ---")
        print(f"  URL: {url}")

        html = fetch_via_scrapingbee(url, render_js=True)
        api_calls += 1
        if not html:
            continue

        products = extract_aggregator_products(html, name, cc, currency)
        for p in products:
            key = (p["product_name"].lower(), p["country_code"])
            if key not in seen:
                seen.add(key)
                all_prices.append(p)
                print(f"    {p['product_name']}: {p['price']} {p['currency']}")

        time.sleep(1)

        if api_calls >= 20:
            print(f"\n  Reached {api_calls} API calls, stopping to conserve quota")
            break

    print(f"\nAggregator total: {len(all_prices)} products (used {api_calls} API calls)")
    return all_prices

def main():
    amazon_prices, seen = scrape_amazon()
    aggregator_prices = scrape_aggregators(seen)

    all_prices = amazon_prices + aggregator_prices

    if len(all_prices) < 10:
        print(f"\nOnly {len(all_prices)} results — keeping existing prices.json unchanged")
        sys.exit(0)

    countries = set(p["country_code"] for p in all_prices)
    platforms = set(p["platform"] for p in all_prices)

    output = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "total": len(all_prices),
        "countries": len(countries),
        "sources": sorted(platforms),
        "prices": sorted(all_prices, key=lambda p: (p["country_code"], p["product_name"]))
    }

    with open("prices.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"Done! {len(all_prices)} records from {len(countries)} countries, {len(platforms)} platforms")
    print(f"Platforms: {', '.join(sorted(platforms))}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
