function makeDraggable(el, calcNew = true) {
    let isDragging = false;
    let offsetX, offsetY;

    let titleBar = el.querySelector(".title") || el;
    titleBar.style.cursor = "grab";

    titleBar.addEventListener("mousedown", (e) => {
        if (e.target !== titleBar) return;
        if (e.target.classList.contains("resizer")) return;

        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        document.body.style.userSelect = "none";
        titleBar.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        // Calculate new position with bounds
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        if (calcNew) [newLeft, newTop] = preventOffscreen(newLeft, newTop);

        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = "";
        titleBar.style.cursor = "grab";
    });

    function preventOffscreen(newLeft, newTop) {
        newLeft = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, newTop));
        return [newLeft, newTop];
    }
}
function joinSelectedLines(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Nothing selected → do nothing
    if (start === end) return;

    const value = textarea.value;

    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);

    // Normalize line breaks and collapse into single spaces
    const joined = selected
        .replace(/\r?\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    textarea.value = before + joined + after;

    // Restore selection around modified text
    textarea.selectionStart = start;
    textarea.selectionEnd = start + joined.length;

    textarea.focus();
}
