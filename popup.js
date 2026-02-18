document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup loaded");

    const button = document.getElementById("setTitleIconBtn");
    const input = document.getElementById("titleInput");
    const selector = document.getElementById("faviconSelector");
    const container = document.getElementById("symbols");

    if (!button || !input || !selector || !container) {
        console.error("Popup elements missing — check popup.html structure!");
        return;
    }

    // --- Change Title & Favicon ---
    function sendTitleAndIcon() {
        const relativePath = selector.value;
        const fullIconURL = chrome.runtime.getURL(relativePath);
        const newTitle = input.value.trim();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (icon, title) => {
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement("link");
                        link.rel = "icon";
                        document.head.appendChild(link);
                    }
                    link.href = icon;
                    if (title) document.title = title;
                },
                args: [fullIconURL, newTitle],
            });
        });
    }

    button.addEventListener("click", sendTitleAndIcon);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendTitleAndIcon();
    });

    // --- Populate Symbols ---
    const symbols = [
        "✔️",
        "✅",
        "☑️",
        "➡️",
        "⬅️",
        "⬆️",
        "⬇️",
        "🟩",
        "🟥",
        "🟦",
        "✿",
        "❀",
        "✷",
        "𖤐",
        "𖤓",
        "✩",
        "✦",
        "—",
        "➜",
        "➔",
        "➨",
        "➜",
        "▶",
        "⇒",
        "⟹",
        "★",
        "🔹",
        "🔶",
        "⭐",
        "❌",
        "🪰",
        "🪳",
        "🕷️",
        "🦋",
        "🦉",
        "🐧",
        "🏵️",
        "🪲",
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "⓿",
        "❶",
        "❷",
        "❸",
        "❹",
        "❺",
        "❻",
        "❼",
        "❽",
        "❾",
        "❿",
        "⓫",
        "⓬",
        "⓭",
        "⓮",
        "⓯",
        "⓰",
        "⓱",
        "⓲",
        "⓳",
        "⓴",
    ];
    container.innerHTML = "";
    symbols.forEach((symbol) => {
        const span = document.createElement("span");
        span.className = "symbol";
        span.textContent = symbol;
        span.title = "Click to copy";

        span.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(symbol);
                span.classList.add("copied");
                span.textContent = "🗸";
                setTimeout(() => {
                    span.classList.remove("copied");
                    span.textContent = symbol;
                }, 600);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        });

        container.appendChild(span);
    });

    const bgColors = [
        "#7e9a9a",
        "#8b8681",
        "#696468",
        "#f6d8ac",
        "#2a6592",
        "#8ec3eb",
        "#b5e9e9",
        "#5c5174",
        "#66669a",
        "#aaa7cc",
        "#926d88",
        "#be9fbf",
        "#1F1B24",
        "#24191d",
        "#332940",
        "#702917",
        "#121212",
        "#00172D",
        "#20343D",
        "#BB86FC",
        "#3C0466",
        "#00498D",
        "#03DAC5",
        "#ffa500",
        "#dcb909",
        "#cbd902",
        "#84cc16",
        "#b7fa00",
        "#00ff00",
        "#256A2C",
        "#009c1a",
        "#365314",
        "#134e4a",
        "#00faaf",
        "#12c1ed",
        "#00ffff",
        "#ff0000",
        "#fe3b00",
        "#f43f5e",
        "#ff0066",
        "#9f1239",
        "#4B0001",
        "#B163FF",
        "#ffff00",
        "#964B00",
        "#BE5103",
        "#050372",
        "#0000ff",
        "#0047ab",
        "#2B0057",
        "#51158C",
        "#7F00FF",
        "#6601ff",
        "#cb00cc",
        "#ff00ff",
        "#cc00ff",
        "#ffffff",
        "#000000",
    ];
    const colorContainer = document.getElementById("backgroundDiv");

    colorContainer.innerHTML = "";

    bgColors.forEach((color) => {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.background = color;
        colorBox.title = "Set background color";
        colorBox.onclick = () => {
            if (document.getElementById("checkOnlyCopy")?.checked) {
                navigator.clipboard.writeText(color);
            } else {
                setBackground(color);
            }
        };

        colorContainer.appendChild(colorBox);
    });

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#ff0000"; // default color
    colorInput.classList.add("color-input");
    colorInput.title = "Set background color";
    colorInput.addEventListener("input", (e) => setBackground(e.target.value));
    colorContainer.appendChild(colorInput);

    const onlyCopyColorCode = document.createElement("input");
    onlyCopyColorCode.type = "checkbox";
    onlyCopyColorCode.id = "checkOnlyCopy";
    onlyCopyColorCode.title = "Copy only color code";
    onlyCopyColorCode.checked = true;
    colorContainer.appendChild(onlyCopyColorCode);

    function setBackground(color) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (color) => {
                    document.body.style.background = color;
                },
                args: [color],
            });
        });
    }
    function deleteColorsBackgroundDiv() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    document.getElementById("colors-background-div")?.remove();
                },
            });
        });
    }
    function deleteElementFromDom(selector) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (selector) => {
                    document.querySelectorAll(selector).forEach((elm) => elm?.remove());
                },
                args: [selector],
            });
        });
    }
    function setStyle(selector, styleObj) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (selector, styleObj) => {
                    document.querySelectorAll(selector).forEach((el) => {
                        for (let prop in styleObj) {
                            el.style[prop] = styleObj[prop];
                        }
                    });
                },
                args: [selector, styleObj],
            });
        });
    }

    function grapSelector() {
        const selector = document.getElementById("grabElm").value.trim();
        if (document.getElementById("attributeCheck")?.checked) return `[${selector}]`;
        else return selector;
    }

    document.getElementById("delColorDiv").onclick = deleteColorsBackgroundDiv;

    document.getElementById("delElement").onclick = () => {
        const selector = grapSelector();
        if (selector) deleteElementFromDom(selector);
    };

    document.getElementById("setStyle").onclick = () => {
        // Predefined style objects
        const styles = {
            "a-txt-none": { textDecoration: "none" },
            diplayNone: { display: "none" },
            OpenSansFont: { fontFamily: "Open sans" },
            highlight: { backgroundColor: "yellow", color: "black" },
            fade: { opacity: "0.4" },
            border: { border: "2px solid red" },
        };
        const styleSelect = document.getElementById("styleSelect");
        const selector = grapSelector();
        const styleKey = styleSelect.value;

        if (!selector || !styleKey) {
            alert("Provide a selector and select a style.");
            return;
        }

        const styleObj = styles[styleKey];
        if (!styleObj) return;
        setStyle(selector, styleObj);
    };
    document.getElementById("clrInput").onclick = clr;

    function clr() {
        document.getElementById("titleInput").value = "";
        document.getElementById("grabElm").value = "";
    }

    document.getElementById("scanQRcode").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "captureQR", mode: "QR" }, (response) => {
            console.log("Background replied:", response);
        });
        document.body.style.display = "none";
    });
    document.getElementById("captureText").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "captureQR", mode: "OCR" });
        document.body.style.display = "none";
    });
    document.getElementById("captureImage").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "captureQR", mode: "IMAGE" });
        document.body.style.display = "none";
    });
});
