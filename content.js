chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "collectPDFs") {
        const pdfUrls = [...document.querySelectorAll(".bbcle-download-extension-pdf")].map((el) => el.href);
        const titleEl = document.querySelectorAll('h3[dir="ltr"]')[1];

        let prefix;
        const filePart = pdfUrls[0]?.split("/").pop();

        if (filePart.includes("6_minute_english") || filePart.includes("6min_english")) prefix = filePart.split("_").slice(0, 4).join("_");
        else if (filePart.includes("tews")) prefix = filePart.split("_").slice(0, 2).join("_");
        else if (filePart.includes("REE")) {
            prefix = [filePart.split("_").slice(0, 1), "RealEasyEnglish"].join("_");
        } else prefix = filePart.split("_").slice(0, 1).join("_");

        const name = `${prefix} ➜ ${titleEl.textContent.trim()}.pdf`;
        const filename = name.replace(/[\\\/:*?"<>|]/g, "");

        chrome.runtime.sendMessage({
            action: "mergePDFs",
            urls: pdfUrls,
            filename,
        });
    }
});

// Popup → trigger
// Content → collect URLs
// Background → fetch PDFs
// Background → merge using pdf-lib
// Background → convert to Base64 safely
// Background → download
