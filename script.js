// 小米产品全球比价插件 - 主逻辑
// 支持东北欧28个国家，264个产品

// 从Excel提取的产品列表（short_name）
const productList = [
    "Xiaomi 13T Pro", "Redmi 9AT", "Redmi Note 12S", "小米3", "REDMI Note 15 5G",
    "Xiaomi 15T Pro", "REDMI Pad 2 9.7", "红米1", "Redmi Note 11S", "Redmi 10 2022",
    "Xiaomi 17T Pro", "Redmi Note 14 5G", "Redmi Pad 2", "Redmi 13C", "小米Note1",
    "Redmi 9C NFC", "红米5", "小米8", "Redmi A3x", "REDMI Note 15",
    "小米Mix2", "Redmi Pad Pro", "Redmi Note 10T", "Redmi 15C 5G", "REDMI A7",
    "小米Mix2S", "Redmi 10C", "红米Note1", "Redmi 14C", "Redmi Note 11 Pro",
    "Xiaomi Pad 8 Pro", "Redmi Note 11", "Xiaomi MIX Flip", "Redmi 13C 5G",
    "Redmi Pad Pro 5G", "红米Note5A", "Mi 9", "Mi 8 Lite", "Redmi Note 12 Pro 5G",
    "REDMI 15", "Redmi Y2", "Redmi Pad 2 4G", "Redmi 14C 5G", "Redmi A1",
    "小米5X", "小米Max2", "小米2S", "Redmi Note 14", "Redmi 12C",
    "REDMI Note 15 SE 5G", "Redmi Note 14 Pro 5G", "REDMI A7 Pro", "红米5 Plus",
    "Xiaomi 12", "Redmi 9A", "Redmi 15C", "Redmi 9C", "Redmi Note 10 Pro",
    "Redmi Pad", "Redmi A1+", "小米4C", "Redmi 13 5G", "Redmi Pad SE",
    "Xiaomi 17T", "Xiaomi Pad 7 Pro", "红米Pro1", "Xiaomi Pad 8", "MI Tablet 1",
    "Redmi Note 5", "Xiaomi 17", "Redmi 12", "Xiaomi 15 Ultra", "红米6",
    "REDMI A7 Pro 5G", "Redmi Note 12", "Redmi Go", "Xiaomi 14T Pro",
    "Redmi Note 14 Pro+ 5G", "Redmi Note 12 Pro+ 5G", "Redmi Note 14S",
    "REDMI 13x", "REDMI Pad 2 9.7 4G", "Redmi 10 5G", "Xiaomi 13 Lite",
    "REDMI Note 15 Pro+ 5G", "红米Note2", "Xiaomi Civi 4 Pro", "Redmi A3 Pro",
    "Xiaomi 13T", "红米6A", "Xiaomi 15", "Mi MIX 3", "Redmi Note 11 Pro 5G",
    "Xiaomi 14T", "Redmi Pad 2 Pro", "Redmi Pad 2 Pro 5G", "红米2",
    "Xiaomi 12 Pro", "REDMI Note 15 Pro 5G", "Redmi Note 10 5G", "Xiaomi Pad 6",
    "Redmi Note 10S", "小米8 Pro", "Xiaomi 11 Lite 5G NE", "小米Max1",
    "Redmi 13", "Redmi A5", "红米4A", "Xiaomi Pad 4", "Redmi 12 5G",
    "Redmi 15A 5G", "Redmi Note 6 Pro", "Xiaomi 15T", "红米5A", "Redmi A4 5G",
    "小米6X", "Redmi 7A", "Xiaomi 17 Ultra", "红米Note3", "Redmi A2",
    "Redmi 10A", "Redmi Note 11 Pro+ 5G", "REDMI 15 5G", "Mi Max 3",
    "REDMI Note 15 Pro", "红米6 Pro", "Redmi Note 11S 5G", "Xiaomi 12 Lite",
    "Xiaomi Pad Mini", "Redmi Pad SE 8.7", "Xiaomi Pad 7", "Redmi Note 12 Pro",
    "Redmi Pad SE 8.7 4G", "Redmi Note7 Pro", "红米1S", "Redmi Note 14 pro",
    "小米11", "POCO M6 5G", "POCO F8 Ultra", "POCO C85x 5G", "POCO F8 Pro",
    "POCO F6", "POCO M2", "POCO M6 Plus 5G", "POCO C75", "Redmi Note 11 SE",
    "Redmi 10 Prime 2022", "POCO C75 5G", "Redmi 9", "POCO M7 Pro 5G",
    "POCO X5 5G", "POCO M7 5G", "POCO M5s", "POCO F7 Ultra", "POCO M8 Pro 5G",
    "POCO F6 Pro", "POCO M5", "POCO C40", "Redmi Note 9 Pro", "POCO X5 Pro 5G",
    "REDMI Turbo 5 5G", "Redmi 11 Prime", "Redmi 10", "POCO F5", "POCO M7",
    "POCO C55", "POCO X7", "POCO C50", "POCO Pad 5G", "POCO Pad C1",
    "POCO X2", "POCO C81x", "POCO X8 Pro Max", "POCO M6", "POCO M4 5G",
    "POCO X7 Pro", "POCO X4 Pro 5G", "POCO M2 Pro", "POCO C85", "POCO PAD",
    "POCO F3 GT", "POCO F7 Pro", "POCO X8 Pro", "Redmi 10 Prime", "POCO M4 PRO 5G",
    "POCO C31", "POCO M8 5G", "POCO C85 5G", "POCO F7", "Redmi 9i", "POCO Pad X1",
    "POCO C71", "POCO C61", "POCO M8s 5G", "POCO F1", "POCO Pad M1", "POCO C81 Pro",
    "POCO M3 Pro", "POCO F4", "POCO F5 Pro", "POCO F4 GT", "POCO F2 Pro",
    "POCO X6 5G", "POCO M6 Pro", "POCO C51", "POCO X6 Pro 5G", "POCO X4 GT",
    "POCO C65", "POCO M3", "POCO F3", "POCO X3", "POCO X3 GT", "POCO M4 Pro",
    "POCO X3 Pro", "Redmi A3", "Xiaomi 13 Pro", "Redmi Note 9T", "Redmi Note 13 5G",
    "Mi 11i", "小米10", "Xiaomi 12X", "Xiaomi Pad 6S Pro 12.4", "Redmi Note 13",
    "小米Mix3", "Redmi Note 9", "Redmi Note 10 JE", "Redmi 8", "Xiaomi 14",
    "Redmi Note 10", "Redmi Note 13 Pro 5G", "Redmi Note 13 Pro", "小米Note 10",
    "Redmi 8A", "Mi 9T", "Xiaomi 11T Pro", "Xiaomi 13 Ultra", "Redmi 9T",
    "Xiaomi 12T", "Mi 11 Ultra", "Redmi 7", "Mi 10 Lite", "Redmi Note 9S",
    "Mi Note 10 Lite", "小米9T Pro", "Mi 10T", "Redmi Note 8 (2021)", "Mi 9 Lite",
    "Mi 10", "Mi 10T Lite", "Redmi Note 8T", "Redmi Note 13 Pro+ 5G", "Mi 9 SE",
    "Xiaomi 12T Pro", "Redmi Note 7", "小米11青春版", "Redmi Note 8 Pro",
    "Redmi Note 12 5G", "Mi A3", "Xiaomi 13", "Redmi Note 8", "Xiaomi Pad 5",
    "Xiaomi 11T", "Mi 11 Lite", "Xiaomi 14 Ultra"
];

// 生成模拟价格数据的函数
function generateMockPrice(basePrice, variance = 0.1) {
    const min = basePrice * (1 - variance);
    const max = basePrice * (1 + variance);
    return Math.round(min + Math.random() * (max - min));
}

// 根据产品名称估算基础价格
function estimateBasePrice(productName) {
    const name = productName.toLowerCase();
    
    // 高端机型
    if (name.includes('ultra') || name.includes('pro+') || name.includes('15 ultra') || name.includes('14 ultra')) {
        return 899;
    }
    // 中高端机型
    if (name.includes('xiaomi 14') || name.includes('xiaomi 15') || name.includes('xiaomi 13 pro') || 
        name.includes('xiaomi 12 pro') || name.includes('11 ultra') || name.includes('mix')) {
        return 599;
    }
    // 中端机型
    if (name.includes('xiaomi 13') || name.includes('xiaomi 12') || name.includes('xiaomi 11') || 
        name.includes('redmi note') || name.includes('poco f') || name.includes('poco x')) {
        return 399;
    }
    // 入门中端
    if (name.includes('redmi 13') || name.includes('redmi 12') || name.includes('redmi 10') || 
        name.includes('poco m') || name.includes('redmi note 12') || name.includes('redmi note 11')) {
        return 249;
    }
    // 平板
    if (name.includes('pad') || name.includes('tablet')) {
        return 299;
    }
    // 入门机型
    if (name.includes('redmi 9') || name.includes('redmi 8') || name.includes('redmi a') || 
        name.includes('poco c') || name.includes('redmi go')) {
        return 129;
    }
    // 老款机型
    if (name.includes('小米') || name.includes('红米') || name.includes('mi ') || name.includes('mi 9') || 
        name.includes('mi 10') || name.includes('mi 11')) {
        return 199;
    }
    
    return 299; // 默认价格
}

// 生成产品详情页链接
function generateProductUrl(productName, platformUrl) {
    const q = encodeURIComponent(productName);
    const host = platformUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '').toLowerCase();
    
    // 各平台真实搜索路径映射
    const searchPaths = {
        // 小米官网 — 直接搜索
        'mi.com':               `/search?keyword=${q}`,
        'mi-store.pl':          `/szukaj?q=${q}`,
        'mi-store.cz':          `/hledani?q=${q}`,
        'mi-store.sk':          `/vyhladavanie?q=${q}`,
        'mi-store.hu':          `/kereses?q=${q}`,
        'mi-store.ro':          `/cautare?q=${q}`,
        'mi-store.rs':          `/pretraga?q=${q}`,
        'mi-store.hr':          `/pretraga?q=${q}`,
        'mi-store.si':          `/iskanje?q=${q}`,
        'mi-store.bg':          `/tyrsene?q=${q}`,
        'mi-store.ua':          `/search?q=${q}`,
        'mi-store.lv':          `/meklet?q=${q}`,
        'mi-store.lt':          `/paieska?q=${q}`,
        'mi-store.ee':          `/otsing?q=${q}`,
        
        // 比价聚合网站
        'ceneo.pl':             `/szukaj-${q.replace(/%20/g, '-')}`,
        'heureka.cz':           `/porovnani-cen/?q=${q}`,
        'heureka.sk':           `/porovnanie-cien/?q=${q}`,
        'arukereso.hu':         `/kereses/?s=${q}`,
        'skroutz.gr':           `/search?keyphrase=${q}`,
        'compari.ro':           `/search/?q=${q}`,
        'pricerunner.se':       `/search?q=${q}`,
        'pricerunner.dk':       `/search?q=${q}`,
        'hinta.fi':             `/search?q=${q}`,
        'prisguiden.no':        `/search?q=${q}`,
        'hotline.ua':           `/ua/sr/?q=${q}`,
        'pazaruvaj.com':        `/search/?q=${q}`,
        'jeftinije.hr':         `/search/?q=${q}`,
        'ceneje.si':            `/iskanje/?q=${q}`,
        'idealno.rs':           `/search/?q=${q}`,
        'salidzini.lv':         `/cenu-salid/?q=${q}`,
        'kainos.lt':            `/search/?q=${q}`,
        'hinnavaatlus.ee':      `/search/?q=${q}`,
        
        // 波兰电商
        'euro.com.pl':          `/search.bhtml?keyword=${q}`,
        'mediaexpert.pl':       `/search?query[]=${q}`,
        
        // 罗马尼亚电商
        'emag.ro':              `/search/${q}`,
        'altex.ro':             `/cmp/search?q=${q}`,
        'pcgarage.ro':          `/cauta/${q}`,
        
        // 捷克电商
        'alza.cz':              `/search.htm?exps=${q}`,
        'czc.cz':               `/hledat?q=${q}`,
        'mall.cz':              `/hledani/?search=${q}`,
        
        // 斯洛伐克电商
        'alza.sk':              `/search.htm?exps=${q}`,
        'hej.sk':               `/hladanie?q=${q}`,
        'mall.sk':              `/hladanie/?search=${q}`,
        
        // 匈牙利电商
        'emag.hu':              `/search/${q}`,
        'mediamarkt.hu':        `/kereso/${q}`,
        'aqua.hu':              `/kereses?q=${q}`,
        
        // 瑞典电商
        'komplett.se':          `/search?q=${q}`,
        'webhallen.com':        `/search?query=${q}`,
        'inet.se':              `/search?q=${q}`,
        
        // 丹麦电商
        'komplett.dk':          `/search?q=${q}`,
        'proshop.dk':           `/Search?sId=&q=${q}`,
        'power.dk':             `/search/?q=${q}`,
        
        // 芬兰电商
        'verkkokauppa.com':     `/fi/search?query=${q}`,
        'gigantti.fi':          `/search/${q}`,
        'jimms.fi':             `/tuotehaku?q=${q}`,
        
        // 挪威电商
        'komplett.no':          `/search?q=${q}`,
        'elkjop.no':            `/search/${q}`,
        'power.no':             `/search/?q=${q}`,
        
        // 希腊电商
        'public.gr':            `/search/?q=${q}`,
        'kotsovolos.gr':        `/search/${q}`,
        'plaisio.gr':           `/SearchResults?keyword=${q}`,
        
        // 乌克兰电商
        'rozetka.com.ua':       `/search/?text=${q}`,
        'allo.ua':              `/ua/search/?searchtext=${q}`,
        'foxtrot.com.ua':       `/search/?q=${q}`,
        
        // 克罗地亚电商
        'links.hr':             `/search?q=${q}`,
        'hgspot.hr':            `/search?q=${q}`,
        'instar-informatika.hr':`/search?q=${q}`,
        
        // 斯洛文尼亚电商
        'bigbang.si':           `/iskanje?q=${q}`,
        'mimovrste.com':        `/iskanje?q=${q}`,
        'enaa.com':             `/iskanje?q=${q}`,
        
        // 塞尔维亚电商
        'tehnomanija.rs':       `/pretraga?q=${q}`,
        'gigatron.rs':          `/search?q=${q}`,
        'winwin.rs':            `/pretraga?q=${q}`,
        
        // 拉脱维亚电商
        '1a.lv':                `/search/?q=${q}`,
        '220.lv':               `/lv/search/?q=${q}`,
        'rdveikals.lv':         `/search?q=${q}`,
        
        // 立陶宛电商
        'varle.lt':             `/paieska/${q}`,
        'kilobaitas.lt':        `/paieska?q=${q}`,
        'topocentras.lt':       `/paieska?q=${q}`,
        
        // 爱沙尼亚电商
        '1a.ee':                `/search/?q=${q}`,
        'klick.ee':             `/search?q=${q}`,
        'euronics.ee':          `/search?q=${q}`,
        
        // 保加利亚电商
        'ozone.bg':             `/search/?q=${q}`,
        'technopolis.bg':       `/search/?q=${q}`,
        'technomarket.bg':      `/search/?q=${q}`,
    };

    // 匹配：精确匹配或尝试 mi.com 子路径
    for (const [domain, path] of Object.entries(searchPaths)) {
        if (host === domain || host.endsWith('.' + domain)) {
            return platformUrl.replace(/\/+$/, '') + path;
        }
    }
    
    // mi.com 子路径 (mi.com/se, mi.com/dk 等)
    if (platformUrl.includes('mi.com/')) {
        return platformUrl.replace(/\/+$/, '') + searchPaths['mi.com'];
    }

    // 通用回退：大多数网站支持 /search?q=
    return platformUrl.replace(/\/+$/, '') + `/search?q=${q}`;
}

// 东北欧国家数据
const countryData = {
    "波兰": {
        currency: "PLN",
        currencySymbol: "zł",
        miStoreUrl: "https://mi-store.pl",
        aggregator: { name: "Ceneo.pl", url: "https://www.ceneo.pl",
            sellers: [
                { name: "Mi-Store.pl", url: "https://mi-store.pl" },
                { name: "Euro RTV AGD", url: "https://www.euro.com.pl" },
                { name: "Media Expert", url: "https://www.mediaexpert.pl" },
                { name: "x-kom", url: "https://www.x-kom.pl" },
                { name: "Komputronik", url: "https://www.komputronik.pl" },
                { name: "Media Markt", url: "https://www.mediamarkt.pl" },
                { name: "Neonet", url: "https://www.neonet.pl" },
                { name: "Morele.net", url: "https://www.morele.net" }
            ]
        },
        platforms: [
            { name: "Mi Store Poland", url: "https://mi-store.pl" },
            { name: "Ceneo.pl (聚合)", url: "https://www.ceneo.pl" },
            { name: "Euro RTV AGD", url: "https://www.euro.com.pl" },
            { name: "Media Expert", url: "https://www.mediaexpert.pl" },
            { name: "x-kom", url: "https://www.x-kom.pl" }
        ]
    },
    "罗马尼亚": {
        currency: "RON",
        currencySymbol: "lei",
        miStoreUrl: "https://mi-store.ro",
        aggregator: { name: "Compari.ro", url: "https://www.compari.ro",
            sellers: [
                { name: "eMAG", url: "https://www.emag.ro" },
                { name: "Altex", url: "https://www.altex.ro" },
                { name: "PCGarage", url: "https://www.pcgarage.ro" },
                { name: "Flanco", url: "https://www.flanco.ro" },
                { name: "CEL.ro", url: "https://www.cel.ro" },
                { name: "evoMAG", url: "https://www.evomag.ro" },
                { name: "Mi-Store.ro", url: "https://mi-store.ro" }
            ]
        },
        platforms: [
            { name: "Mi Store Romania", url: "https://mi-store.ro" },
            { name: "Compari.ro (聚合)", url: "https://www.compari.ro" },
            { name: "eMAG", url: "https://www.emag.ro" },
            { name: "Altex", url: "https://www.altex.ro" },
            { name: "PCGarage", url: "https://www.pcgarage.ro" }
        ]
    },
    "捷克": {
        currency: "CZK",
        currencySymbol: "Kč",
        miStoreUrl: "https://mi-store.cz",
        aggregator: { name: "Heureka.cz", url: "https://www.heureka.cz",
            sellers: [
                { name: "Alza.cz", url: "https://www.alza.cz" },
                { name: "CZC.cz", url: "https://www.czc.cz" },
                { name: "Mall.cz", url: "https://www.mall.cz" },
                { name: "Datart", url: "https://www.datart.cz" },
                { name: "Electroworld", url: "https://www.electroworld.cz" },
                { name: "Mi-Store.cz", url: "https://mi-store.cz" },
                { name: "Mobilpohotovost", url: "https://www.mobilpohotovost.cz" }
            ]
        },
        platforms: [
            { name: "Mi Store Czech", url: "https://mi-store.cz" },
            { name: "Heureka.cz (聚合)", url: "https://www.heureka.cz" },
            { name: "Alza.cz", url: "https://www.alza.cz" },
            { name: "CZC.cz", url: "https://www.czc.cz" },
            { name: "Mall.cz", url: "https://www.mall.cz" }
        ]
    },
    "斯洛伐克": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.sk",
        aggregator: { name: "Heureka.sk", url: "https://www.heureka.sk",
            sellers: [
                { name: "Alza.sk", url: "https://www.alza.sk" },
                { name: "Mall.sk", url: "https://www.mall.sk" },
                { name: "Hej.sk", url: "https://www.hej.sk" },
                { name: "Datart.sk", url: "https://www.datart.sk" },
                { name: "NAY", url: "https://www.nay.sk" },
                { name: "Mi-Store.sk", url: "https://mi-store.sk" }
            ]
        },
        platforms: [
            { name: "Mi Store Slovakia", url: "https://mi-store.sk" },
            { name: "Heureka.sk (聚合)", url: "https://www.heureka.sk" },
            { name: "Alza.sk", url: "https://www.alza.sk" },
            { name: "Hej.sk", url: "https://www.hej.sk" },
            { name: "Mall.sk", url: "https://www.mall.sk" }
        ]
    },
    "匈牙利": {
        currency: "HUF",
        currencySymbol: "Ft",
        miStoreUrl: "https://mi-store.hu",
        aggregator: { name: "Arukereso.hu", url: "https://www.arukereso.hu",
            sellers: [
                { name: "eMAG Hungary", url: "https://www.emag.hu" },
                { name: "MediaMarkt", url: "https://www.mediamarkt.hu" },
                { name: "Aqua.hu", url: "https://www.aqua.hu" },
                { name: "Euronics", url: "https://www.euronics.hu" },
                { name: "iSTYLE", url: "https://www.istyle.hu" },
                { name: "Mi-Store.hu", url: "https://mi-store.hu" },
                { name: "Mall.hu", url: "https://www.mall.hu" }
            ]
        },
        platforms: [
            { name: "Mi Store Hungary", url: "https://mi-store.hu" },
            { name: "Arukereso.hu (聚合)", url: "https://www.arukereso.hu" },
            { name: "eMAG Hungary", url: "https://www.emag.hu" },
            { name: "MediaMarkt Hungary", url: "https://www.mediamarkt.hu" },
            { name: "Aqua.hu", url: "https://www.aqua.hu" }
        ]
    },
    "克罗地亚": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.hr",
        aggregator: { name: "Jeftinije.hr", url: "https://www.jeftinije.hr",
            sellers: [
                { name: "Links.hr", url: "https://www.links.hr" },
                { name: "HGSPOT", url: "https://www.hgspot.hr" },
                { name: "Instar", url: "https://www.instar-informatika.hr" },
                { name: "Sancta Domenica", url: "https://www.sancta-domenica.hr" },
                { name: "Mi-Store.hr", url: "https://mi-store.hr" }
            ]
        },
        platforms: [
            { name: "Mi Store Croatia", url: "https://mi-store.hr" },
            { name: "Jeftinije.hr (聚合)", url: "https://www.jeftinije.hr" },
            { name: "Links.hr", url: "https://www.links.hr" },
            { name: "HGSPOT", url: "https://www.hgspot.hr" },
            { name: "Instar", url: "https://www.instar-informatika.hr" }
        ]
    },
    "斯洛文尼亚": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.si",
        aggregator: { name: "Ceneje.si", url: "https://www.ceneje.si",
            sellers: [
                { name: "Big Bang", url: "https://www.bigbang.si" },
                { name: "Mimovrste", url: "https://www.mimovrste.com" },
                { name: "Enaa.com", url: "https://www.enaa.com" },
                { name: "Harvey Norman", url: "https://www.harveynorman.si" },
                { name: "Mi-Store.si", url: "https://mi-store.si" }
            ]
        },
        platforms: [
            { name: "Mi Store Slovenia", url: "https://mi-store.si" },
            { name: "Ceneje.si (聚合)", url: "https://www.ceneje.si" },
            { name: "Big Bang", url: "https://www.bigbang.si" },
            { name: "Mimovrste", url: "https://www.mimovrste.com" },
            { name: "Enaa.com", url: "https://www.enaa.com" }
        ]
    },
    "塞尔维亚": {
        currency: "RSD",
        currencySymbol: "din",
        miStoreUrl: "https://mi-store.rs",
        aggregator: { name: "Idealno.rs", url: "https://www.idealno.rs",
            sellers: [
                { name: "Tehnomanija", url: "https://www.tehnomanija.rs" },
                { name: "Gigatron", url: "https://www.gigatron.rs" },
                { name: "WinWin", url: "https://www.winwin.rs" },
                { name: "Emmezeta", url: "https://www.emmezeta.rs" },
                { name: "Mi-Store.rs", url: "https://mi-store.rs" },
                { name: "Comtrade", url: "https://www.ctshop.rs" }
            ]
        },
        platforms: [
            { name: "Mi Store Serbia", url: "https://mi-store.rs" },
            { name: "Idealno.rs (聚合)", url: "https://www.idealno.rs" },
            { name: "Tehnomanija", url: "https://www.tehnomanija.rs" },
            { name: "Gigatron", url: "https://www.gigatron.rs" },
            { name: "WinWin", url: "https://www.winwin.rs" }
        ]
    },
    "黑山": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.me",
        aggregator: null,
        platforms: [
            { name: "Mi Store Montenegro", url: "https://mi-store.me" },
            { name: "Volujak", url: "https://www.volujak.me" },
            { name: "Gigatron ME", url: "https://www.gigatron.me" }
        ]
    },
    "北马其顿": {
        currency: "MKD",
        currencySymbol: "ден",
        miStoreUrl: "https://mi-store.mk",
        aggregator: null,
        platforms: [
            { name: "Mi Store North Macedonia", url: "https://mi-store.mk" },
            { name: "Anhoch", url: "https://www.anhoch.com" },
            { name: "Neptun MK", url: "https://www.neptun.mk" }
        ]
    },
    "阿尔巴尼亚": {
        currency: "ALL",
        currencySymbol: "L",
        miStoreUrl: "https://mi-store.al",
        aggregator: null,
        platforms: [
            { name: "Mi Store Albania", url: "https://mi-store.al" },
            { name: "Neptun Albania", url: "https://www.neptun.al" },
            { name: "Euromax", url: "https://www.euromax.al" }
        ]
    },
    "波斯尼亚和黑塞哥维那": {
        currency: "BAM",
        currencySymbol: "KM",
        miStoreUrl: "https://mi-store.ba",
        aggregator: null,
        platforms: [
            { name: "Mi Store Bosnia", url: "https://mi-store.ba" },
            { name: "Tehnopolis", url: "https://www.tehnopolis.ba" },
            { name: "Msan", url: "https://www.msan.ba" }
        ]
    },
    "科索沃": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.xk",
        aggregator: null,
        platforms: [
            { name: "Mi Store Kosovo", url: "https://mi-store.xk" },
            { name: "Gjirafa", url: "https://www.gjirafa.com" },
            { name: "Neptun XK", url: "https://www.neptun-ks.com" }
        ]
    },
    "瑞典": {
        currency: "SEK",
        currencySymbol: "kr",
        miStoreUrl: "https://www.mi.com/se",
        aggregator: { name: "PriceRunner", url: "https://www.pricerunner.se",
            sellers: [
                { name: "Komplett", url: "https://www.komplett.se" },
                { name: "Webhallen", url: "https://www.webhallen.com" },
                { name: "Inet", url: "https://www.inet.se" },
                { name: "Elgiganten", url: "https://www.elgiganten.se" },
                { name: "CDON", url: "https://www.cdon.se" },
                { name: "MediaMarkt", url: "https://www.mediamarkt.se" },
                { name: "NetOnNet", url: "https://www.netonnet.se" }
            ]
        },
        platforms: [
            { name: "Mi Store Sweden", url: "https://www.mi.com/se" },
            { name: "PriceRunner (聚合)", url: "https://www.pricerunner.se" },
            { name: "Komplett", url: "https://www.komplett.se" },
            { name: "Webhallen", url: "https://www.webhallen.com" },
            { name: "Inet", url: "https://www.inet.se" }
        ]
    },
    "丹麦": {
        currency: "DKK",
        currencySymbol: "kr",
        miStoreUrl: "https://www.mi.com/dk",
        aggregator: { name: "PriceRunner DK", url: "https://www.pricerunner.dk",
            sellers: [
                { name: "Komplett.dk", url: "https://www.komplett.dk" },
                { name: "Proshop", url: "https://www.proshop.dk" },
                { name: "Power", url: "https://www.power.dk" },
                { name: "Elgiganten", url: "https://www.elgiganten.dk" },
                { name: "CDON", url: "https://www.cdon.dk" },
                { name: "Dustin", url: "https://www.dustin.dk" }
            ]
        },
        platforms: [
            { name: "Mi Store Denmark", url: "https://www.mi.com/dk" },
            { name: "PriceRunner (聚合)", url: "https://www.pricerunner.dk" },
            { name: "Komplett.dk", url: "https://www.komplett.dk" },
            { name: "Proshop", url: "https://www.proshop.dk" },
            { name: "Power", url: "https://www.power.dk" }
        ]
    },
    "芬兰": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://www.mi.com/fi",
        aggregator: { name: "Hinta.fi", url: "https://hinta.fi",
            sellers: [
                { name: "Verkkokauppa", url: "https://www.verkkokauppa.com" },
                { name: "Gigantti", url: "https://www.gigantti.fi" },
                { name: "Jimms", url: "https://www.jimms.fi" },
                { name: "Power", url: "https://www.power.fi" },
                { name: "DNA Kauppa", url: "https://www.dna.fi" },
                { name: "Dustin", url: "https://www.dustin.fi" }
            ]
        },
        platforms: [
            { name: "Mi Store Finland", url: "https://www.mi.com/fi" },
            { name: "Hinta.fi (聚合)", url: "https://hinta.fi" },
            { name: "Verkkokauppa", url: "https://www.verkkokauppa.com" },
            { name: "Gigantti", url: "https://www.gigantti.fi" },
            { name: "Jimms", url: "https://www.jimms.fi" }
        ]
    },
    "挪威": {
        currency: "NOK",
        currencySymbol: "kr",
        miStoreUrl: "https://www.mi.com/no",
        aggregator: { name: "Prisguiden", url: "https://www.prisguiden.no",
            sellers: [
                { name: "Komplett.no", url: "https://www.komplett.no" },
                { name: "Elkjop", url: "https://www.elkjop.no" },
                { name: "Power", url: "https://www.power.no" },
                { name: "NetOnNet", url: "https://www.netonnet.no" },
                { name: "Dustin", url: "https://www.dustin.no" },
                { name: "Proshop", url: "https://www.proshop.no" }
            ]
        },
        platforms: [
            { name: "Mi Store Norway", url: "https://www.mi.com/no" },
            { name: "Prisguiden (聚合)", url: "https://www.prisguiden.no" },
            { name: "Komplett.no", url: "https://www.komplett.no" },
            { name: "Elkjop", url: "https://www.elkjop.no" },
            { name: "Power", url: "https://www.power.no" }
        ]
    },
    "冰岛": {
        currency: "ISK",
        currencySymbol: "kr",
        miStoreUrl: "https://mi-store.is",
        aggregator: null,
        platforms: [
            { name: "Mi Store Iceland", url: "https://mi-store.is" },
            { name: "Epli", url: "https://www.epli.is" },
            { name: "Tolvulistinn", url: "https://www.tolvulistinn.is" }
        ]
    },
    "希腊": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://www.mi.com/gr",
        aggregator: { name: "Skroutz.gr", url: "https://www.skroutz.gr",
            sellers: [
                { name: "Public", url: "https://www.public.gr" },
                { name: "Kotsovolos", url: "https://www.kotsovolos.gr" },
                { name: "Plaisio", url: "https://www.plaisio.gr" },
                { name: "MediaMarkt", url: "https://www.mediamarkt.gr" },
                { name: "Germanos", url: "https://www.germanos.gr" },
                { name: "You.gr", url: "https://www.you.gr" },
                { name: "e-shop.gr", url: "https://www.e-shop.gr" }
            ]
        },
        platforms: [
            { name: "Mi Store Greece", url: "https://www.mi.com/gr" },
            { name: "Skroutz.gr (聚合)", url: "https://www.skroutz.gr" },
            { name: "Public", url: "https://www.public.gr" },
            { name: "Kotsovolos", url: "https://www.kotsovolos.gr" },
            { name: "Plaisio", url: "https://www.plaisio.gr" }
        ]
    },
    "乌克兰": {
        currency: "UAH",
        currencySymbol: "₴",
        miStoreUrl: "https://mi-store.ua",
        aggregator: { name: "Hotline.ua", url: "https://hotline.ua",
            sellers: [
                { name: "Rozetka", url: "https://rozetka.com.ua" },
                { name: "Allo", url: "https://allo.ua" },
                { name: "Foxtrot", url: "https://foxtrot.com.ua" },
                { name: "Comfy", url: "https://comfy.ua" },
                { name: "Eldorado", url: "https://www.eldorado.ua" },
                { name: "Mi-Store.ua", url: "https://mi-store.ua" },
                { name: "Citrus", url: "https://www.citrus.ua" }
            ]
        },
        platforms: [
            { name: "Mi Store Ukraine", url: "https://mi-store.ua" },
            { name: "Hotline.ua (聚合)", url: "https://hotline.ua" },
            { name: "Rozetka", url: "https://rozetka.com.ua" },
            { name: "Allo", url: "https://allo.ua" },
            { name: "Foxtrot", url: "https://foxtrot.com.ua" }
        ]
    },
    "拉脱维亚": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.lv",
        aggregator: { name: "Salidzini.lv", url: "https://www.salidzini.lv",
            sellers: [
                { name: "1a.lv", url: "https://www.1a.lv" },
                { name: "220.lv", url: "https://www.220.lv" },
                { name: "RD Electronics", url: "https://www.rdveikals.lv" },
                { name: "Euronics", url: "https://www.euronics.lv" },
                { name: "Mi-Store.lv", url: "https://mi-store.lv" }
            ]
        },
        platforms: [
            { name: "Mi Store Latvia", url: "https://mi-store.lv" },
            { name: "Salidzini.lv (聚合)", url: "https://www.salidzini.lv" },
            { name: "1a.lv", url: "https://www.1a.lv" },
            { name: "220.lv", url: "https://www.220.lv" },
            { name: "RD Electronics", url: "https://www.rdveikals.lv" }
        ]
    },
    "立陶宛": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.lt",
        aggregator: { name: "Kainos.lt", url: "https://www.kainos.lt",
            sellers: [
                { name: "Varle.lt", url: "https://www.varle.lt" },
                { name: "Kilobaitas", url: "https://www.kilobaitas.lt" },
                { name: "Topo Centras", url: "https://www.topocentras.lt" },
                { name: "Pigu.lt", url: "https://pigu.lt" },
                { name: "1a.lt", url: "https://www.1a.lt" },
                { name: "Mi-Store.lt", url: "https://mi-store.lt" }
            ]
        },
        platforms: [
            { name: "Mi Store Lithuania", url: "https://mi-store.lt" },
            { name: "Kainos.lt (聚合)", url: "https://www.kainos.lt" },
            { name: "Varle.lt", url: "https://www.varle.lt" },
            { name: "Kilobaitas", url: "https://www.kilobaitas.lt" },
            { name: "Topo Centras", url: "https://www.topocentras.lt" }
        ]
    },
    "爱沙尼亚": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.ee",
        aggregator: { name: "Hinnavaatlus", url: "https://www.hinnavaatlus.ee",
            sellers: [
                { name: "1A.ee", url: "https://www.1a.ee" },
                { name: "Klick", url: "https://www.klick.ee" },
                { name: "Euronics", url: "https://www.euronics.ee" },
                { name: "Photopoint", url: "https://www.photopoint.ee" },
                { name: "Mi-Store.ee", url: "https://mi-store.ee" }
            ]
        },
        platforms: [
            { name: "Mi Store Estonia", url: "https://mi-store.ee" },
            { name: "Hinnavaatlus (聚合)", url: "https://www.hinnavaatlus.ee" },
            { name: "1A.ee", url: "https://www.1a.ee" },
            { name: "Klick", url: "https://www.klick.ee" },
            { name: "Euronics", url: "https://www.euronics.ee" }
        ]
    },
    "摩尔多瓦": {
        currency: "MDL",
        currencySymbol: "L",
        miStoreUrl: "https://mi-store.md",
        aggregator: null,
        platforms: [
            { name: "Mi Store Moldova", url: "https://mi-store.md" },
            { name: "Enter", url: "https://www.enter.online" },
            { name: "Darwin", url: "https://darwin.md" }
        ]
    },
    "保加利亚": {
        currency: "BGN",
        currencySymbol: "лв",
        miStoreUrl: "https://mi-store.bg",
        aggregator: { name: "Pazaruvaj.com", url: "https://www.pazaruvaj.com",
            sellers: [
                { name: "Ozone.bg", url: "https://www.ozone.bg" },
                { name: "Technopolis", url: "https://www.technopolis.bg" },
                { name: "Technomarket", url: "https://www.technomarket.bg" },
                { name: "eMAG.bg", url: "https://www.emag.bg" },
                { name: "Mi-Store.bg", url: "https://mi-store.bg" },
                { name: "Ardes.bg", url: "https://www.ardes.bg" }
            ]
        },
        platforms: [
            { name: "Mi Store Bulgaria", url: "https://mi-store.bg" },
            { name: "Pazaruvaj.com (聚合)", url: "https://www.pazaruvaj.com" },
            { name: "Ozone.bg", url: "https://www.ozone.bg" },
            { name: "Technopolis", url: "https://www.technopolis.bg" },
            { name: "Technomarket", url: "https://www.technomarket.bg" }
        ]
    },
    "马耳他": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.mt",
        aggregator: null,
        platforms: [
            { name: "Mi Store Malta", url: "https://mi-store.mt" },
            { name: "Scan Malta", url: "https://www.scanmalta.com" },
            { name: "Intercomp", url: "https://www.intercomp.com.mt" }
        ]
    },
    "塞浦路斯": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.cy",
        aggregator: null,
        platforms: [
            { name: "Mi Store Cyprus", url: "https://mi-store.cy" },
            { name: "Public Cyprus", url: "https://www.public.com.cy" },
            { name: "Stephanis", url: "https://www.stephanis.com.cy" }
        ]
    },
    "奥兰": {
        currency: "EUR",
        currencySymbol: "€",
        miStoreUrl: "https://mi-store.ax",
        aggregator: null,
        platforms: [
            { name: "Mi Store Aland", url: "https://mi-store.ax" }
        ]
    },
    "南斯拉夫": {
        currency: "YUN",
        currencySymbol: "din",
        miStoreUrl: "https://mi-store.yu",
        aggregator: null,
        platforms: [
            { name: "Mi Store Yugoslavia", url: "https://mi-store.yu" }
        ]
    }
};

// 生成完整的模拟数据
function generateMockData() {
    const mockData = {};
    
    Object.entries(countryData).forEach(([country, info]) => {
        // 计算小米官网价格（作为基准）
        const miStoreProducts = productList.map(productName => {
            const basePrice = estimateBasePrice(productName);
            let countryMultiplier = 1;
            if (info.currency === "PLN") countryMultiplier = 4.3;
            else if (info.currency === "RON") countryMultiplier = 4.9;
            else if (info.currency === "CZK") countryMultiplier = 25;
            else if (info.currency === "HUF") countryMultiplier = 380;
            else if (info.currency === "RSD") countryMultiplier = 110;
            else if (info.currency === "MKD") countryMultiplier = 61;
            else if (info.currency === "ALL") countryMultiplier = 108;
            else if (info.currency === "BAM") countryMultiplier = 1.95;
            else if (info.currency === "SEK") countryMultiplier = 11;
            else if (info.currency === "DKK") countryMultiplier = 7.4;
            else if (info.currency === "NOK") countryMultiplier = 11;
            else if (info.currency === "ISK") countryMultiplier = 140;
            else if (info.currency === "UAH") countryMultiplier = 41;
            else if (info.currency === "MDL") countryMultiplier = 19;
            else if (info.currency === "BGN") countryMultiplier = 1.95;
            
            const miStorePrice = Math.round(basePrice * countryMultiplier);
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            
            return {
                id: productId,
                name: productName,
                miStorePrice: miStorePrice,
                miStoreUrl: `${info.miStoreUrl}/product/${productId}`
            };
        });
        
        // 为每个平台生成价格数据
        const platforms = info.platforms.map(platform => {
            const products = miStoreProducts.map(miProduct => {
                // 第三方平台价格通常比官网低5-15%
                const discount = platform.name.includes("Mi Store") ? 0 : (0.05 + Math.random() * 0.10);
                const price = Math.round(miProduct.miStorePrice * (1 - discount));
                
                return {
                    id: miProduct.id,
                    name: miProduct.name,
                    price: price,
                    miStorePrice: miProduct.miStorePrice,
                    miStoreUrl: miProduct.miStoreUrl,
                    productUrl: generateProductUrl(miProduct.name, platform.url)
                };
            });
            
            return {
                name: platform.name,
                url: platform.url,
                products: products
            };
        });
        
        // 为聚合网站生成子商家价格数据
        let aggregatorSellers = null;
        if (info.aggregator && info.aggregator.sellers) {
            aggregatorSellers = info.aggregator.sellers.map(seller => {
                const products = miStoreProducts.map(miProduct => {
                    // 各商家价格在官网价基础上浮动 -3% ~ -18%
                    const discount = 0.03 + Math.random() * 0.15;
                    const price = Math.round(miProduct.miStorePrice * (1 - discount));
                    return {
                        id: miProduct.id,
                        name: miProduct.name,
                        price: price,
                        productUrl: generateProductUrl(miProduct.name, seller.url)
                    };
                });
                return {
                    name: seller.name,
                    url: seller.url,
                    products: products
                };
            });
        }
        
        mockData[country] = {
            currency: info.currency,
            currencySymbol: info.currencySymbol,
            miStoreUrl: info.miStoreUrl,
            platforms: platforms,
            aggregatorSellers: aggregatorSellers
        };
    });
    
    return mockData;
}

// 生成完整的mockData
const mockData = generateMockData();

// 全局状态
let currentCountry = null;
let currentProduct = null;
let priceChart = null;

// DOM元素
const countrySelect = document.getElementById('countrySelect');
const productSelect = document.getElementById('productSelect');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const summaryCards = document.getElementById('summaryCards');
const priceTableBody = document.getElementById('priceTableBody');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const updateTime = document.getElementById('updateTime');
const exportCSV = document.getElementById('exportCSV');
const exportJSON = document.getElementById('exportJSON');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initCountrySelect();
    setupEventListeners();
    updateTimestamp();
});

// 初始化国家选择器
function initCountrySelect() {
    const countries = Object.keys(mockData);
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = `${country} (${mockData[country].currency})`;
        countrySelect.appendChild(option);
    });
}

// 设置事件监听器
function setupEventListeners() {
    countrySelect.addEventListener('change', handleCountryChange);
    productSelect.addEventListener('change', handleProductChange);
    searchBtn.addEventListener('click', handleSearch);
    exportCSV.addEventListener('click', handleExportCSV);
    exportJSON.addEventListener('click', handleExportJSON);
}

// 处理国家选择变化
function handleCountryChange() {
    const country = countrySelect.value;
    currentCountry = country;
    currentProduct = null;
    
    // 清空产品选择器
    productSelect.innerHTML = '<option value="">-- 请选择产品 --</option>';
    
    if (country) {
        // 获取该国家所有平台的所有产品ID
        const countryInfo = mockData[country];
        const productIds = new Set();
        
        countryInfo.platforms.forEach(platform => {
            platform.products.forEach(product => {
                productIds.add(product.id);
            });
        });
        
        // 添加产品选项（使用产品列表顺序）
        productList.forEach(productName => {
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            if (productIds.has(productId)) {
                const option = document.createElement('option');
                option.value = productId;
                option.textContent = productName;
                productSelect.appendChild(option);
            }
        });
        
        productSelect.disabled = false;
        searchBtn.disabled = true;
    } else {
        productSelect.disabled = true;
        searchBtn.disabled = true;
    }
    
    // 隐藏结果区域
    resultsSection.style.display = 'none';
    errorMessage.style.display = 'none';
}

// 处理产品选择变化
function handleProductChange() {
    currentProduct = productSelect.value;
    searchBtn.disabled = !currentProduct;
}

// 处理搜索
function handleSearch() {
    if (!currentCountry || !currentProduct) {
        showError('请选择国家和产品');
        return;
    }
    
    showLoading(true);
    hideError();
    
    // 模拟API调用延迟
    setTimeout(() => {
        try {
            const priceData = getPriceData(currentCountry, currentProduct);
            renderResults(priceData);
            showLoading(false);
        } catch (error) {
            showLoading(false);
            showError(error.message);
        }
    }, 800);
}

// 获取价格数据
function getPriceData(country, productId) {
    const countryInfo = mockData[country];
    if (!countryInfo) {
        throw new Error('未找到该国家的数据');
    }
    
    const prices = [];
    let miStorePrice = null;
    let miStoreUrl = null;
    let productName = '';
    
    countryInfo.platforms.forEach(platform => {
        const product = platform.products.find(p => p.id === productId);
        if (product) {
            prices.push({
                platform: platform.name,
                platformUrl: platform.url,
                price: product.price,
                miStorePrice: product.miStorePrice,
                productName: product.name,
                productUrl: product.productUrl
            });
            
            if (!miStorePrice) {
                miStorePrice = product.miStorePrice;
                miStoreUrl = product.miStoreUrl;
                productName = product.name;
            }
        }
    });
    
    // 获取聚合网站子商家价格
    let aggregatorSellerPrices = null;
    if (countryInfo.aggregatorSellers) {
        aggregatorSellerPrices = countryInfo.aggregatorSellers.map(seller => {
            const product = seller.products.find(p => p.id === productId);
            return {
                sellerName: seller.name,
                sellerUrl: seller.url,
                price: product ? product.price : null,
                productUrl: product ? product.productUrl : seller.url
            };
        }).filter(s => s.price !== null).sort((a, b) => a.price - b.price);
    }
    
    if (prices.length === 0) {
        throw new Error('未找到该产品的价格数据');
    }
    
    // 计算统计数据
    const priceValues = prices.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const avgPrice = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    const minPlatform = prices.find(p => p.price === minPrice).platform;
    const maxPlatform = prices.find(p => p.price === maxPrice).platform;
    
    return {
        country,
        currency: countryInfo.currency,
        currencySymbol: countryInfo.currencySymbol,
        productId,
        productName,
        miStorePrice,
        miStoreUrl,
        miStoreName: countryInfo.miStoreUrl,
        prices,
        aggregatorSellerPrices,
        stats: {
            minPrice,
            maxPrice,
            avgPrice,
            minPlatform,
            maxPlatform,
            priceRange: maxPrice - minPrice,
            savings: miStorePrice - minPrice,
            savingsPercentage: ((miStorePrice - minPrice) / miStorePrice * 100).toFixed(2)
        }
    };
}

// 渲染结果
function renderResults(priceData) {
    // 更新摘要卡片
    renderSummaryCards(priceData);
    
    // 更新图表
    renderChart(priceData);
    
    // 更新表格
    renderTable(priceData);
    
    // 渲染聚合网站商家价格列表
    renderAggregatorSellers(priceData);
    
    // 显示结果区域
    resultsSection.style.display = 'block';
    
    // 存储当前数据用于导出
    window.currentPriceData = priceData;
}

// 渲染摘要卡片
function renderSummaryCards(priceData) {
    const { stats, currencySymbol, miStorePrice, miStoreName } = priceData;
    
    summaryCards.innerHTML = `
        <div class="summary-card">
            <div class="label">小米官网价</div>
            <div class="value">${currencySymbol}${miStorePrice.toFixed(2)}</div>
            <div class="label"><a href="${miStoreName}" target="_blank" style="color: #FF6900;">访问官网</a></div>
        </div>
        <div class="summary-card">
            <div class="label">最低价格</div>
            <div class="value highlight">${currencySymbol}${stats.minPrice.toFixed(2)}</div>
            <div class="label">${stats.minPlatform}</div>
        </div>
        <div class="summary-card">
            <div class="label">最高价格</div>
            <div class="value">${currencySymbol}${stats.maxPrice.toFixed(2)}</div>
            <div class="label">${stats.maxPlatform}</div>
        </div>
        <div class="summary-card">
            <div class="label">最大节省</div>
            <div class="value ${stats.savings > 0 ? 'positive' : 'negative'}">${currencySymbol}${stats.savings.toFixed(2)}</div>
            <div class="label">比官网省 ${stats.savingsPercentage}%</div>
        </div>
    `;
}

// 渲染图表
function renderChart(priceData) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // 如果已有图表，先销毁
    if (priceChart) {
        priceChart.destroy();
    }
    
    const labels = priceData.prices.map(p => p.platform);
    const prices = priceData.prices.map(p => p.price);
    const miStorePrices = priceData.prices.map(() => priceData.miStorePrice);
    
    // 根据价格设置颜色
    const backgroundColors = prices.map(price => {
        if (price < priceData.miStorePrice) {
            return 'rgba(76, 175, 80, 0.8)'; // 绿色 - 比官网便宜
        } else if (price > priceData.miStorePrice) {
            return 'rgba(244, 67, 54, 0.8)'; // 红色 - 比官网贵
        } else {
            return 'rgba(255, 105, 0, 0.8)'; // 橙色 - 与官网相同
        }
    });
    
    priceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '平台价格',
                    data: prices,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1
                },
                {
                    label: '小米官网价',
                    data: miStorePrices,
                    type: 'line',
                    borderColor: 'rgba(255, 105, 0, 1)',
                    backgroundColor: 'rgba(255, 105, 0, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointBackgroundColor: 'rgba(255, 105, 0, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${priceData.productName} - ${priceData.country}价格对比`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            return `${label}: ${priceData.currencySymbol}${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return priceData.currencySymbol + value;
                        }
                    },
                    title: {
                        display: true,
                        text: `价格 (${priceData.currency})`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '电商平台'
                    }
                }
            }
        }
    });
}

// 渲染表格
function renderTable(priceData) {
    const { prices, miStorePrice, currencySymbol, country, aggregatorSellerPrices } = priceData;
    
    priceTableBody.innerHTML = '';
    
    const countryInfo = countryData[country];
    const aggregator = countryInfo?.aggregator;
    
    // 排序：比价聚合网站在前，然后按价格排序
    const sortedPrices = [...prices].sort((a, b) => {
        const aIsAggregator = a.platform.includes('(聚合)');
        const bIsAggregator = b.platform.includes('(聚合)');
        if (aIsAggregator && !bIsAggregator) return -1;
        if (!aIsAggregator && bIsAggregator) return 1;
        return a.price - b.price;
    });
    
    sortedPrices.forEach(item => {
        const difference = item.price - miStorePrice;
        const discount = ((miStorePrice - item.price) / miStorePrice * 100).toFixed(2);
        const isAggregator = item.platform.includes('(聚合)');
        
        let differenceClass = '';
        if (difference < 0) differenceClass = 'positive';
        else if (difference > 0) differenceClass = 'negative';
        
        let discountClass = '';
        if (discount > 10) discountClass = 'good';
        else if (discount > 0) discountClass = 'normal';
        else discountClass = 'bad';
        
        const rowClass = isAggregator ? 'aggregator-row' : '';
        const platformBadge = isAggregator ? '<span class="aggregator-badge">聚合</span>' : '';
        const expandBtn = (isAggregator && aggregatorSellerPrices && aggregatorSellerPrices.length > 0) 
            ? '<button class="expand-sellers-btn" onclick="toggleSellerPanel(this)" title="展开商家价格列表">▶ 展开商家报价</button>' 
            : '';
        
        const row = document.createElement('tr');
        row.className = rowClass;
        row.innerHTML = `
            <td><strong>${item.platform}</strong> ${platformBadge} ${expandBtn}</td>
            <td>${item.productName}</td>
            <td class="price">${currencySymbol}${item.price.toFixed(2)}</td>
            <td class="price official">${currencySymbol}${miStorePrice.toFixed(2)}</td>
            <td class="difference ${differenceClass}">
                ${difference > 0 ? '+' : ''}${currencySymbol}${difference.toFixed(2)}
            </td>
            <td class="discount ${discountClass}">
                ${discount > 0 ? '-' : '+'}${Math.abs(discount)}%
            </td>
            <td>
                <a href="${item.productUrl}" target="_blank" class="link-btn ${isAggregator ? 'link-btn-aggregator' : ''}">
                    ${isAggregator ? '查看比价' : '查看详情'}
                </a>
            </td>
        `;
        
        priceTableBody.appendChild(row);
        
        // 聚合行后面插入可展开的商家子表
        if (isAggregator && aggregatorSellerPrices && aggregatorSellerPrices.length > 0) {
            const sellerRow = document.createElement('tr');
            sellerRow.className = 'seller-panel-row';
            sellerRow.style.display = 'none';
            
            let sellerTableHtml = `
                <td colspan="7">
                    <div class="seller-panel">
                        <div class="seller-panel-header">
                            <span class="seller-panel-icon">🏪</span>
                            <span class="seller-panel-title">${aggregator.name} 各商家报价 (${aggregatorSellerPrices.length} 家)</span>
                            <span class="seller-panel-subtitle">价格从低到高排列 · 数据来源于聚合比价平台</span>
                        </div>
                        <div class="seller-table-wrapper">
                            <table class="seller-table">
                                <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>商家名称</th>
                                        <th>商家报价</th>
                                        <th>vs 官网价</th>
                                        <th>折扣率</th>
                                        <th>链接</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            
            aggregatorSellerPrices.forEach((seller, index) => {
                const sDiff = seller.price - miStorePrice;
                const sDiscount = ((miStorePrice - seller.price) / miStorePrice * 100).toFixed(1);
                const sDiffClass = sDiff < 0 ? 'positive' : (sDiff > 0 ? 'negative' : '');
                const sDiscClass = sDiscount > 10 ? 'good' : (sDiscount > 0 ? 'normal' : 'bad');
                const rankClass = index === 0 ? 'rank-best' : (index <= 2 ? 'rank-top3' : '');
                const rankIcon = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : (index + 1)));
                
                sellerTableHtml += `
                                    <tr class="${rankClass}">
                                        <td class="seller-rank">${rankIcon}</td>
                                        <td class="seller-name">
                                            <a href="${seller.sellerUrl}" target="_blank">${seller.sellerName}</a>
                                        </td>
                                        <td class="price seller-price">${currencySymbol}${seller.price.toFixed(2)}</td>
                                        <td class="difference ${sDiffClass}">
                                            ${sDiff > 0 ? '+' : ''}${currencySymbol}${sDiff.toFixed(2)}
                                        </td>
                                        <td class="discount ${sDiscClass}">-${Math.abs(sDiscount)}%</td>
                                        <td>
                                            <a href="${seller.productUrl}" target="_blank" class="link-btn seller-link-btn">前往</a>
                                        </td>
                                    </tr>`;
            });
            
            // 底部统计行
            const sellerPrices = aggregatorSellerPrices.map(s => s.price);
            const sMin = Math.min(...sellerPrices);
            const sMax = Math.max(...sellerPrices);
            const sAvg = (sellerPrices.reduce((a, b) => a + b, 0) / sellerPrices.length);
            const sPriceDiff = sMax - sMin;
            
            sellerTableHtml += `
                                </tbody>
                            </table>
                        </div>
                        <div class="seller-panel-footer">
                            <div class="seller-stat">
                                <span class="seller-stat-label">最低价</span>
                                <span class="seller-stat-value positive">${currencySymbol}${sMin.toFixed(2)}</span>
                            </div>
                            <div class="seller-stat">
                                <span class="seller-stat-label">最高价</span>
                                <span class="seller-stat-value">${currencySymbol}${sMax.toFixed(2)}</span>
                            </div>
                            <div class="seller-stat">
                                <span class="seller-stat-label">均价</span>
                                <span class="seller-stat-value">${currencySymbol}${sAvg.toFixed(2)}</span>
                            </div>
                            <div class="seller-stat">
                                <span class="seller-stat-label">价差</span>
                                <span class="seller-stat-value highlight">${currencySymbol}${sPriceDiff.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </td>`;
            
            sellerRow.innerHTML = sellerTableHtml;
            priceTableBody.appendChild(sellerRow);
        }
    });
    
    // 底部聚合说明
    if (aggregator) {
        const infoRow = document.createElement('tr');
        infoRow.className = 'aggregator-info';
        infoRow.innerHTML = `
            <td colspan="7">
                <div class="aggregator-notice">
                    <strong>💡 提示：</strong> 标记为"聚合"的平台是比价网站，汇集了该国多个商家的价格信息。
                    点击"▶ 展开商家报价"可在表格内查看各商家价格对比。
                    推荐访问 <a href="${aggregator.url}" target="_blank">${aggregator.name}</a> 获取最新比价信息。
                </div>
            </td>
        `;
        priceTableBody.appendChild(infoRow);
    }
}

// 展开/收起商家价格面板
function toggleSellerPanel(btn) {
    const mainRow = btn.closest('tr');
    const sellerRow = mainRow.nextElementSibling;
    
    if (sellerRow && sellerRow.classList.contains('seller-panel-row')) {
        const isHidden = sellerRow.style.display === 'none';
        sellerRow.style.display = isHidden ? 'table-row' : 'none';
        btn.textContent = isHidden ? '▼ 收起商家报价' : '▶ 展开商家报价';
        btn.classList.toggle('expanded', isHidden);
    }
}

// 渲染聚合网站商家价格列表
function renderAggregatorSellers(priceData) {
    const { aggregatorSellerPrices, miStorePrice, currencySymbol, country } = priceData;
    const countryInfo = countryData[country];
    const aggregator = countryInfo?.aggregator;
    
    let container = document.getElementById('aggregatorSellersSection');
    if (!container) {
        container = document.createElement('div');
        container.id = 'aggregatorSellersSection';
        const exportSection = document.querySelector('.export-section');
        if (exportSection) {
            exportSection.parentNode.insertBefore(container, exportSection);
        } else {
            document.querySelector('.results-section')?.appendChild(container);
        }
    }
    
    if (!aggregatorSellerPrices || aggregatorSellerPrices.length === 0 || !aggregator) {
        container.innerHTML = '';
        return;
    }
    
    const sellerCount = aggregatorSellerPrices.length;
    const sellerMin = aggregatorSellerPrices[0];
    const sellerMax = aggregatorSellerPrices[sellerCount - 1];
    const sellerAvg = aggregatorSellerPrices.reduce((s, p) => s + p.price, 0) / sellerCount;
    
    let tableRowsHtml = '';
    aggregatorSellerPrices.forEach((seller, index) => {
        const diff = seller.price - miStorePrice;
        const discount = ((miStorePrice - seller.price) / miStorePrice * 100).toFixed(1);
        const isLowest = index === 0;
        const isHighest = index === sellerCount - 1;
        
        let priceTag = '';
        if (isLowest) priceTag = ' <span class="seller-tag seller-tag-lowest">最低价</span>';
        else if (isHighest) priceTag = ' <span class="seller-tag seller-tag-highest">最高价</span>';
        
        const barWidth = miStorePrice > 0 ? Math.min(100, (seller.price / miStorePrice) * 100) : 50;
        const barColor = seller.price <= miStorePrice ? '#4CAF50' : '#F44336';
        
        tableRowsHtml += `
                        <tr class="${isLowest ? 'seller-row-best' : ''}">
                            <td class="col-rank"><span class="seller-rank-cell">${index + 1}</span></td>
                            <td class="col-name"><div class="seller-name-cell"><span class="seller-name-text">${seller.sellerName}</span>${priceTag}</div></td>
                            <td class="col-bar"><div class="seller-bar-wrap"><div class="seller-bar-fill" style="width:${barWidth}%;background:${barColor};"></div></div></td>
                            <td class="col-price"><span class="seller-price-text">${currencySymbol}${seller.price.toFixed(2)}</span></td>
                            <td class="col-diff"><span class="seller-diff-text ${diff < 0 ? 'positive' : diff > 0 ? 'negative' : ''}">${diff < 0 ? '\u2193' : diff > 0 ? '\u2191' : '='}${Math.abs(discount)}%</span></td>
                            <td class="col-action"><a href="${seller.productUrl}" target="_blank" class="seller-link">前往</a></td>
                        </tr>`;
    });
    
    container.innerHTML = `
        <div class="aggregator-sellers-panel">
            <div class="aggregator-sellers-header" onclick="toggleAggregatorPanel()">
                <div class="aggregator-sellers-title">
                    <span class="aggregator-icon">🏪</span>
                    <h3>${aggregator.name} — 各商家报价明细</h3>
                    <span class="aggregator-count">${sellerCount} 家商家</span>
                </div>
                <div class="aggregator-sellers-summary">
                    <span class="summary-item">
                        <span class="summary-label">最低</span>
                        <span class="summary-value positive">${currencySymbol}${sellerMin.price.toFixed(2)}</span>
                        <span class="summary-seller">${sellerMin.sellerName}</span>
                    </span>
                    <span class="summary-divider">|</span>
                    <span class="summary-item">
                        <span class="summary-label">均价</span>
                        <span class="summary-value">${currencySymbol}${sellerAvg.toFixed(2)}</span>
                    </span>
                    <span class="summary-divider">|</span>
                    <span class="summary-item">
                        <span class="summary-label">最高</span>
                        <span class="summary-value negative">${currencySymbol}${sellerMax.price.toFixed(2)}</span>
                        <span class="summary-seller">${sellerMax.sellerName}</span>
                    </span>
                </div>
                <span class="aggregator-toggle" id="aggregatorToggle">▼ 展开详情</span>
            </div>
            <div class="aggregator-sellers-body" id="aggregatorSellersBody" style="display: none;">
                <div class="sellers-legend">
                    <span>价格条相对于小米官网价 (${currencySymbol}${miStorePrice.toFixed(2)}) 的比率</span>
                    <span>
                        <span class="legend-dot" style="background:#4CAF50;"></span> 低于官网价
                        <span class="legend-dot" style="background:#F44336;"></span> 高于官网价
                    </span>
                </div>
                <table class="seller-table">
                    <thead>
                        <tr>
                            <th class="col-rank">#</th>
                            <th class="col-name">商家</th>
                            <th class="col-bar">价格条</th>
                            <th class="col-price">报价</th>
                            <th class="col-diff">vs官网</th>
                            <th class="col-action">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
                <div class="sellers-footer">
                    <a href="${generateProductUrl(priceData.productName, aggregator.url)}" target="_blank" class="sellers-footer-link">
                        🔗 在 ${aggregator.name} 上查看完整报价 →
                    </a>
                    <span class="sellers-footer-note">以上为模拟数据，实际价格以 ${aggregator.name} 网站为准</span>
                </div>
            </div>
        </div>
    `;
}


// 切换聚合面板展开/收起
function toggleAggregatorPanel() {
    const body = document.getElementById('aggregatorSellersBody');
    const toggle = document.getElementById('aggregatorToggle');
    if (body && body.style.display === 'none') {
        body.style.display = 'block';
        toggle.textContent = '▲ 收起详情';
    } else if (body) {
        body.style.display = 'none';
        toggle.textContent = '▼ 展开详情';
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (show) {
        resultsSection.style.display = 'none';
    }
}

// 显示错误信息
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

// 隐藏错误信息
function hideError() {
    errorMessage.style.display = 'none';
}

// 更新时间戳
function updateTimestamp() {
    const now = new Date();
    updateTime.textContent = now.toLocaleString('zh-CN');
}

// 导出CSV
function handleExportCSV() {
    if (!window.currentPriceData) {
        showError('没有可导出的数据');
        return;
    }
    
    const priceData = window.currentPriceData;
    const headers = ['电商平台', '产品名称', '当前价格', '小米官网价', '价格差异', '折扣率', '平台链接', '详情链接'];
    
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += headers.join(',') + '\n';
    
    priceData.prices.forEach(item => {
        const difference = item.price - priceData.miStorePrice;
        const discount = ((priceData.miStorePrice - item.price) / priceData.miStorePrice * 100).toFixed(2);
        
        const row = [
            `"${item.platform}"`,
            `"${item.productName}"`,
            item.price.toFixed(2),
            priceData.miStorePrice.toFixed(2),
            difference.toFixed(2),
            `${discount}%`,
            `"${item.platformUrl}"`,
            `"${item.productUrl}"`
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    // 导出聚合网站子商家数据
    if (priceData.aggregatorSellerPrices && priceData.aggregatorSellerPrices.length > 0) {
        csvContent += '\n';
        csvContent += '"--- 聚合网站商家报价明细 ---"\n';
        csvContent += ['商家名称', '价格', '小米官网价', '价格差异', '折扣率', '商家链接'].join(',') + '\n';
        priceData.aggregatorSellerPrices.forEach(seller => {
            const diff = seller.price - priceData.miStorePrice;
            const disc = ((priceData.miStorePrice - seller.price) / priceData.miStorePrice * 100).toFixed(2);
            csvContent += [
                `"${seller.sellerName}"`,
                seller.price.toFixed(2),
                priceData.miStorePrice.toFixed(2),
                diff.toFixed(2),
                `${disc}%`,
                `"${seller.productUrl}"`
            ].join(',') + '\n';
        });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `小米产品比价_${priceData.country}_${priceData.productName}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

// 导出JSON
function handleExportJSON() {
    if (!window.currentPriceData) {
        showError('没有可导出的数据');
        return;
    }
    
    const priceData = window.currentPriceData;
    const exportData = {
        exportTime: new Date().toISOString(),
        country: priceData.country,
        currency: priceData.currency,
        product: {
            id: priceData.productId,
            name: priceData.productName,
            miStorePrice: priceData.miStorePrice,
            miStoreUrl: priceData.miStoreUrl
        },
        priceComparison: priceData.prices.map(item => ({
            platform: item.platform,
            platformUrl: item.platformUrl,
            productUrl: item.productUrl,
            price: item.price,
            difference: item.price - priceData.miStorePrice,
            discountPercentage: ((priceData.miStorePrice - item.price) / priceData.miStorePrice * 100).toFixed(2)
        })),
        aggregatorSellers: priceData.aggregatorSellerPrices ? priceData.aggregatorSellerPrices.map(s => ({
            seller: s.sellerName,
            sellerUrl: s.sellerUrl,
            price: s.price,
            productUrl: s.productUrl,
            difference: s.price - priceData.miStorePrice,
            discountPercentage: ((priceData.miStorePrice - s.price) / priceData.miStorePrice * 100).toFixed(2)
        })) : null,
        statistics: priceData.stats
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `小米产品比价_${priceData.country}_${priceData.productName}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}
