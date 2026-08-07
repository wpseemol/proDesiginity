(function () {
    "use strict";

    /* ---------- per-page SEO table ---------- */
    var SEO = {
        home: {
            path: "/",
            title: "ProDesignity — Shopify Development, Web Design & 3D/2D Animation Agency",
            desc: "ProDesignity is a digital agency building Shopify stores, fast websites, and 3D, 2D and animated video. Talk to us on WhatsApp: +880 1738-142398.",
        },
        services: {
            path: "/services",
            title: "Services — Shopify, Web Development, 3D & 2D Animation | ProDesignity",
            desc: "Shopify theme development and migration, web design, 3D product visuals and 2D animated explainer video. See what ProDesignity delivers on every project.",
        },
        about: {
            path: "/about",
            title: "About ProDesignity — Design & Development Agency in Bangladesh",
            desc: "ProDesignity is a Bangladesh-based agency handling Shopify, web development, 3D and 2D animation under one roof, so your brand stays consistent everywhere.",
        },
        contact: {
            path: "/contact",
            title: "Contact ProDesignity — Start a Shopify, Web or Animation Project",
            desc: "Message ProDesignity on WhatsApp at +880 1738-142398 or email mdpitul@gmail.com. We usually reply within 1–2 hours.",
        },
    };
    var ORIGIN =
        location.origin.indexOf("http") === 0
            ? location.origin
            : "https://prodesignity.com";

    var routes = document.querySelectorAll("[data-page]");
    var navLinks = document.querySelectorAll("[data-nav]");
    var menu = document.getElementById("menu");
    var burger = document.getElementById("burger");

    function meta(sel, attr, val) {
        var el = document.querySelector(sel);
        if (el) el.setAttribute(attr, val);
    }

    function routeFromPath(p) {
        p = (p || "/").replace(/\/+$/, "") || "/";
        p = p.replace(/\/index\.html$/, "") || "/";
        var seg = p.split("/").pop();
        return SEO[seg] ? seg : "home";
    }

    function render(name, push, scroll) {
        var data = SEO[name] || SEO.home;
        routes.forEach(function (r) {
            r.classList.toggle("is-active", r.dataset.page === name);
        });
        navLinks.forEach(function (a) {
            if (a.dataset.nav === name) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });

        document.title = data.title;
        document.documentElement.setAttribute("data-route", name);
        meta('meta[name="description"]', "content", data.desc);
        meta('link[rel="canonical"]', "href", ORIGIN + data.path);
        meta('meta[property="og:title"]', "content", data.title);
        meta('meta[property="og:description"]', "content", data.desc);
        meta('meta[property="og:url"]', "content", ORIGIN + data.path);
        meta('meta[name="twitter:title"]', "content", data.title);
        meta('meta[name="twitter:description"]', "content", data.desc);

        if (push && history.pushState) {
            try {
                history.pushState({ r: name }, "", data.path);
            } catch (err) {
                /* sandboxed preview: keep the URL, still switch the view */
            }
        }
        if (scroll)
            window.scrollTo({
                top: 0,
                behavior: "instant" in document.body.style ? "instant" : "auto",
            });
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        observeReveals();
    }

    /* intercept internal links — no page reload */
    document.addEventListener("click", function (e) {
        var a = e.target.closest("a[data-link]");
        if (!a) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        render(routeFromPath(a.getAttribute("href")), true, true);
    });

    window.addEventListener("popstate", function () {
        render(routeFromPath(location.pathname), false, false);
    });

    /* first paint: static file may declare its own route */
    var initial = document.documentElement.getAttribute("data-route");
    if (!SEO[initial]) initial = routeFromPath(location.pathname);
    render(initial, false, false);

    /* ---------- mobile menu ---------- */
    burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    /* ---------- sticky nav shadow ---------- */
    var nav = document.getElementById("nav");
    var onScroll = function () {
        nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- scroll reveal ---------- */
    var io = null;
    if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        en.target.classList.add("in");
                        io.unobserve(en.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
        );
    }
    function observeReveals() {
        var active = document.querySelector(".route.is-active");
        if (!active) return;
        var items = active.querySelectorAll(".reveal:not(.in)");
        items.forEach(function (el, i) {
            el.style.transitionDelay = Math.min(i, 6) * 60 + "ms";
            if (io) io.observe(el);
            else el.classList.add("in");
        });
    }

    /* ---------- card spotlight ---------- */
    document.addEventListener("pointermove", function (e) {
        var c = e.target.closest(".card");
        if (!c) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
    });

    /* ---------- contact form → WhatsApp / email ---------- */
    var note = document.getElementById("form-note");
    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }
    function build() {
        var name = val("f-name"),
            email = val("f-email");
        if (!name || !email) {
            note.textContent =
                "Add your name and email first, then choose how to send.";
            note.style.color = "#F58527";
            document.getElementById(name ? "f-email" : "f-name").focus();
            return null;
        }
        note.style.color = "";
        note.textContent =
            "Message ready — finish sending in the app that just opened.";
        return (
            "New project enquiry — ProDesignity\n\n" +
            "Name: " +
            name +
            "\nEmail: " +
            email +
            "\nService: " +
            val("f-service") +
            "\nBudget: " +
            val("f-budget") +
            "\n\nDetails:\n" +
            (val("f-msg") || "(none added)")
        );
    }
    var wa = document.getElementById("send-wa"),
        mail = document.getElementById("send-mail");
    if (wa)
        wa.addEventListener("click", function () {
            var m = build();
            if (!m) return;
            window.open(
                "https://wa.me/8801738142398?text=" + encodeURIComponent(m),
                "_blank",
                "noopener",
            );
        });
    if (mail)
        mail.addEventListener("click", function () {
            var m = build();
            if (!m) return;
            window.location.href =
                "mailto:mdpitul@gmail.com?subject=" +
                encodeURIComponent("Project enquiry — " + val("f-service")) +
                "&body=" +
                encodeURIComponent(m);
        });

    document.getElementById("yr").textContent = new Date().getFullYear();
})();
