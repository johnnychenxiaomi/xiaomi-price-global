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
    {"name": "Idealo.de", "cc": "DE", "currency": "EUR", "proxy_cc": "de",
     "url": "https://www.idealo.de/preisvergleich/ProductCategory/19116.html?q=Xiaomi"},
    {"name": "Idealo.fr", "cc": "FR", "currency": "EUR", "proxy_cc": "fr",
     "url": "https://www.idealo.fr/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Idealo.es", "cc": "ES", "currency": "EUR", "proxy_cc": "es",
     "url": "https://www.idealo.es/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Idealo.it", "cc": "IT", "currency": "EUR", "proxy_cc": "it",
     "url": "https://www.idealo.it/cat/19116/smartphones.html?q=Xiaomi"},
    {"name": "Ceneo.pl", "cc": "PL", "currency": "PLN", "proxy_cc": "pl",
     "url": "https://www.ceneo.pl/Smartfony;szukaj-Xiaomi"},
    {"name": "Geizhals.at", "cc": "AT", "currency": "EUR", "proxy_cc": "at",
     "url": "https://geizhals.at/?fs=Xiaomi&cat=umtsover"},
    {"name": "PriceRunner.se", "cc": "SE", "currency": "SEK", "proxy_cc": "se",
     "url": "https://www.pricerunner.se/cl/36/Mobiltelefoner?q=Xiaomi"},
    {"name": "PriceRunner.dk", "cc": "DK", "currency": "DKK", "proxy_cc": "dk",
     "url": "https://www.pricerunner.dk/cl/36/Mobiltelefoner?q=Xiaomi"},
    {"name": "Skroutz.gr", "cc": "GR", "currency": "EUR", "proxy_cc": "gr",
     "url": "https://www.skroutz.gr/search?keyphrase=Xiaomi+smartphone"},
    {"name": "Heureka.cz", "cc": "CZ", "currency": "CZK", "proxy_cc": "cz",
     "url": "https://www.heureka.cz/?h%5Bfraze%5D=Xiaomi+smartphone"},
]

XIAOMI_KEYWORDS = ["xiaomi", "redmi", "poco"]
ACCESSORY_KEYWORDS = ['case', 'cover', 'screen', 'protector', 'film', 'cable', 'charger',
                      'adapter', 'tempered', 'glass', 'silicone', 'holder', 'stand',
                      'earbuds', 'buds', 'watch', 'band', 'router', 'power bank',
                      'powerbank', 'scooter', 'vacuum', 'purifier', 'camera', 'dashcam']

AMAZON_PRICE_PATTERNS = [
    re.compile(r'class="a-offscreen">\s*[€£]\s*([\d\s.,]+)'),
    re.compile(r'class="a-offscreen">\s*([\d\s.,]+)\s*[€£zł]'),
    re.compile(r'([\d]+[.,]\d{2})\s*[€£]'),
    re.compile(r'[€£]\s*([\d]+[.,]\d{2})'),
    re.compile(r'([\d\s]+[.,]\d{2})\s*(?:zł|kr|PLN|SEK|GBP)'),
    re.compile(r'class="a-price-whole">([\d.,]+)</span>'),
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
    text = text.strip().replace('\xa0', ' ').replace('\u202f', '')
    text = re.sub(r'\s+', '', text)
    # 判断最后一个分隔符是小数点还是千分位
    # "1.234,56" → 1234.56 | "1,234.56" → 1234.56 | "320,00" → 320.00 | "320.00" → 320.00
    last_comma = text.rfind(',')
    last_dot = text.rfind('.')
    if last_comma > last_dot:
        text = text.replace('.', '').replace(',', '.')
    elif last_dot > last_comma:
        text = text.replace(',', '')
    else:
        text = text.replace(',', '.')
    try:
        v = float(text)
        return v if 30 < v < 5000 else None
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
def fetch_via_scrapingbee(url, render_js=True, country="de", wait=0):
    if not SCRAPINGBEE_KEY:
        debug("    No ScrapingBee API key, skipping")
        return None
    params = f"api_key={SCRAPINGBEE_KEY}&url={quote_plus(url)}&render_js={'true' if render_js else 'false'}&premium_proxy=true&country_code={country}"
    if wait:
        params += f"&wait={wait}"
    api_url = f"https://app.scrapingbee.com/api/v1/?{params}"
    try:
        req = Request(api_url, headers={"Accept": "text/html"})
        with urlopen(req, timeout=60) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            debug(f"    ScrapingBee OK, {len(html)} bytes for {url}")
            return html
    except HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if hasattr(e, 'read') else ""
        debug(f"    ScrapingBee HTTP {e.code} for {url}: {body[:200]}")
        return None
    except (URLError, TimeoutError) as e:
        debug(f"    ScrapingBee error for {url}: {e}")
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
def extract_idealo_products(html, site_name, cc, currency):
    """Idealo 专用解析: 按 sr-productSummary 分割产品卡片 (验证: 36/36 产品匹配成功)"""
    results = []
    seen = set()
    cards = re.split(r'class="sr-productSummary', html)
    if len(cards) < 3:
        cards = re.split(r'class="sr-resultItemTile', html)
    if len(cards) < 3:
        return extract_generic_products(html, site_name, cc, currency)
    for card in cards[1:]:
        name_m = re.search(r'(?:title|alt|aria-label)="([^"]*(?:Xiaomi|Redmi|POCO)[^"]*)"', card[:3000], re.IGNORECASE)
        if not name_m:
            name_m = re.search(r'>([^<]*(?:Xiaomi|Redmi|POCO)[^<]{5,80})</(?:a|span|h2|h3|div)', card[:3000], re.IGNORECASE)
        if not name_m:
            continue
        name = clean_name(name_m.group(1))
        if not is_xiaomi_phone(name) or name.lower() in seen:
            continue
        price_m = re.search(r'(\d{2,4}[.,]\d{2})\s*\u20ac', card[:5000])
        if not price_m:
            continue
        price = parse_price(price_m.group(1))
        if price and price > 80:
            seen.add(name.lower())
            results.append({"product_name": name, "platform": site_name,
                           "country_code": cc, "currency": currency,
                           "price": round(price, 2), "timestamp": now_str()})
    return results

def extract_generic_products(html, site_name, cc, currency):
    """通用解析: 多种分割策略 + 站点特定适配"""
    results = []
    seen = set()
    currency_symbols = {"EUR": "\u20ac", "PLN": "z\u0142", "SEK": "kr", "DKK": "kr",
                        "CZK": "K\u010d", "GBP": "\u00a3", "NOK": "kr", "HUF": "Ft"}
    sym = currency_symbols.get(currency, "\u20ac")

    # 站点特定分割模式
    site_lower = site_name.lower()
    site_splitters = []
    if "ceneo" in site_lower:
        site_splitters = [r'class="cat-prod-row', r'class="grid-item', r'class="product-item']
    elif "geizhals" in site_lower:
        site_splitters = [r'class="productlist__product', r'class="listview__item']
    elif "pricerunner" in site_lower:
        site_splitters = [r'class="[^"]*ProductCard', r'data-testid="[^"]*product-card']
    elif "skroutz" in site_lower:
        site_splitters = [r'class="[^"]*sku-card', r'class="[^"]*cf card']
    elif "heureka" in site_lower:
        site_splitters = [r'class="[^"]*product-list__item', r'data-testid="product-card']

    cards = None
    for splitter in site_splitters + [
        r'class="[^"]*(?:product|result|item|card)[^"]*(?:Card|Item|Tile|Row|List)',
        r'data-testid="[^"]*product',
        r'<article',
        r'<li[^>]*class="[^"]*product'
    ]:
        parts = re.split(splitter, html, flags=re.IGNORECASE)
        if len(parts) > 3:
            cards = parts
            break

    if not cards:
        cards = [html]

    for card in cards[1:] if len(cards) > 1 else [html]:
        name_m = re.search(r'(?:title|alt|aria-label)="([^"]*(?:Xiaomi|Redmi|POCO)[^"]*)"', card[:5000], re.IGNORECASE)
        if not name_m:
            name_m = re.search(r'>([^<]*(?:Xiaomi|Redmi|POCO)[^<]{5,80})</(?:a|span|h2|h3|div|p)', card[:5000], re.IGNORECASE)
        if not name_m:
            continue
        name = clean_name(name_m.group(1))
        if not is_xiaomi_phone(name) or name.lower() in seen:
            continue

        for pat in GENERIC_PRICE_PATTERNS:
            price_m = pat.search(card[:5000])
            if price_m:
                price = parse_price(price_m.group(1))
                if price and price > 50:
                    seen.add(name.lower())
                    results.append({"product_name": name, "platform": site_name,
                                   "country_code": cc, "currency": currency,
                                   "price": round(price, 2), "timestamp": now_str()})
                    break
    return results

def extract_aggregator_products(html, site_name, cc, currency):
    """智能选择解析器"""
    if "idealo" in site_name.lower():
        return extract_idealo_products(html, site_name, cc, currency)
    return extract_generic_products(html, site_name, cc, currency)

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
        return [], 0

    print("\n" + "=" * 60)
    print("Phase 2: Aggregator sites (via ScrapingBee)")
    print(f"API Key: {SCRAPINGBEE_KEY[:8]}...")
    print("=" * 60)

    all_prices = []
    api_calls = 0

    for site in AGGREGATOR_SITES:
        name, cc, currency, url = site["name"], site["cc"], site["currency"], site["url"]
        proxy_cc = site.get("proxy_cc", "de")
        print(f"\n--- {name} ({cc}, {currency}) ---")
        print(f"  URL: {url}")

        html = fetch_via_scrapingbee(url, render_js=True, country=proxy_cc)
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
    return all_prices, api_calls

# ==================== 小米官网价格 (Phase 3) ====================
MI_STORE_SITES = [
    {"cc": "DE", "locale": "de", "currency": "EUR", "base": "https://www.mi.com/de"},
    {"cc": "FR", "locale": "fr", "currency": "EUR", "base": "https://www.mi.com/fr"},
    {"cc": "ES", "locale": "es", "currency": "EUR", "base": "https://www.mi.com/es"},
    {"cc": "IT", "locale": "it", "currency": "EUR", "base": "https://www.mi.com/it"},
    {"cc": "NL", "locale": "nl", "currency": "EUR", "base": "https://www.mi.com/nl"},
    {"cc": "PL", "locale": "pl", "currency": "PLN", "base": "https://www.mi.com/pl"},
    {"cc": "RO", "locale": "ro", "currency": "RON", "base": "https://www.mi.com/ro"},
    {"cc": "CZ", "locale": "cz", "currency": "CZK", "base": "https://www.mi.com/cz"},
    {"cc": "GR", "locale": "gr", "currency": "EUR", "base": "https://www.mi.com/gr"},
    {"cc": "SE", "locale": "se", "currency": "SEK", "base": "https://www.mi.com/se"},
    {"cc": "AT", "locale": "at", "currency": "EUR", "base": "https://www.mi.com/at"},
    {"cc": "GB", "locale": "gb", "currency": "GBP", "base": "https://www.mi.com/gb"},
    {"cc": "DK", "locale": "dk", "currency": "DKK", "base": "https://www.mi.com/dk"},
]

MI_PRODUCT_SLUGS = [
    ("Xiaomi 17 Ultra", "xiaomi-17-ultra"),
    ("Xiaomi 17T", "xiaomi-17t"),
    ("Xiaomi 17T Pro", "xiaomi-17t-pro"),
    ("Xiaomi 15T", "xiaomi-15t"),
    ("Xiaomi 15T Pro", "xiaomi-15t-pro"),
    ("Redmi Note 15 Pro 5G", "redmi-note-15-pro-5g"),
    ("Redmi Note 15 Pro+ 5G", "redmi-note-15-pro-plus-5g"),
    ("POCO F8 Ultra", "poco-f8-ultra"),
    ("POCO X8 Pro", "poco-x8-pro"),
    ("POCO F7", "poco-f7"),
    ("POCO F7 Pro", "poco-f7-pro"),
    ("Redmi Note 14 Pro 5G", "redmi-note-14-pro-5g"),
]

def extract_mistore_price(html):
    """从 JSON-LD 提取小米官网价格"""
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL):
        try:
            data = json.loads(m.group(1))
            if isinstance(data, list):
                data = data[0]
            if data.get("@type") == "Product":
                offers = data.get("offers", {})
                if isinstance(offers, dict):
                    price = offers.get("price")
                    currency = offers.get("priceCurrency")
                    if price and currency:
                        return float(str(price).replace(",", ".")), currency
                elif isinstance(offers, list) and offers:
                    o = offers[0]
                    price = o.get("price") or o.get("lowPrice")
                    currency = o.get("priceCurrency")
                    if price and currency:
                        return float(str(price).replace(",", ".")), currency
        except (json.JSONDecodeError, ValueError):
            pass
    # 也试 aria-label="Current Price XXX"
    m = re.search(r'aria-label="Current Price\s*([\d.]+)"', html)
    if m:
        return float(m.group(1)), None
    return None, None

def scrape_mistore(seen):
    """Phase 3: 用 Playwright 免费抓取小米官网价格（不消耗 ScrapingBee 额度）"""
    print("\n" + "=" * 60)
    print("Phase 3: Mi Store official prices (via Playwright, FREE)")
    print("=" * 60)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        debug("Playwright not installed — skipping Mi Store")
        return []

    all_prices = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        )
        count = 0
        for site in MI_STORE_SITES:
            cc, currency, base = site["cc"], site["currency"], site["base"]
            print(f"\n--- Mi Store {cc} ({base}) ---")

            for product_name, slug in MI_PRODUCT_SLUGS:
                key = (product_name.lower(), cc)
                if key in seen:
                    continue

                url = f"{base}/product/{slug}"
                print(f"  {product_name}...", end=" ", flush=True)
                try:
                    page.goto(url, wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(2000)
                    html = page.content()
                    count += 1

                    price, cur = extract_mistore_price(html)
                    if price and 30 < price < 50000:
                        seen.add(key)
                        actual_currency = cur if cur else currency
                        all_prices.append({
                            "product_name": product_name,
                            "platform": f"Mi Store ({cc})",
                            "country_code": cc,
                            "currency": actual_currency,
                            "price": round(price, 2),
                            "timestamp": now_str(),
                            "is_official": True
                        })
                        print(f"{price} {actual_currency}")
                    else:
                        print("no price found")
                except Exception as e:
                    print(f"error: {e}")
                    debug(f"  Playwright error {cc}/{slug}: {e}")

        browser.close()

    debug(f"Mi Store total: {len(all_prices)} prices from {count} pages (FREE, no API credits used)")
    print(f"\nMi Store total: {len(all_prices)} products ({count} pages fetched, FREE)")
    return all_prices

DEBUG_LOG = []

def debug(msg):
    DEBUG_LOG.append(f"[{now_str()}] {msg}")
    print(msg)

def write_debug():
    with open("debug_run.txt", "w") as f:
        f.write("\n".join(DEBUG_LOG))

def main():
    debug(f"SCRAPINGBEE_KEY present: {bool(SCRAPINGBEE_KEY)} (len={len(SCRAPINGBEE_KEY)})")
    debug(f"SCRAPINGBEE_KEY first 8: {SCRAPINGBEE_KEY[:8] if SCRAPINGBEE_KEY else '(empty)'}")
    amazon_prices, seen = scrape_amazon()
    debug(f"Phase 1 done: {len(amazon_prices)} Amazon prices")
    aggregator_prices, agg_api_calls = scrape_aggregators(seen)
    debug(f"Phase 2 done: {len(aggregator_prices)} aggregator prices, {agg_api_calls} API calls")
    mistore_prices = scrape_mistore(seen)
    debug(f"Phase 3 done: {len(mistore_prices)} Mi Store prices")

    all_prices = amazon_prices + aggregator_prices + mistore_prices

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
    write_debug()

if __name__ == "__main__":
    main()
