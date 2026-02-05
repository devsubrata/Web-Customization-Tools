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
