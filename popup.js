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

    // <select id="faviconSelector">
    const favicons = [
        "./icons/Butterfly.32.png",
        "./icons/Frog.32.png",
        "./icons/Hamster.32.png",
        "./icons/Owl.32.png",
        "./icons/Penguin.32.png",
        "./icons/Piranha-Fish.32.png",
        "./icons/Tiger.32.png",
        "./icons/Wolf.32.png",
    ];

    // --- Change Title & Favicon ---
    function sendTitleAndIcon() {
        let relativePath = selector.value;
        if (relativePath === "") relativePath = favicons[Math.floor(Math.random() * favicons.length)];

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

    function scrollWindow(direction) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (direction) => {
                    if (direction === "down") {
                        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
                    } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                },
                args: [direction],
            });
        });
    }
    document.getElementById("scrollDown").onclick = () => scrollWindow("down");
    document.getElementById("scrollUP").onclick = () => scrollWindow("up");
    document.querySelector(".scroll-div .goup").onclick = () => scrollWindow("up");
    document.querySelector(".scroll-div .godown").onclick = () => scrollWindow("down");

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
        "⬜",
        "⬛",
        "🟨",
        "🟪",
        "🟧",
        "🟫",
        "🧊",
        "🔴",
        "🟠",
        "🟡",
        "🟢",
        "🔵",
        "🟣",
        "⚫",
        "🩸",
        "❄️",
        "✿",
        "❀",
        "🌸",
        "🌷",
        "💐",
        "🌹",
        "🌺",
        "🌼",
        "🪻",
        "🌻",
        "✷",
        "𖤐",
        "𖤓",
        "⚛︎",
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
        "🔷",
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

    let isCopyColorCode = localStorage.getItem("isCopyColorCode") === "true";

    bgColors.forEach((color) => {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.background = color;
        colorBox.title = "Set background color";
        colorBox.onclick = () => {
            if (isCopyColorCode) {
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
    onlyCopyColorCode.checked = isCopyColorCode;
    colorContainer.appendChild(onlyCopyColorCode);

    onlyCopyColorCode.addEventListener("change", () => {
        isCopyColorCode = onlyCopyColorCode.checked;
        localStorage.setItem("isCopyColorCode", isCopyColorCode);
    });

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

    document.getElementById("downloadBBCmp3").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const link = document.querySelector("a.bbcle-download-extension-mp3");
                const titleEl = document.querySelectorAll('h3[dir="ltr"]')[1];

                if (!link || !titleEl) return null;

                return {
                    mp3Url: link.href,
                    title: titleEl.textContent.trim(),
                };
            },
        });

        const data = results[0].result;

        if (!data) {
            alert("MP3 or title not found.");
            return;
        }

        const { mp3Url, title } = data;

        let prefix;
        // Extract prefix like "250428_tews"
        const filePart = mp3Url.split("/").pop();
        if (filePart.includes("6_minute_english")) prefix = filePart.split("_").slice(0, 4).join("_");
        else if (filePart.includes("REE")) {
            prefix = [filePart.split("_").slice(0, 1), "RealEasyEnglish"].join("_");
        } else prefix = filePart.split("_").slice(0, 2).join("_");

        // Clean title for filename
        const cleanTitle = title
            .replace(/[^\w\s]/g, "") // remove apostrophes etc.
            .replace(/\s+/g, " ");

        const newFilename = `${prefix} ➜ ${cleanTitle}.mp3`;

        chrome.downloads.download({
            url: mp3Url,
            filename: newFilename,
        });
    };
    document.getElementById("downloadBBCimage").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const meta = document.querySelector('meta[property="og:image"]');
                return meta ? meta.content : null;
            },
        });
        const imageUrl = results[0].result;
        if (!imageUrl) {
            console.log("No og:image found");
            return;
        }
        // Fetch from extension context (bypasses CORS if host_permissions are set)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Convert to ImageBitmap
        const bitmap = await createImageBitmap(blob);

        // Draw on canvas
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);

        // Convert to PNG blob
        const pngBlob = await canvas.convertToBlob({ type: "image/png" });

        // Copy PNG to clipboard
        await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
        showModal();
    };

    document.getElementById("downloadPdfs").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        chrome.tabs.sendMessage(tab.id, {
            action: "collectPDFs",
        });
    });
    // Popup → trigger
    // Content → collect URLs
    // Background → fetch PDFs
    // Background → merge using pdf-lib
    // Background → convert to Base64 safely
    // Background → download
    function showModal() {
        const modal = document.getElementById("successModal");
        modal.classList.remove("hidden");

        setTimeout(() => {
            modal.classList.add("hidden");
        }, 1000);
    }

    document.getElementById("copyWebURL").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await navigator.clipboard.writeText(tab.url);
        alert("Web url copied");
    };
    document.getElementById("copyAudioLink").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const link = document.querySelector("a.bbcle-download-extension-mp3");
                if (!link) return null;
                return link.href;
            },
        });
        const data = results[0].result;
        if (!data) {
            alert("Not found.");
            return;
        }
        await navigator.clipboard.writeText(data);
        alert("Link Copied");
    };
    document.getElementById("copyImgURL").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const meta = document.querySelector('meta[property="og:image"]');
                return meta ? meta.content : null;
            },
        });
        const imageUrl = results[0].result;
        if (!imageUrl) {
            alert("No og:image found");
            return;
        }
        await navigator.clipboard.writeText(imageUrl);
        alert("Link Copied");
    };
    document.getElementById("logResources").onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (webUrl) => {
                const episodeName = document.querySelectorAll('h3[dir="ltr"]')[0].textContent.trim();
                const titleElm = document.querySelectorAll('h3[dir="ltr"]')[1];

                const h3 = document.querySelector(".widget-bbcle-featuresubheader h3");
                const episode = h3.querySelector("b")?.textContent.trim();
                const fullText = h3.textContent.replace(/\s+/g, " ").trim();
                const date = fullText.replace(episode, "").replace("/", "").trim();

                const meta = document.querySelector('meta[property="og:image"]');

                const link = document.querySelector("a.bbcle-download-extension-mp3");

                const pdfUrls = [...document.querySelectorAll(".bbcle-download-extension-pdf")].map((el) => el.href);

                let type = null;
                if (episodeName === "6 Minute English") type = "SME";
                else if (episodeName === "The English We Speak") type = "TEWS";
                else if (episodeName === "Learning English from the News") type = "LEFTN";

                const resources = {
                    type,
                    webUrl: webUrl,
                    episode: `${episode} / ${date}`,
                    title: titleElm.textContent,
                    bgImageLink: meta ? meta.content : null,
                    audioLink: link ? link.href : null,
                    transcripts: pdfUrls.length > 0 ? pdfUrls : null,
                };

                return resources;
            },
            args: [tab.url],
        });
        await navigator.clipboard.writeText(JSON.stringify(results[0].result, null, 4));
        showModal();
    };
});
