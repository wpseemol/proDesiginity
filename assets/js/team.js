// ================================================================
// TEAM — load from team.json with avatar images & social links
// ================================================================
(function () {
    "use strict";

    const TEAM_URL = "./assets/data/team.json";

    async function loadTeam() {
        // ✅ Look up grid inside the function (DOM is ready)
        const grid = document.getElementById("team-section");
        if (!grid) {
            console.warn("Team: #team-section not found.");
            return;
        }

        try {
            const res = await fetch(TEAM_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const members = await res.json();

            const cards = members
                .map((member, index) => {
                    // ─── Avatar ─────────────────────────────────
                    const avatarHtml = member.image
                        ? `<img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" class="avatar-img avatar" />`
                        : `<span class="avatar-initials">${escapeHtml(member.avatar)}</span>`;

                    // ─── Social Links ──────────────────────────
                    let socialHtml = "";
                    if (member.social) {
                        const links = [];

                        // Official brand SVG vector paths with exact brand colors
                        const icons = {
                            portfolio: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818590" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
                                <!-- Outer Globe Circle -->
                                <circle cx="12" cy="12" r="10" />
                                
                                <!-- Vertical Center Line -->
                                <line x1="12" y1="2" x2="12" y2="22" />
                                
                                <!-- Latitude Lines -->
                                <line x1="2.5" y1="9" x2="21.5" y2="9" />
                                <line x1="2.5" y1="15" x2="15" y2="15" />
                                
                                <!-- Elliptical Longitude Lines -->
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                
                                <!-- Mouse Pointer -->
                                <path d="M14 14l7 7m-3 0h3v-3m-7-4l3 7 2.5-2.5 3.5 3.5 1.5-1.5-3.5-3.5 2.5-2.5-7-3.5z" fill="#323232" />
                                </svg>`,
                            linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512" fill="#0A66C2" class="svg-icon"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`,
                            github: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 496 512" fill="#c9c4c4" class="svg-icon"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/></svg>`,
                            facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="#1877F2" class="svg-icon"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>`,
                            twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="#000000" class="svg-icon"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4l99.7 131.9L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>`,
                            dribbble: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="#EA4C89" class="svg-icon"><path d="M256 8C119.25 8 8 119.25 8 256s111.25 248 248 248 248-111.25 248-248S392.75 8 256 8zm160.7 130.41a208.26 208.26 0 0 1 45.42 121.36c-27.17-6-68.17-11.83-112.59-3.26-6.3-15.17-13.1-30.22-20.52-45 49.33-24.87 77.29-57.87 87.69-73.1zm-127.3-64a206.88 206.88 0 0 1 103 48.09c-8.87 13.56-34 43.68-80.4 67.24a500.67 500.67 0 0 0-46.54-85.12c8-10.22 16.03-20.21 23.94-30.21zM256 52c-20.89 0-41 3.51-59.78 10a514.86 514.86 0 0 1 46.12 85.34c-53.79 16.32-114 17.58-132.8 17.75A207.24 207.24 0 0 1 256 52zm-155.8 116a495.21 495.21 0 0 0 126.91-16.71 450.48 450.48 0 0 1 18.25 39.81c-62.19 21.08-119.86 63.81-140.23 118a206.83 206.83 0 0 1-4.93-49.1c0-33.8 8-65.7 20-92zm11.7 141a182.16 182.16 0 0 1 129.58-110.3c19.34 38.62 33.74 77.63 43.34 116.78-45 15.34-84.58 43.46-112.18 80.89a206.27 206.27 0 0 1-60.74-87.37zm189.5 151A206.32 206.32 0 0 1 256 460a207.67 207.67 0 0 1-112.82-33.42c23.6-32.92 58.12-58.12 98.42-72 3.63 15.17 6.43 30.55 8.35 46.14 2 16.33 3.05 32.73 3.15 49.28zm25.8-19.4a434.78 434.78 0 0 0-3.3-48.4c-1.89-15.17-4.63-30.13-8.18-44.89 42-8.35 80.88-2.8 105.78 2.68a207.45 207.45 0 0 1-94.3 90.61z"/></svg>`,
                            instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512" fill="#E4405F" class="svg-icon"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`,
                        };

                        if (member.social.portfolio) {
                            links.push(
                                `<a href="${escapeHtml(member.social.portfolio)}" target="_blank" rel="noopener" class="social-link" title="Portfolio">${icons.portfolio}</a>`,
                            );
                        }
                        if (member.social.linkedin) {
                            links.push(
                                `<a href="${escapeHtml(member.social.linkedin)}" target="_blank" rel="noopener" class="social-link" title="LinkedIn">${icons.linkedin}</a>`,
                            );
                        }
                        if (member.social.github) {
                            links.push(
                                `<a href="${escapeHtml(member.social.github)}" target="_blank" rel="noopener" class="social-link" title="GitHub">${icons.github}</a>`,
                            );
                        }
                        if (member.social.facebook) {
                            links.push(
                                `<a href="${escapeHtml(member.social.facebook)}" target="_blank" rel="noopener" class="social-link" title="Facebook">${icons.facebook}</a>`,
                            );
                        }
                        if (member.social.twitter) {
                            links.push(
                                `<a href="${escapeHtml(member.social.twitter)}" target="_blank" rel="noopener" class="social-link" title="Twitter">${icons.twitter}</a>`,
                            );
                        }
                        if (member.social.dribbble) {
                            links.push(
                                `<a href="${escapeHtml(member.social.dribbble)}" target="_blank" rel="noopener" class="social-link" title="Dribbble">${icons.dribbble}</a>`,
                            );
                        }
                        if (member.social.instagram) {
                            links.push(
                                `<a href="${escapeHtml(member.social.instagram)}" target="_blank" rel="noopener" class="social-link" title="Instagram">${icons.instagram}</a>`,
                            );
                        }
                        if (links.length > 0) {
                            socialHtml = `<div class="social-links">${links.join("")}</div>`;
                        }
                    }

                    const delay = 120 + index * 80;

                    return `
                        <article class="card member reveal in" style="transition-delay: ${delay}ms;">
                            <div class="avatar">
                                ${avatarHtml}
                            </div>
                            <h4>${escapeHtml(member.name)}</h4>
                            <div class="role">${member.role}</div>
                            <p>${escapeHtml(member.description)}</p>
                            ${socialHtml}
                        </article>
                    `;
                })
                .join("");

            grid.innerHTML = cards;
        } catch (err) {
            console.warn(
                "Team: failed to load data, keeping static fallback.",
                err,
            );
        }
    }

    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadTeam);
    } else {
        loadTeam();
    }
})();
