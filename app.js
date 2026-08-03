document.addEventListener("DOMContentLoaded", () => {
    // Function to handle navigation
    window.navigateTo = function (pageId) {
        // Hide all sections
        const sections = document.querySelectorAll(".page-section");
        sections.forEach((section) => {
            section.classList.remove("active");
        });

        // Show target section
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.classList.add("active");
        }

        // Update nav links active state
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("data-page") === pageId) {
                link.classList.add("active");
            }
        });
    };

    // Add click listeners to nav links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const pageId = this.getAttribute("data-page");
            navigateTo(pageId);
        });
    });
});
