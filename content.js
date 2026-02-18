// ================= content.js =================

let overlay, box;
let startX, startY;
let mode = "QR";

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "startSelection") {
        mode = msg.mode;
        createSelector();
    }
});

function createSelector() {
    overlay = document.createElement("div");
    overlay.id = "qr-selector-overlay";

    box = document.createElement("div");
    box.id = "qr-selector-box";

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.addEventListener("mousedown", startDraw);
    overlay.addEventListener("mousemove", draw);
    overlay.addEventListener("mouseup", endDraw);
}

function startDraw(e) {
    startX = e.clientX;
    startY = e.clientY;

    box.style.left = startX + "px";
    box.style.top = startY + "px";
}

function draw(e) {
    if (!startX) return;

    const width = e.clientX - startX;
    const height = e.clientY - startY;

    box.style.width = Math.abs(width) + "px";
    box.style.height = Math.abs(height) + "px";
    box.style.left = (width < 0 ? e.clientX : startX) + "px";
    box.style.top = (height < 0 ? e.clientY : startY) + "px";
}

function endDraw() {
    const rect = box.getBoundingClientRect();
    overlay.remove();
    startX = null;
    // captureArea(rect);

    // Wait for DOM to repaint
    requestAnimationFrame(() => {
        captureArea(rect);
    });
    // setTimeout(() => {
    //     captureArea(rect);
    // }, 0);
}

async function captureArea(rect) {
    const screenshot = await chrome.runtime.sendMessage({ action: "capture" });

    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
        const scale = window.devicePixelRatio;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        ctx.drawImage(img, rect.left * scale, rect.top * scale, rect.width * scale, rect.height * scale, 0, 0, canvas.width, canvas.height);

        if (mode === "QR") scanQR(canvas);
        else if (mode === "OCR") scanOCR(canvas);
        else if (mode === "IMAGE") displayImage(canvas);
    };
}

function scanQR(canvas) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code) {
        showModal("No QR Code Found", null);
        return;
    }

    const text = code.data;

    if (isValidURL(text)) {
        showModal(text, text);
    } else {
        showModal(text, null);
    }
}

function showModal(text, url) {
    const searchEngines = {
        "AI Review": "https://www.google.com/search?q={search_term}&udm=50",
        "Google search": "https://www.google.com/search?q={search_term}",
        "Oxford dictionary": "https://www.oxfordlearnersdictionaries.com/definition/english/{search_term}",
        Wikipedia: "https://en.wikipedia.org/wiki/{search_term}",
        "Image search": "https://www.google.com/search?tbm=isch&q={search_term}",
    };
    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "qr-modal-overlay";

    // Modal container
    const modal = document.createElement("div");
    modal.id = "qr-modal";

    // Toolbar container
    const toolbar = document.createElement("div");
    toolbar.className = "qr-modal-toolbar title";

    // Open Link button (if URL exists)
    if (url) {
        const btn = document.createElement("button");
        btn.textContent = "Open Link";
        btn.className = "qr-btn-primary";
        btn.onclick = () => {
            chrome.runtime.sendMessage({ action: "openTab", url });
            overlay.remove();
        };
        toolbar.appendChild(btn);
    }

    // Web Search select
    const searchSelect = document.createElement("select");
    for (const key in searchEngines) {
        const option = document.createElement("option");
        option.value = searchEngines[key];
        option.textContent = key;
        searchSelect.appendChild(option);
    }
    // Search button
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "🔍";
    searchBtn.className = "qr-btn-transparent";
    searchBtn.onclick = () => {
        const selectedUrl = searchSelect.value;
        const query = encodeURIComponent(editor.value.trim());
        const finalUrl = selectedUrl.replace("{search_term}", query);
        chrome.runtime.sendMessage({ action: "openTab", url: finalUrl });
    };
    toolbar.appendChild(searchSelect);
    toolbar.appendChild(searchBtn);

    const joinLinesBtn = document.createElement("button");
    joinLinesBtn.textContent = "JoinLines";
    joinLinesBtn.className = "qr-btn-secondary";
    joinLinesBtn.title = "Convert selected lines into a paragraph";
    joinLinesBtn.onclick = () => joinSelectedLines(editor);
    toolbar.appendChild(joinLinesBtn);

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.className = "qr-btn-secondary";
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(editor.value);
    };
    toolbar.appendChild(copyBtn);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "❌";
    closeBtn.className = "qr-btn-secondary";
    closeBtn.onclick = () => overlay.remove();
    toolbar.appendChild(closeBtn);

    // Textarea editor
    const editor = document.createElement("textarea");
    editor.value = text;
    editor.id = "qr-modal-editor";
    editor.rows = 10;
    editor.cols = 40;

    // Assemble modal
    modal.appendChild(toolbar);
    modal.appendChild(editor);
    makeDraggable(modal, false);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Optional: focus editor for immediate typing
    editor.focus();
}

// function joinSelectedLines(textarea) {
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;

//     // Nothing selected → do nothing
//     if (start === end) return;

//     const value = textarea.value;

//     const before = value.slice(0, start);
//     const selected = value.slice(start, end);
//     const after = value.slice(end);

//     // Normalize line breaks and collapse into single spaces
//     const joined = selected
//         .replace(/\r?\n+/g, " ")
//         .replace(/\s+/g, " ")
//         .trim();

//     textarea.value = before + joined + after;

//     // Restore selection around modified text
//     textarea.selectionStart = start;
//     textarea.selectionEnd = start + joined.length;

//     textarea.focus();
// }

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

async function scanOCR(canvas) {
    // Convert canvas to image blob or data URL
    const dataUrl = canvas.toDataURL("image/png");

    // Run OCR
    const {
        data: { text },
    } = await Tesseract.recognize(dataUrl, "eng");

    const extractedText = text.trim();

    if (!extractedText) {
        showModal("No text found", null);
        return;
    }

    // Check if it's a URL
    if (isValidURL(extractedText)) {
        showModal(extractedText, extractedText); // click navigates
    } else {
        showModal(extractedText, null); // just display text
    }
}

function displayImage(canvas) {
    const overlay = document.createElement("div");
    overlay.id = "qr-modal-overlay";

    const modal = document.createElement("div");
    modal.id = "qr-modal";

    // ---------- IMAGE ----------
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";

    // ---------- Toolbar ----------
    const toolbar = document.createElement("div");
    toolbar.className = "qr-modal-toolbar title";

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Image";
    saveBtn.className = "qr-btn-primary";

    saveBtn.onclick = () => {
        const link = document.createElement("a");
        link.download = "captured-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    // Copy to clipboard button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Image";
    copyBtn.className = "qr-btn-secondary";

    copyBtn.onclick = async () => {
        canvas.toBlob(async (blob) => {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        });
    };

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "qr-btn-secondary";
    closeBtn.onclick = () => overlay.remove();

    toolbar.appendChild(saveBtn);
    toolbar.appendChild(copyBtn);
    toolbar.appendChild(closeBtn);

    // Assemble modal
    modal.appendChild(toolbar);
    modal.appendChild(img);
    makeDraggable(modal, false);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}
