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
                        if (member.social.portfolio) {
                            links.push(
                                `<a href="${escapeHtml(member.social.portfolio)}" target="_blank" rel="noopener" class="social-link" title="Portfolio"><i class="fas fa-briefcase"></i></a>`,
                            );
                        }
                        if (member.social.linkedin) {
                            links.push(
                                `<a href="${escapeHtml(member.social.linkedin)}" target="_blank" rel="noopener" class="social-link" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>`,
                            );
                        }
                        if (member.social.github) {
                            links.push(
                                `<a href="${escapeHtml(member.social.github)}" target="_blank" rel="noopener" class="social-link" title="GitHub"><i class="fab fa-github"></i></a>`,
                            );
                        }
                        if (member.social.twitter) {
                            links.push(
                                `<a href="${escapeHtml(member.social.twitter)}" target="_blank" rel="noopener" class="social-link" title="Twitter"><i class="fab fa-twitter"></i></a>`,
                            );
                        }
                        if (member.social.dribbble) {
                            links.push(
                                `<a href="${escapeHtml(member.social.dribbble)}" target="_blank" rel="noopener" class="social-link" title="Dribbble"><i class="fab fa-dribbble"></i></a>`,
                            );
                        }
                        if (member.social.instagram) {
                            links.push(
                                `<a href="${escapeHtml(member.social.instagram)}" target="_blank" rel="noopener" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>`,
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
