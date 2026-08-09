(function () {
    "use strict";

    // ─── DOM refs ──────────────────────────────────────────────
    const overlay = document.getElementById("popupOverlay");
    const card = document.getElementById("popupCard");
    const closeBtn = document.getElementById("popupClose");
    const imgEl = document.getElementById("popupImage");
    const placeholder = document.getElementById("popupImagePlaceholder");
    const titleEl = document.getElementById("popupTitle");
    const descEl = document.getElementById("popupDesc");
    const ctaEl = document.getElementById("popupCta");
    const timerEl = document.getElementById("popupTimer");
    const progressFill = document.getElementById("popupProgressFill");
    const pauseBadge = document.getElementById("popupPauseBadge");

    // ─── CONFIG ────────────────────────────────────────────────
    const AUTO_HIDE_DELAY = 5000; // 5 seconds
    const DATA_URL = "./assets/data/popup-data.json";

    // ─── STATE ──────────────────────────────────────────────────
    let remaining = AUTO_HIDE_DELAY; // remaining time in ms
    let timerInterval = null; // interval for updating progress & timer
    let hideTimeout = null; // timeout to auto-hide
    let isHiding = false;
    let isPaused = false; // true when mouse is over card

    // ─── LOAD DATA ──────────────────────────────────────────────
    async function loadPopupData() {
        try {
            const res = await fetch(DATA_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn("Popup: failed to load data, using fallback.", err);
            return getFallbackData();
        }
    }

    function getFallbackData() {
        return {
            image: "https://placehold.co/600x300/1a1a1a/d4a574?text=Pro+Designity",
            title: 'Let’s <span class="accent">Create</span> Together',
            description: `We build **Shopify stores**, **3D animations**, and **brand stories** that convert. 
                                  Start your project with a **free consultation**.`,
            ctaText: "Start a project",
            ctaLink: "",
        };
    }

    // ─── RENDER ──────────────────────────────────────────────────
    function renderPopup(data) {
        if (data.image && data.image.trim() !== "") {
            imgEl.src = data.image;
            imgEl.style.display = "block";
            placeholder.style.display = "none";
        } else {
            imgEl.style.display = "none";
            placeholder.style.display = "flex";
        }

        titleEl.innerHTML =
            data.title || 'Special <span class="accent">Offer</span>';

        if (data.description) {
            if (typeof marked !== "undefined") {
                descEl.innerHTML = marked.parse(data.description);
            } else {
                let txt = data.description;
                txt = txt.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                txt = txt.replace(/\*(.+?)\*/g, "<em>$1</em>");
                descEl.innerHTML = txt;
            }
        } else {
            descEl.innerHTML =
                "Get <strong>20% off</strong> your first project.";
        }

        ctaEl.textContent = data.ctaText || "Claim now →";
        ctaEl.href = data.ctaLink || "#";
    }

    // ─── TIMER HELPERS ──────────────────────────────────────────

    function updateUI(remainingMs) {
        const seconds = Math.ceil(remainingMs / 1000);
        if (timerEl) timerEl.textContent = Math.max(0, seconds);
        // progress: 100% -> 0%
        const progress = (remainingMs / AUTO_HIDE_DELAY) * 100;
        if (progressFill)
            progressFill.style.width =
                Math.max(0, Math.min(100, progress)) + "%";
    }

    function stopTimerAndTimeout() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    }

    function startTimerAndTimeout(durationMs) {
        // Clear any existing
        stopTimerAndTimeout();

        // Update UI immediately
        remaining = durationMs;
        updateUI(remaining);

        // If remaining <= 0, hide immediately
        if (remaining <= 0) {
            hidePopup();
            return;
        }

        // Start interval every 100ms to update progress and seconds
        const step = 100; // ms
        timerInterval = setInterval(() => {
            remaining -= step;
            if (remaining <= 0) {
                remaining = 0;
                updateUI(remaining);
                // Hide popup
                hidePopup();
                clearInterval(timerInterval);
                timerInterval = null;
                return;
            }
            updateUI(remaining);
        }, step);

        // Set the final timeout to hide after durationMs (as a backup)
        hideTimeout = setTimeout(() => {
            hidePopup();
        }, durationMs);
    }

    // ─── SHOW / HIDE ────────────────────────────────────────────

    function showPopup() {
        isHiding = false;
        isPaused = false;
        pauseBadge.classList.remove("visible");

        overlay.classList.remove("hiding");
        overlay.classList.add("active");

        // Start with full remaining
        remaining = AUTO_HIDE_DELAY;
        startTimerAndTimeout(remaining);
    }

    function hidePopup() {
        if (isHiding) return;
        isHiding = true;
        stopTimerAndTimeout();
        overlay.classList.add("hiding");
        setTimeout(() => {
            overlay.classList.remove("active", "hiding");
            isHiding = false;
        }, 500);
    }

    // ─── PAUSE / RESUME ─────────────────────────────────────────

    function pauseAutoHide() {
        if (isHiding || !overlay.classList.contains("active")) return;
        if (isPaused) return; // already paused
        isPaused = true;

        // Stop timers
        stopTimerAndTimeout();

        // Show pause badge
        pauseBadge.classList.add("visible");

        // The remaining variable already holds the current remaining time
        // (because the interval updates it)
    }

    function resumeAutoHide() {
        if (isHiding || !overlay.classList.contains("active")) return;
        if (!isPaused) return;
        isPaused = false;
        pauseBadge.classList.remove("visible");

        // Restart with the current remaining time
        if (remaining <= 0) {
            hidePopup();
            return;
        }
        startTimerAndTimeout(remaining);
    }

    // ─── INIT ────────────────────────────────────────────────────

    async function initPopup() {
        const data = await loadPopupData();
        renderPopup(data);

        // Show popup after a short delay
        setTimeout(() => {
            showPopup();
        }, 300);

        // ── Events ──

        // Close button
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hidePopup();
        });

        // Click outside overlay
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                hidePopup();
            }
        });

        // ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && overlay.classList.contains("active")) {
                hidePopup();
            }
        });

        // ── HOVER PAUSE ──
        card.addEventListener("mouseenter", () => {
            pauseAutoHide();
        });

        card.addEventListener("mouseleave", () => {
            resumeAutoHide();
        });

        // Also pause when the user is interacting with the card (e.g., clicking CTA)
        // but we already handle mouseenter/mouseleave.
        // Optional: also pause when any interactive element inside gets focus?
        // We'll keep it simple with mouse events.
    }

    // ─── GO ──────────────────────────────────────────────────────

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPopup);
    } else {
        initPopup();
    }
})();
