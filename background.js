importScripts("libs/pdf-lib.min.js");
const { PDFDocument } = PDFLib;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "capture") {
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, (dataUrl) => {
            sendResponse(dataUrl);
        });
        return true;
    }

    if (msg.action === "captureQR") {
        // Send message to content script in the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, { action: "startSelection", mode: msg.mode });
        });
        sendResponse("Message forwarded to content script");
    }

    if (msg.action === "openTab") chrome.tabs.create({ url: msg.url });

    return true; // keep channel open for async sendResponse
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "capture-ocr") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return;

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "startSelection",
                mode: "OCR",
            });
        });
    }
    if (command === "capture-img") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return;

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "startSelection",
                mode: "IMAGE",
            });
        });
    }
});

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === "mergePDFs") {
        if (!message.urls || message.urls.length === 0) {
            console.log("No PDFs found.");
            return;
        }

        try {
            const mergedPdf = await PDFDocument.create();

            for (const url of message.urls) {
                const response = await fetch(url);
                const bytes = await response.arrayBuffer();

                const pdf = await PDFDocument.load(bytes);

                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

                pages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();

            // ✅ SAFE BASE64 CONVERSION
            const base64String = arrayBufferToBase64(mergedBytes);

            chrome.downloads.download({
                url: "data:application/pdf;base64," + base64String,
                filename: message.filename,
                conflictAction: "uniquify",
            });
        } catch (err) {
            console.error("Merge failed:", err);
        }
    }
});
// Popup → trigger
// Content → collect URLs
// Background → fetch PDFs
// Background → merge using pdf-lib
// Background → convert to Base64 safely
// Background → download
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // prevent stack overflow

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
}
