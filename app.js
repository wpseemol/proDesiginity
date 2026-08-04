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

function sendEmail(event) {
    event.preventDefault();

    // Get input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value;

    // Recipient address
    const recipient = "mdpitul@gmail.com";

    // Format subject and body
    const subject = encodeURIComponent(
        `New Project Inquiry: ${service} - ${name}`,
    );
    const body = encodeURIComponent(
        `Hello esignity PRO,\n\n` +
            `Name: ${name}\n` +
            `Client Email: ${email}\n` +
            `Service Requested: ${service}\n\n` +
            `Project Details:\n${message}\n`,
    );

    // Redirect to default mail client (Gmail/Outlook/Apple Mail)
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}
