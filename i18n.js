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
        ["Без ограничений", "No limits"],
        ["Мир", "Mir"],
        ["СБП", "SBP"],
        ["Криптовалюта", "Cryptocurrency"],
        ["Сбербанк", "Sberbank"],
        ["Т-Банк", "T-Bank"],
        ["Банк ВТБ", "VTB Bank"],
        ["Альфа-Банк", "Alfa-Bank"],
        ["Газпромбанк", "Gazprombank"],
        ["Совкомбанк", "Sovcombank"],
        ["Озон Банк", "Ozon Bank"],
        ["Яндекс Банк", "Yandex Bank"],
        ["ПСБ банк", "PSB Bank"],
        ["Билайн", "Beeline"],
        ["Наличные", "Cash"],
        ["Через баланс мобильных телефонов", "Mobile phone balance"],
        ["p2p-платежи", "P2P payments"]
    ]);

    const phraseReplacements = [
        [/\+\s*до\s+(\d+)\s+FS/gi, "+ up to $1 FS"],
        [/на депозит/gi, "on deposit"],
        [/Без ограничений/gi, "No limits"],
        [/Через баланс мобильных телефонов/gi, "Mobile phone balance"],
        [/p2p-платежи/gi, "P2P payments"],
        [/Криптовалюта/gi, "Cryptocurrency"],
        [/Банк ВТБ/gi, "VTB Bank"],
        [/Альфа-Банк/gi, "Alfa-Bank"],
        [/Газпромбанк/gi, "Gazprombank"],
        [/Совкомбанк/gi, "Sovcombank"],
        [/Озон Банк/gi, "Ozon Bank"],
        [/Яндекс Банк/gi, "Yandex Bank"],
        [/ПСБ банк/gi, "PSB Bank"],
        [/Сбербанк/gi, "Sberbank"],
        [/Т-Банк/gi, "T-Bank"],
        [/Билайн/gi, "Beeline"],
        [/Наличные/gi, "Cash"],
        [/\bСБП\b/g, "SBP"],
        [/\bМир\b/g, "Mir"],
        [/(\d[\d\s]*)\s+в день/gi, "$1 per day"],
        [/(\d[\d\s]*)\s+в месяц/gi, "$1 per month"],
        [/(\d+(?:-\d+)?)\s+часов?/gi, "$1 hours"]
    ];

    const staticText = {
        ru: {
            title: "TOP ZANOSI - Проекты из выпусков",
            description: "Проекты из выпусков TOP ZANOSI.",
            languageLabel: "Выбор языка",
            copyPromo: "Копировать промокод"
        },
        en: {
            title: "TOP ZANOSI - Projects from our videos",
            description: "Projects featured in TOP ZANOSI videos.",
            languageLabel: "Language selection",
            copyPromo: "Copy promo code"
        }
    };

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

    function rememberOriginalText(node) {
        if (!Object.prototype.hasOwnProperty.call(node, "__topZanosiOriginalText")) {
            node.__topZanosiOriginalText = node.nodeValue;
        }
    }

    function translateText(text) {
        const trimmed = text.trim();
        if (!trimmed) {
            return text;
        }

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
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        nodes.forEach(processTextNode);
    }

    function updateAttributes() {
        document.documentElement.lang = currentLanguage;
        document.title = staticText[currentLanguage].title;

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute("content", staticText[currentLanguage].description);
        }

        const nav = document.querySelector("nav");
        if (nav) {
            nav.setAttribute("aria-label", currentLanguage === "en" ? "Navigation" : "Навигация");
        }

        const closeButton = document.getElementById("terms-close");
        if (closeButton) {
            closeButton.setAttribute("aria-label", currentLanguage === "en" ? "Close" : "Закрыть");
        }

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
            applyLanguage();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
