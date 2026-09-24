(() => {
    const STORAGE_KEY = "top-zanosi-language";
    const SUPPORTED_LANGUAGES = new Set(["ru", "en"]);

    const exactTranslations = new Map([
        ["Навигация", "Navigation"],
        ["Проекты", "Projects"],
        ["Проекты из выпусков", "Projects from our videos"],
        ["Площадки, которые встречаются в наших выпусках.", "Platforms featured in our videos."],
        ["Другие проекты", "Other projects"],
        ["18+. Азартные игры связаны с финансовым риском.", "18+. Gambling involves financial risk."],
        ["Условия и лимиты", "Terms and limits"],
        ["Закрыть", "Close"],
        ["Самый популярный", "Most popular"],
        ["Бонус", "Bonus"],
        ["Мин. депозит", "Min. deposit"],
        ["Мин. вывод", "Min. withdrawal"],
        ["Мин. сумма вывода", "Min. withdrawal amount"],
        ["Промокод", "Promo code"],
        ["Копировать", "Copy"],
        ["Скопировано", "Copied"],
        ["Выплаты", "Payouts"],
        ["Скорость выплат", "Payout speed"],
        ["Лимит вывода", "Withdrawal limit"],
        ["Лимит на вывод средств", "Withdrawal limit"],
        ["Перейти", "Visit"],
        ["Валюта счета", "Account currency"],
        ["Способы пополнения", "Deposit methods"],
        ["Способы вывода", "Withdrawal methods"],
        ["Не указан", "Not specified"],
        ["Без ограничений", "No limits"]
    ]);

    const phraseReplacements = [
        [/\+\s*до\s+(\d+)\s+FS/gi, "+ up to $1 FS"],
        [/на депозит/gi, "on deposit"],
        [/(\d+(?:-\d+)?)\s+часов?/gi, "$1 hours"]
    ];

    const staticText = {
        ru: {
            title: "TOP ZANOSI - Проекты из выпусков",
            description: "Проекты из выпусков TOP ZANOSI.",
            languageLabel: "Выбор языка"
        },
        en: {
            title: "TOP ZANOSI - Projects from our videos",
            description: "Projects featured in TOP ZANOSI videos.",
            languageLabel: "Language selection"
        }
    };

    /*
     * English financial data is intentionally stored separately from the RU data.
     * It is based on USD/international cashier conditions, not a RUB exchange-rate conversion.
     * Where a casino does not publish a fixed USD threshold, the UI says that the value varies
     * instead of inventing a number.
     */
    const englishTerms = {
        "01": {
            "Мин. депозит": "$5+ (varies by method and region)",
            "Мин. сумма вывода": "Varies by payment method",
            "Валюта счета": "USD, EUR, CAD, BRL, crypto and other regional currencies",
            "Лимит на вывод средств": "Varies by payment method and account",
            "Способы пополнения": "Visa, Mastercard, GPay, Apple Pay, Bitcoin, Tether, Skrill, Payeer, MuchBetter, bank transfer",
            "Способы вывода": "Visa, Mastercard, e-wallets and other methods available in the user's region",
            "Скорость выплат": "Usually under 1 hour; up to 12 hours depending on method"
        },
        "02": {
            "Мин. депозит": "From $1 equivalent (crypto; varies by method)",
            "Мин. сумма вывода": "From $5 equivalent (crypto; varies by method)",
            "Валюта счета": "USD, EUR, BTC, USDT and other available currencies",
            "Лимит на вывод средств": "Varies by payment method and account",
            "Способы пополнения": "Cards, e-wallets, crypto and available local payment methods",
            "Способы вывода": "Available methods depend on account, currency and region",
            "Скорость выплат": "24–72 hours"
        },
        "11": {
            "Мин. депозит": "$5",
            "Мин. сумма вывода": "$5",
            "Валюта счета": "USD, EUR, AUD, CAD, JPY, NOK, SEK, TRY, INR, KRW, AZN, KZT and others",
            "Лимит на вывод средств": "$100,000 per month",
            "Способы пополнения": "Cards, e-wallets, bank transfer and crypto",
            "Способы вывода": "Skrill, Neteller, crypto, cards and bank transfer",
            "Скорость выплат": "0–24 hours for e-wallets/crypto; cards may take 4–5 business days"
        },
        "03": {
            "Мин. депозит": "About $1 equivalent (cashier availability varies)",
            "Мин. сумма вывода": "About $10 equivalent (cashier availability varies)",
            "Валюта счета": "USD equivalent; available cashier currencies depend on region",
            "Лимит на вывод средств": "Not publicly fixed; individual limits may apply",
            "Способы пополнения": "Methods shown in the cashier depend on region and account",
            "Способы вывода": "Methods shown in the cashier depend on region and account",
            "Скорость выплат": "0–72 hours"
        },
        "04": {
            "Мин. депозит": "From $5",
            "Мин. сумма вывода": "From $10",
            "Валюта счета": "USD, EUR, AUD, CAD, PLN, UAH, KZT, UZS, AZN, KGS and others",
            "Лимит на вывод средств": "From $3,000 per day; higher limits depend on loyalty level",
            "Способы пополнения": "Visa, Mastercard, bank transfer, e-wallets, Bitcoin, USDT, ETH, LTC, TRX, TON and other crypto",
            "Способы вывода": "Cards, bank transfer, supported e-wallets and crypto",
            "Скорость выплат": "Usually under 1 hour; up to 48 business hours depending on method"
        },
        "05": {
            "Мин. депозит": "$10 equivalent",
            "Мин. сумма вывода": "$10 equivalent",
            "Валюта счета": "USD, EUR, PLN, UAH, AZN, KZT, KGS, UZS and other supported currencies",
            "Лимит на вывод средств": "Depends on VIP status; higher tiers may have no fixed maximum",
            "Способы пополнения": "Visa, Mastercard and supported cryptocurrencies",
            "Способы вывода": "Visa, Mastercard and supported cryptocurrencies",
            "Скорость выплат": "0–72 hours depending on method"
        },
        "06": {
            "Мин. депозит": "From $1 equivalent via USDT; $15 for the welcome bonus",
            "Мин. сумма вывода": "From $5 equivalent via USDT",
            "Валюта счета": "USD / USDT availability depends on cashier and region",
            "Лимит на вывод средств": "Varies by payment method and account status",
            "Способы пополнения": "Visa, Mastercard, USDT, BTC, ETH and available local methods",
            "Способы вывода": "USDT, crypto and available local methods",
            "Скорость выплат": "Usually minutes for crypto; up to 72 hours depending on method"
        },
        "07": {
            "Мин. депозит": "$5",
            "Мин. сумма вывода": "$10",
            "Валюта счета": "USD equivalent and supported crypto currencies",
            "Лимит на вывод средств": "$1,500/day, $3,000/week, $15,000/month at the base tier; individual limits may apply",
            "Способы пополнения": "Cards, e-wallets and crypto",
            "Способы вывода": "Cards, e-wallets and crypto",
            "Скорость выплат": "Usually within 60 minutes; timing may vary by method"
        },
        "08": {
            "Мин. депозит": "From $10",
            "Мин. сумма вывода": "$10",
            "Валюта счета": "USD and supported cryptocurrencies",
            "Лимит на вывод средств": "$1,500/day, $3,000/week, $15,000/month at the base tier; up to $50,000/month at higher tiers",
            "Способы пополнения": "Bank methods, USDT, BTC, TRX and other available methods",
            "Способы вывода": "Bank methods, USDT, BTC, TRX and other available methods",
            "Скорость выплат": "Fiat up to 60 minutes; crypto usually up to 10 minutes"
        },
        "09": {
            "Мин. депозит": "From $5 equivalent / 5 USDT",
            "Мин. сумма вывода": "$10",
            "Валюта счета": "USD, USDT, USDC, BTC, ETH, LTC, BNB and other supported crypto",
            "Лимит на вывод средств": "$1,500/day, $3,000/week, $15,000/month at the base tier; up to $50,000/month at higher tiers",
            "Способы пополнения": "Visa, Mastercard and supported cryptocurrencies",
            "Способы вывода": "Visa, Mastercard and supported cryptocurrencies",
            "Скорость выплат": "Usually 0–24 hours for crypto/e-wallets; cards may take up to 48 hours"
        },
        "10": {
            "Мин. депозит": "$5",
            "Мин. сумма вывода": "$5",
            "Валюта счета": "USD, USDT, EUR, AUD, CAD, JPY, NOK, SEK, TRY, INR, KRW, BTC, ETH, LTC, USDC, TON and others",
            "Лимит на вывод средств": "$5,000 per day / $100,000 per month",
            "Способы пополнения": "Cards, crypto wallets, e-wallets and bank transfer",
            "Способы вывода": "Cards, crypto wallets, e-wallets and bank transfer",
            "Скорость выплат": "0–24 hours for crypto/e-wallets; cards may take 4–5 business days"
        }
    };

    const originalProjectTerms = typeof projectsData !== "undefined" && Array.isArray(projectsData)
        ? new Map(projectsData.map((project) => [
            project.id,
            project.terms.map((term) => ({ ...term }))
        ]))
        : new Map();

    let currentLanguage = getInitialLanguage();
    let mutationQueued = false;
    let observer = null;

    function getInitialLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (SUPPORTED_LANGUAGES.has(saved)) {
                return saved;
            }
        } catch (_) {}

        const browserLanguage = String(
            (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || "ru"
        ).toLowerCase();

        return browserLanguage.startsWith("en") ? "en" : "ru";
    }

    function applyProjectTerms() {
        if (typeof projectsData === "undefined" || !Array.isArray(projectsData)) return;

        projectsData.forEach((project) => {
            const originalTerms = originalProjectTerms.get(project.id);
            if (!originalTerms) return;

            const overrides = currentLanguage === "en" ? (englishTerms[project.id] || {}) : {};
            project.terms = originalTerms.map((term) => ({
                ...term,
                value: Object.prototype.hasOwnProperty.call(overrides, term.label)
                    ? overrides[term.label]
                    : term.value
            }));
        });

        if (typeof renderFeaturedProject === "function" && typeof featuredProject !== "undefined") {
            renderFeaturedProject(featuredProject);
        }
        if (typeof renderSecondaryProjects === "function" && typeof secondaryProjects !== "undefined") {
            renderSecondaryProjects(secondaryProjects);
        }
    }

    function rememberOriginalText(node) {
        if (!Object.prototype.hasOwnProperty.call(node, "__topZanosiOriginalText")) {
            node.__topZanosiOriginalText = node.nodeValue;
        }
    }

    function translateText(text) {
        const trimmed = text.trim();
        if (!trimmed) return text;

        const leading = text.match(/^\s*/)?.[0] || "";
        const trailing = text.match(/\s*$/)?.[0] || "";

        if (exactTranslations.has(trimmed)) {
            return `${leading}${exactTranslations.get(trimmed)}${trailing}`;
        }

        let translated = trimmed;
        for (const [pattern, replacement] of phraseReplacements) {
            translated = translated.replace(pattern, replacement);
        }

        if (translated.startsWith("Условия и лимиты — ")) {
            translated = translated.replace("Условия и лимиты — ", "Terms and limits — ");
        }

        return `${leading}${translated}${trailing}`;
    }

    function processTextNode(node) {
        rememberOriginalText(node);
        node.nodeValue = currentLanguage === "en"
            ? translateText(node.__topZanosiOriginalText)
            : node.__topZanosiOriginalText;
    }

    function processTree(root = document.body) {
        if (!root) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(processTextNode);
    }

    function updateAttributes() {
        document.documentElement.lang = currentLanguage;
        document.title = staticText[currentLanguage].title;

        const description = document.querySelector('meta[name="description"]');
        if (description) description.setAttribute("content", staticText[currentLanguage].description);

        const nav = document.querySelector("nav");
        if (nav) nav.setAttribute("aria-label", currentLanguage === "en" ? "Navigation" : "Навигация");

        const closeButton = document.getElementById("terms-close");
        if (closeButton) closeButton.setAttribute("aria-label", currentLanguage === "en" ? "Close" : "Закрыть");

        document.querySelectorAll('[data-copy-text][aria-label]').forEach((button) => {
            if (!button.__topZanosiOriginalAriaLabel) {
                button.__topZanosiOriginalAriaLabel = button.getAttribute("aria-label");
            }
            const original = button.__topZanosiOriginalAriaLabel || "";
            button.setAttribute(
                "aria-label",
                currentLanguage === "en"
                    ? original.replace(/^Копировать промокод\s*/i, "Copy promo code ")
                    : original
            );
        });
    }

    function ensureLanguageSwitch() {
        if (document.getElementById("language-switch")) return;

        const headerActions = document.querySelector(".header-actions");
        if (!headerActions) return;

        if (!document.getElementById("language-switch-styles")) {
            const style = document.createElement("style");
            style.id = "language-switch-styles";
            style.textContent = `
                .language-switch {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    padding: 3px;
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 999px;
                    background: rgba(255,255,255,.04);
                }
                .language-switch button {
                    min-width: 38px;
                    height: 34px;
                    padding: 0 10px;
                    border: 0;
                    border-radius: 999px;
                    cursor: pointer;
                    background: transparent;
                    color: #9ca4b5;
                    font-size: 12px;
                    font-weight: 800;
                    line-height: 1;
                    transition: background .18s ease, color .18s ease;
                }
                .language-switch button:hover,
                .language-switch button:focus-visible {
                    color: #fff;
                    outline: none;
                }
                .language-switch button.active {
                    background: #ffb703;
                    color: #161107;
                }
                @media (max-width: 520px) {
                    .language-switch { order: -1; }
                }
            `;
            document.head.appendChild(style);
        }

        const switcher = document.createElement("div");
        switcher.className = "language-switch";
        switcher.id = "language-switch";
        switcher.setAttribute("role", "group");
        switcher.innerHTML = `
            <button type="button" data-language="ru">RU</button>
            <button type="button" data-language="en">EN</button>
        `;
        headerActions.prepend(switcher);

        switcher.addEventListener("click", (event) => {
            const button = event.target.closest("[data-language]");
            if (!button) return;
            setLanguage(button.getAttribute("data-language"));
        });
    }

    function updateLanguageSwitch() {
        const switcher = document.getElementById("language-switch");
        if (!switcher) return;

        switcher.setAttribute("aria-label", staticText[currentLanguage].languageLabel);
        switcher.querySelectorAll("[data-language]").forEach((button) => {
            const active = button.getAttribute("data-language") === currentLanguage;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function applyLanguage() {
        if (observer) observer.disconnect();
        applyProjectTerms();
        processTree(document.body);
        updateAttributes();
        updateLanguageSwitch();
        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    function setLanguage(language) {
        if (!SUPPORTED_LANGUAGES.has(language)) return;
        currentLanguage = language;

        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (_) {}

        if (typeof closeTerms === "function" && typeof termsModal !== "undefined" && termsModal.classList.contains("active")) {
            closeTerms();
        }

        applyLanguage();
    }

    ensureLanguageSwitch();
    applyLanguage();

    observer = new MutationObserver((mutations) => {
        const hasRelevantMutation = mutations.some((mutation) =>
            Array.from(mutation.addedNodes).some((node) =>
                node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE
            )
        );

        if (!hasRelevantMutation || mutationQueued) return;
        mutationQueued = true;

        requestAnimationFrame(() => {
            mutationQueued = false;
            if (observer) observer.disconnect();
            processTree(document.body);
            updateAttributes();
            if (observer) observer.observe(document.body, { childList: true, subtree: true });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
