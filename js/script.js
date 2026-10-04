/* ==========================================================================
   CDev.Studio — Interactions
   Vanilla JS, no dependencies. Every effect animates transform/opacity and
   all scroll work is batched into a single requestAnimationFrame per frame.
   ========================================================================== */
(function () {
    "use strict";

    /* ----------------------------------------------------------------------
       Helpers
       ---------------------------------------------------------------------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const pad = (n) => String(n).padStart(2, "0");

    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqDesktop = window.matchMedia("(min-width: 1025px)");
    const reduced = () => mqReduced.matches;

    const body = document.body;
    const root = document.documentElement;

    /* ----------------------------------------------------------------------
       Project data (shared by the gallery modal).
       Placeholder case studies — replace copy, links and images with real ones.
       ---------------------------------------------------------------------- */
    /* const PROJECTS = {
        techmaster: {
            title: "Techmaster Builders",
            industry: "Construction",
            category: "Web Design · WordPress",
            year: "2025",
            services: "Web Design, WordPress Development, SEO",
            tech: ["WordPress", "Custom Theme", "PHP", "Vanilla JS"],
            url: "#",
            overview: "A confident, image-led website for a construction firm that wanted to look as solid online as the buildings it delivers.",
            challenge: "The previous site was slow, hard to update, and buried the company's portfolio behind generic stock imagery. Enquiries were coming in by phone only.",
            solution: "We designed a bold typographic system around real project photography, built a lightweight custom WordPress theme, and gave the team a simple way to publish new projects.",
            features: ["Filterable project portfolio", "Editable service pages", "Quote request form with routing", "Optimized image pipeline", "Local SEO structure"],
            results: [["Faster", "Lean custom theme, no page builder"], ["Easier", "Team updates content in minutes"], ["Clearer", "Projects and services up front"]],
        },
        oceanwide: {
            title: "Oceanwide MTMS",
            industry: "Maritime Training",
            category: "Custom Development · Web Application",
            year: "2025",
            services: "UX Design, Custom Development, Web Application",
            tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
            url: "#",
            overview: "A maritime training management system that brings trainee records, course schedules and certifications into one clear dashboard.",
            challenge: "Training data lived across spreadsheets and paper forms, making scheduling and certificate tracking slow and error-prone.",
            solution: "We mapped the real workflows with the training team, then designed and built a focused web application with role-based dashboards, scheduling and record management.",
            features: ["Trainee & course management", "Certificate tracking", "Role-based dashboards", "Scheduling views", "Exportable reports"],
            results: [["One place", "Records, courses and certificates unified"], ["Less admin", "Fewer manual spreadsheets"], ["Clear view", "Dashboards for every role"]],
        },
        "cdev-portfolio": {
            title: "CDev Portfolio",
            industry: "Creative Developer",
            category: "Web Design · Custom Development",
            year: "2024",
            services: "Art Direction, Web Design, Front-end Development",
            tech: ["HTML", "CSS", "Vanilla JS", "SVG"],
            url: "#",
            overview: "A typographic, motion-driven portfolio built to show craft through the experience itself — not just the screenshots.",
            challenge: "Stand out in a crowded space of template portfolios while staying fast and accessible.",
            solution: "An editorial black-and-white system, subtle micro-interactions, and a hand-written front end with zero frameworks.",
            features: ["Editorial typography system", "Custom cursor & micro-interactions", "Case study templates", "Reduced-motion support", "Framework-free build"],
            results: [["Lightweight", "Hand-written HTML, CSS & JS"], ["Memorable", "Distinct visual identity"], ["Accessible", "Keyboard & motion friendly"]],
        },
        northline: {
            title: "Northline Coffee Co.",
            industry: "Hospitality",
            category: "Web Design · WordPress",
            year: "2026",
            services: "Web Design, WordPress Development, SEO",
            tech: ["WordPress", "WooCommerce", "Custom Blocks"],
            url: "#",
            overview: "A warm, minimal website and small online shop for an independent coffee roaster.",
            challenge: "The brand felt premium in store but generic online, and the team needed to sell beans without a complex platform.",
            solution: "A restrained design that lets product photography lead, with custom editor blocks and a simple shop setup the team can manage alone.",
            features: ["Product catalogue & shop", "Store locator", "Custom editor blocks", "Newsletter integration", "Menu pages"],
            results: [["Online sales", "Simple shop the team runs"], ["On brand", "Matches the in-store experience"], ["Found", "Local search foundations in place"]],
        },
        atlas: {
            title: "Atlas Legal Partners",
            industry: "Legal Services",
            category: "WordPress",
            year: "2026",
            services: "WordPress Development, SEO, Maintenance",
            tech: ["WordPress", "ACF", "Schema Markup"],
            url: "#",
            overview: "A calm, credible website for a law firm, designed to make expertise easy to understand and contact easy to make.",
            challenge: "Dense practice-area content and an outdated design made the firm look less established than it is.",
            solution: "A classic editorial layout, clear practice-area structure, attorney profiles and an ongoing maintenance plan.",
            features: ["Practice area architecture", "Attorney profiles", "Consultation booking", "Structured data for search", "Monthly maintenance"],
            results: [["Credible", "Editorial, trustworthy design"], ["Structured", "Content people can navigate"], ["Maintained", "Updates, backups & security"]],
        },
        pulse: {
            title: "Pulse Clinic Booking",
            industry: "Healthcare",
            category: "Web Application · Custom Development",
            year: "2026",
            services: "UX Design, Web Application",
            tech: ["JavaScript", "REST API", "Node.js"],
            url: "#",
            overview: "A focused booking application for a multi-practitioner clinic, built for patients on their phones.",
            challenge: "Patients booked by phone during busy hours, and staff spent much of the day managing the calendar.",
            solution: "A mobile-first booking flow with practitioner availability, confirmations and a lightweight staff dashboard.",
            features: ["Mobile-first booking flow", "Practitioner availability", "Email confirmations", "Staff dashboard", "Accessible forms"],
            results: [["24/7", "Patients book any time"], ["Fewer calls", "Less front-desk load"], ["Mobile", "Designed for small screens"]],
        },
        meridian: {
            title: "Meridian Realty",
            industry: "Real Estate",
            category: "Web Design · Custom Development",
            year: "2025",
            services: "Web Design, Custom Development",
            tech: ["HTML", "CSS", "JavaScript", "JSON"],
            url: "#",
            overview: "A clean property showcase with fast search and listing pages designed to convert browsers into viewings.",
            challenge: "Listings were hard to browse on mobile, and every page loaded heavy, unoptimized images.",
            solution: "A custom front end with instant filtering, responsive imagery and clear enquiry points on every listing.",
            features: ["Instant listing filters", "Responsive image galleries", "Enquiry forms per listing", "Neighbourhood guides", "Map integration"],
            results: [["Instant", "Client-side filtering"], ["Lighter", "Responsive, lazy-loaded images"], ["Direct", "Enquiries on every listing"]],
        },
        forma: {
            title: "Forma Studio",
            industry: "Architecture",
            category: "Web Design",
            year: "2024",
            services: "Art Direction, Web Design",
            tech: ["Figma", "HTML", "CSS"],
            url: "#",
            overview: "A minimal, gallery-like website for an architecture practice where the work speaks first.",
            challenge: "Present large-format project imagery beautifully without sacrificing load speed.",
            solution: "A grid-based design language, generous whitespace and carefully optimized imagery.",
            features: ["Gallery-led project pages", "Typographic index", "Studio & team pages", "Optimized media", "Contact & press kit"],
            results: [["Minimal", "Work-first presentation"], ["Fast", "Optimized large imagery"], ["Timeless", "Design that ages well"]],
        },
    }; */

    /* ----------------------------------------------------------------------
       1. Page load & page transitions
       ---------------------------------------------------------------------- */
    function initPageTransitions() {
        // Reveal page on load
        requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("is-loaded")));

        // Restore state when returning via back/forward cache
        window.addEventListener("pageshow", (e) => {
            if (e.persisted) {
                body.classList.remove("is-leaving");
                body.classList.add("is-loaded");
            }
        });

        document.addEventListener("click", (e) => {
            const link = e.target.closest("a[href]");
            if (!link) return;
            const href = link.getAttribute("href");
            if (
                e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
                link.target === "_blank" || link.hasAttribute("download") ||
                !href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")
            ) return;

            const url = new URL(link.href, location.href);
            if (url.origin !== location.origin) return;
            // Same page + hash: let the browser scroll
            if (url.pathname === location.pathname && url.hash) return;
            if (reduced()) return;

            e.preventDefault();
            closeMenu();
            body.classList.add("is-leaving");
            setTimeout(() => { location.href = link.href; }, 620);
        });
    }

    /* ----------------------------------------------------------------------
       2. Header behaviour + mobile menu
       ---------------------------------------------------------------------- */
    const header = $(".site-header");
    const burger = $(".burger");
    const menu = $("#mobile-menu");
    let lastY = window.scrollY;

    function updateHeader(y) {
        if (!header) return;
        header.classList.toggle("is-scrolled", y > 40);
        const goingDown = y > lastY;
        const menuOpen = menu && menu.classList.contains("is-open");
        if (!menuOpen && goingDown && y > 400) header.classList.add("is-hidden");
        else if (!goingDown || y < 400) header.classList.remove("is-hidden");
        lastY = y;
    }

    function openMenu() {
        if (!menu) return;
        menu.classList.add("is-open");
        menu.removeAttribute("inert");
        menu.setAttribute("aria-hidden", "false");
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Close menu");
        body.classList.add("is-locked");
        header.classList.remove("is-hidden");
        const first = $("a", menu);
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 300);
    }

    function closeMenu() {
        if (!menu || !menu.classList.contains("is-open")) return;
        menu.classList.remove("is-open");
        menu.setAttribute("inert", "");
        menu.setAttribute("aria-hidden", "true");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
        body.classList.remove("is-locked");
    }

    function initMenu() {
        if (!burger || !menu) return;
        menu.setAttribute("inert", "");
        burger.addEventListener("click", () => (menu.classList.contains("is-open") ? closeMenu() : openMenu()));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                closeMenu();
                burger.focus();
            }
        });
        mqDesktop.addEventListener("change", (e) => e.matches && closeMenu());
    }

    /* ----------------------------------------------------------------------
       3. Custom cursor (fine pointers only)
       ---------------------------------------------------------------------- */
    function initCursor() {
        const cursor = $(".cursor");
        if (!cursor || !mqFine.matches || reduced()) return;

        const dot = $(".cursor__dot", cursor);
        const ring = $(".cursor__ring", cursor);
        const label = $(".cursor__label", cursor);
        root.classList.add("has-cursor");

        let mx = -100, my = -100, rx = -100, ry = -100;
        let running = false;

        const loop = () => {
            rx = lerp(rx, mx, 0.18);
            ry = lerp(ry, my, 0.18);
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            if (Math.abs(rx - mx) > 0.1 || Math.abs(ry - my) > 0.1) requestAnimationFrame(loop);
            else running = false;
        };

        window.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
            cursor.classList.remove("is-hidden");
            if (!running) { running = true; requestAnimationFrame(loop); }
        }, { passive: true });

        document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
        document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
        document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

        document.addEventListener("mouseover", (e) => {
            const t = e.target;
            const project = t.closest("[data-cursor='project']");
            const button = !project && t.closest("button, .btn, [data-magnetic], .pill, .filter-btn");
            const link = !project && !button && t.closest("a, select, label, summary");
            const text = !project && !button && !link && t.closest("input, textarea");
            cursor.classList.toggle("is-project", !!project);
            cursor.classList.toggle("is-button", !!button);
            cursor.classList.toggle("is-link", !!link);
            cursor.classList.toggle("is-text", !!text);
            if (project) label.textContent = project.dataset.cursorLabel || "View";
        });
    }

    /* ----------------------------------------------------------------------
       4. Magnetic buttons
       ---------------------------------------------------------------------- */
    function initMagnetic() {
        if (!mqFine.matches || reduced()) return;
        $$("[data-magnetic]").forEach((el) => {
            const strength = parseFloat(el.dataset.magnetic) || 0.3;
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - (r.left + r.width / 2)) * strength;
                const y = (e.clientY - (r.top + r.height / 2)) * strength;
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
            el.addEventListener("mouseleave", () => { el.style.transform = ""; });
        });
    }

    /* ----------------------------------------------------------------------
       5. Text splitting (words & characters)
       ---------------------------------------------------------------------- */
    function splitWords(el) {
        let i = 0;
        const walk = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 3) {
                    const parts = child.textContent.split(/(\s+)/);
                    const frag = document.createDocumentFragment();
                    parts.forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
                        const w = document.createElement("span");
                        w.className = "word";
                        const inner = document.createElement("span");
                        inner.className = "word__inner";
                        inner.style.setProperty("--i", i++);
                        inner.textContent = part;
                        w.appendChild(inner);
                        frag.appendChild(w);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === 1 && child.tagName !== "BR") {
                    walk(child);
                }
            });
        };
        walk(el);
    }

    function splitChars(el) {
        const text = el.textContent;
        if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", text.trim().replace(/\s+/g, " "));
        const walk = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    Array.from(child.textContent).forEach((ch) => {
                        if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
                        if (/\s/.test(ch)) return;
                        const s = document.createElement("span");
                        s.className = "char";
                        s.setAttribute("aria-hidden", "true");
                        s.textContent = ch;
                        frag.appendChild(s);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === 1) walk(child);
            });
        };
        walk(el);
    }

    function initSplits() {
        $$("[data-split='words']").forEach(splitWords);
        $$("[data-split='chars']").forEach(splitChars);
    }

    /* ----------------------------------------------------------------------
       6. Scroll reveals (IntersectionObserver)
       ---------------------------------------------------------------------- */
    function initReveals() {
        const targets = $$("[data-reveal], [data-reveal-lines], [data-split='words']:not([data-scrub]), .stat, .report");
        if (!("IntersectionObserver" in window) || reduced()) {
            targets.forEach((el) => el.classList.add("is-visible"));
            $$("[data-count]").forEach((el) => runCounter(el, true));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add("is-visible");
                $$("[data-count]", el).forEach((c) => runCounter(c));
                if (el.hasAttribute("data-count")) runCounter(el);
                io.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
        targets.forEach((el) => io.observe(el));
    }

    /* Animated counters */
    function runCounter(el, instant) {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        const to = parseFloat(el.dataset.count);
        const from = parseFloat(el.dataset.from || 0);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const render = (v) => { el.textContent = prefix + Math.round(v) + suffix; };
        if (instant || reduced()) { render(to); return; }
        const dur = 1800;
        const start = performance.now();
        const tick = (now) => {
            const t = clamp((now - start) / dur);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
            render(from + (to - from) * eased);
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    /* ----------------------------------------------------------------------
       7. Scroll-driven effects (single rAF loop)
       ---------------------------------------------------------------------- */
    const progressBar = $(".scroll-progress");
    const backTop = $(".back-to-top");
    const ringProgress = backTop && $(".ring-progress", backTop);
    const RING_LEN = 150.8;

    const scrubEls = $$("[data-scrub]");
    const parallaxEls = $$("[data-parallax]");
    const process = setupProcess();

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    function update() {
        ticking = false;
        const y = window.scrollY;
        const vh = window.innerHeight;
        const max = document.documentElement.scrollHeight - vh;
        const p = max > 0 ? clamp(y / max) : 0;

        if (progressBar) progressBar.style.transform = `scaleX(${p})`;
        updateHeader(y);

        if (backTop) {
            backTop.classList.toggle("is-visible", y > vh * 0.8);
            if (ringProgress) ringProgress.style.strokeDashoffset = RING_LEN * (1 - p);
        }

        if (!reduced()) {
            // Scrubbed word highlighting
            scrubEls.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                const prog = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.4));
                const words = el._words || (el._words = $$(".word__inner", el));
                const n = words.length;
                words.forEach((w, i) => w.style.setProperty("--p", clamp(prog * n * 1.15 - i).toFixed(3)));
            });

            // Parallax
            parallaxEls.forEach((el) => {
                const r = el.parentElement.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                const speed = parseFloat(el.dataset.parallax) || 0.15;
                const offset = (r.top + r.height / 2 - vh / 2) * speed;
                el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
            });
        }

        if (process) process.update(vh);
    }

    /* Horizontal process timeline */
    function setupProcess() {
        const section = $("[data-process]");
        if (!section) return null;
        const track = $(".process__track", section);
        const steps = $$(".process-step", section);
        const bar = $(".process__progress", section);
        const count = $(".process__count", section);
        let pinned = false;
        let overflow = 0;
        let io = null;

        const setActive = (idx) => {
            steps.forEach((s, i) => s.classList.toggle("is-active", i <= idx));
            if (count) count.textContent = `${pad(idx + 1)} / ${pad(steps.length)}`;
        };

        const measure = () => {
            const shouldPin = mqDesktop.matches && !reduced();
            pinned = shouldPin;
            section.classList.toggle("is-pinned", pinned);
            if (pinned) {
                track.style.transform = "";
                overflow = Math.max(0, track.scrollWidth - window.innerWidth);
                section.style.height = `${window.innerHeight + overflow}px`;
                if (io) { io.disconnect(); io = null; }
            } else {
                section.style.height = "";
                track.style.transform = "";
                if (!io && "IntersectionObserver" in window) {
                    io = new IntersectionObserver((entries) => {
                        entries.forEach((en) => en.isIntersecting && en.target.classList.add("is-active"));
                    }, { rootMargin: "0px 0px -35% 0px" });
                    steps.forEach((s) => io.observe(s));
                } else if (!io) steps.forEach((s) => s.classList.add("is-active"));
            }
        };

        measure();
        let rt;
        window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { measure(); update(); }, 150); });

        return {
            update(vh) {
                const r = section.getBoundingClientRect();
                if (pinned) {
                    const dist = section.offsetHeight - vh;
                    const p = dist > 0 ? clamp(-r.top / dist) : 0;
                    track.style.transform = `translate3d(${(-p * overflow).toFixed(1)}px, 0, 0)`;
                    if (bar) bar.style.setProperty("--p", p.toFixed(4));
                    setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999 + 0.25)));
                } else {
                    const p = clamp((vh * 0.65 - r.top) / r.height);
                    if (bar) bar.style.setProperty("--p", p.toFixed(4));
                    const active = steps.filter((s) => s.classList.contains("is-active")).length;
                    if (count) count.textContent = `${pad(Math.max(1, active))} / ${pad(steps.length)}`;
                }
            },
        };
    }

    /* ----------------------------------------------------------------------
       8. Hero: mouse-following light + parallax shapes
       ---------------------------------------------------------------------- */
    function initHero() {
        const hero = $("[data-hero]");
        if (!hero || reduced() || !mqFine.matches) return;
        const light = $(".hero__light", hero);
        const shapes = $(".hero__shapes", hero);
        let tx = window.innerWidth * 0.7, ty = window.innerHeight * 0.3, x = tx, y = ty;
        let running = false;

        const loop = () => {
            x = lerp(x, tx, 0.07);
            y = lerp(y, ty, 0.07);
            if (light) light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            if (shapes) {
                const sx = (x / window.innerWidth - 0.5) * -30;
                const sy = (y / window.innerHeight - 0.5) * -30;
                shapes.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
            }
            if (Math.abs(x - tx) > 0.2 || Math.abs(y - ty) > 0.2) requestAnimationFrame(loop);
            else running = false;
        };

        hero.addEventListener("mousemove", (e) => {
            const r = hero.getBoundingClientRect();
            tx = e.clientX - r.left;
            ty = e.clientY - r.top;
            if (!running) { running = true; requestAnimationFrame(loop); }
        }, { passive: true });
    }

    /* ----------------------------------------------------------------------
       9. Proximity type (chars lift toward the cursor)
       ---------------------------------------------------------------------- */
    function initProximity() {
        if (!mqFine.matches || reduced()) return;
        $$("[data-proximity]").forEach((wrap) => {
            const chars = $$(".char", wrap);
            if (!chars.length) return;
            let rects = [];
            let mx = 0, my = 0, frame = null;
            const radius = 260;

            const measure = () => {
                chars.forEach((c) => { c.style.transform = ""; });
                rects = chars.map((c) => {
                    const r = c.getBoundingClientRect();
                    return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height };
                });
            };
            const render = () => {
                frame = null;
                chars.forEach((c, i) => {
                    const d = Math.hypot(mx - rects[i].x, my - rects[i].y);
                    const f = clamp(1 - d / radius);
                    c.style.transform = f > 0 ? `translate3d(0, ${(-f * rects[i].h * 0.12).toFixed(1)}px, 0)` : "";
                });
            };
            wrap.addEventListener("mouseenter", measure);
            wrap.addEventListener("mousemove", (e) => {
                mx = e.clientX; my = e.clientY;
                if (!frame) frame = requestAnimationFrame(render);
            });
            wrap.addEventListener("mouseleave", () => chars.forEach((c) => { c.style.transform = ""; }));
            window.addEventListener("scroll", () => { rects = []; }, { passive: true });
            wrap.addEventListener("mousemove", () => { if (!rects.length) measure(); });
        });
    }

    /* ----------------------------------------------------------------------
       10. Back to top
       ---------------------------------------------------------------------- */
    function initBackToTop() {
        const toTop = (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
            const skip = $(".logo");
            if (skip) skip.focus({ preventScroll: true });
        };
        if (backTop) backTop.addEventListener("click", toTop);
        $$("[data-back-top]").forEach((a) => a.addEventListener("click", toTop));
    }

    /* ----------------------------------------------------------------------
       11. Services accordion
       ---------------------------------------------------------------------- */
    function initAccordion() {
        const items = $$(".service");
        if (!items.length) return;

        const set = (item, open) => {
            item.classList.toggle("is-open", open);
            $(".service__head", item).setAttribute("aria-expanded", String(open));
            const panel = $(".service__panel", item);
            if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
        };

        items.forEach((item) => {
            set(item, item.classList.contains("is-open"));
            $(".service__head", item).addEventListener("click", () => set(item, !item.classList.contains("is-open")));
        });

        // Deep links like services.html#seo open the matching service
        const openFromHash = () => {
            const target = location.hash && document.getElementById(location.hash.slice(1));
            if (target && target.classList.contains("service")) {
                set(target, true);
                setTimeout(() => target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }), 400);
            }
        };
        openFromHash();
        window.addEventListener("hashchange", openFromHash);
    }

    /* ----------------------------------------------------------------------
       12. Project filters + modal
       ---------------------------------------------------------------------- */
    function initGallery() {
        const gallery = $(".gallery");
        if (!gallery) return;
        const cards = $$(".project-card", gallery);
        const buttons = $$(".filter-btn");
        const status = $(".filters__status");
        let busy = false;

        const matches = (card, f) => f === "all" || card.dataset.categories.split(" ").includes(f);

        // Count badges
        buttons.forEach((b) => {
            const n = cards.filter((c) => matches(c, b.dataset.filter)).length;
            const sup = document.createElement("sup");
            sup.textContent = pad(n);
            b.appendChild(sup);
        });

        // Editorial rhythm: wide, half, half, wide… and never a lonely half card
        const layout = () => {
            const visible = cards.filter((c) => !c.hidden);
            const n = visible.length;
            visible.forEach((c, i) => {
                const wide = i % 3 === 0 || (i === n - 1 && i % 3 === 1);
                c.classList.toggle("is-wide", wide);
            });
            if (status) status.textContent = `Showing ${pad(n)} project${n === 1 ? "" : "s"}`;
        };
        layout();

        const apply = (filter) => {
            if (busy) return;
            busy = true;
            const visible = cards.filter((c) => !c.hidden);
            visible.forEach((c) => c.classList.add("is-out"));
            setTimeout(() => {
                cards.forEach((c) => {
                    c.hidden = !matches(c, filter);
                    c.classList.add("is-out");
                });
                layout();
                const shown = cards.filter((c) => !c.hidden);
                void gallery.offsetHeight; // reflow so the entrance transition runs
                shown.forEach((c, i) => setTimeout(() => c.classList.remove("is-out"), i * 70));
                busy = false;
            }, reduced() ? 0 : 420);
        };

        buttons.forEach((b) => b.addEventListener("click", () => {
            if (b.getAttribute("aria-pressed") === "true") return;
            buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            apply(b.dataset.filter);
        }));

        initModal(cards);
    }

    function modalTemplate(id) {
        const p = PROJECTS[id];
        const ids = Object.keys(PROJECTS);
        const next = ids[(ids.indexOf(id) + 1) % ids.length];
        const visit = p.url && p.url !== "#"
            ? `<a class="btn btn--solid btn--lg" href="${p.url}" target="_blank" rel="noopener">Visit website <span class="arrow" aria-hidden="true"><span>↗</span><span>↗</span></span></a>`
            : `<span class="btn btn--lg" aria-disabled="true" title="Add the live URL in js/script.js">Visit website ↗</span>`;
        return `
        <div class="container modal__hero">
            <p class="eyebrow">${p.category}</p>
            <h2 class="display-xl modal__title" id="modal-title">${p.title}</h2>
            <dl class="modal__meta">
                <div><dt>Client / Industry</dt><dd>${p.industry}</dd></div>
                <div><dt>Year</dt><dd>${p.year}</dd></div>
                <div><dt>Services</dt><dd>${p.services}</dd></div>
                <div><dt>Technology</dt><dd>${p.tech.join(", ")}</dd></div>
            </dl>
        </div>
        <div class="container">
            <figure class="modal__cover"><img src="assets/images/${id}.svg" alt="${p.title} homepage design" width="1600" height="1000"></figure>
        </div>
        <div class="container modal__body">
            <p class="eyebrow">Project overview</p>
            <p class="modal__overview" style="margin-top:24px">${p.overview}</p>
            <div class="modal__cols">
                <div class="modal__block"><h3 class="eyebrow">The challenge</h3><p>${p.challenge}</p></div>
                <div class="modal__block"><h3 class="eyebrow">The solution</h3><p>${p.solution}</p></div>
                <div class="modal__block"><h3 class="eyebrow">Key features</h3><ul class="modal__list">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul></div>
                <div class="modal__block"><h3 class="eyebrow">Technologies</h3><div class="tags">${p.tech.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div>
            </div>
            <div class="modal__shots">
                <figure><img src="assets/images/${id}-mobile.svg" alt="${p.title} mobile screens" width="1600" height="1000" loading="lazy"></figure>
                <figure><img src="assets/images/${id}-detail.svg" alt="${p.title} interface components" width="1600" height="1000" loading="lazy"></figure>
            </div>
            <div style="margin-top:clamp(56px,7vw,100px)">
                <h3 class="eyebrow">Results &amp; impact</h3>
                <div class="modal__results">${p.results.map((r) => `<div class="modal__result"><strong>${r[0]}</strong><span>${r[1]}</span></div>`).join("")}</div>
            </div>
            <div class="modal__actions">
                ${visit}
                <button type="button" class="link-arrow" data-next="${next}">Next: ${PROJECTS[next].title} <span class="arrow" aria-hidden="true"><span>→</span><span>→</span></span></button>
            </div>
        </div>`;
    }

    function initModal(cards) {
        const modal = $("#project-modal");
        // Cards now link straight to the live site; the modal only runs if PROJECTS is restored
        if (!modal || typeof modal.showModal !== "function" || typeof PROJECTS === "undefined") return;
        const content = $(".modal__content", modal);
        const scroller = $(".modal__scroll", modal);
        const label = $(".modal__label", modal);
        let lastFocus = null;

        const fill = (id) => {
            content.innerHTML = modalTemplate(id);
            if (label) label.textContent = `${pad(Object.keys(PROJECTS).indexOf(id) + 1)} / ${pad(Object.keys(PROJECTS).length)}`;
            scroller.scrollTop = 0;
            history.replaceState(null, "", `#${id}`);
        };

        const open = (id) => {
            if (!PROJECTS[id]) return;
            lastFocus = document.activeElement;
            fill(id);
            modal.showModal();
            body.classList.add("is-locked");
            // The dialog renders in the top layer, so carry the custom cursor inside it
            const cursorEl = $(".cursor");
            if (cursorEl) modal.appendChild(cursorEl);
            $(".modal__close", modal).focus();
        };

        const close = () => {
            if (!modal.open) return;
            const done = () => {
                modal.classList.remove("is-closing");
                modal.close();
                body.classList.remove("is-locked");
                const cursorEl = $(".cursor", modal);
                if (cursorEl) body.appendChild(cursorEl);
                history.replaceState(null, "", location.pathname + location.search);
                if (lastFocus) lastFocus.focus({ preventScroll: true });
            };
            if (reduced()) { done(); return; }
            modal.classList.add("is-closing");
            setTimeout(done, 480);
        };

        cards.forEach((card) => $(".project-card__open", card).addEventListener("click", () => open(card.dataset.id)));
        $(".modal__close", modal).addEventListener("click", close);
        modal.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
        modal.addEventListener("click", (e) => {
            const nextBtn = e.target.closest("[data-next]");
            if (nextBtn) fill(nextBtn.dataset.next);
        });

        // Deep link from homepage cards: projects.html#techmaster
        const hashId = location.hash.slice(1);
        if (PROJECTS[hashId]) setTimeout(() => open(hashId), reduced() ? 0 : 900);
    }

    /* ----------------------------------------------------------------------
       13. Contact form
       ---------------------------------------------------------------------- */
    function initForm() {
        const form = $("#contact-form");
        if (!form) return;
        const status = $(".form__status", form);
        const submit = $("button[type='submit']", form);
        let attempted = false;

        const rules = {
            name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
            email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
            type: (v) => (v ? "" : "Please choose a project type."),
            message: (v) => (v.trim().length >= 10 ? "" : "Tell us a little more (at least 10 characters)."),
        };

        const validateField = (name) => {
            const input = form.elements[name];
            const msg = rules[name](input.value);
            const field = input.closest(".field");
            const err = $(".field__error", field);
            field.classList.toggle("is-invalid", !!msg);
            input.setAttribute("aria-invalid", msg ? "true" : "false");
            err.textContent = msg;
            return !msg;
        };

        Object.keys(rules).forEach((name) => {
            const input = form.elements[name];
            input.addEventListener("blur", () => attempted && validateField(name));
            input.addEventListener("input", () => attempted && validateField(name));
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            attempted = true;
            const results = Object.keys(rules).map((n) => [n, validateField(n)]);
            const firstBad = results.find((r) => !r[1]);
            if (firstBad) {
                form.elements[firstBad[0]].focus();
                status.textContent = "Please check the highlighted fields.";
                return;
            }

            const data = new FormData(form);
            const endpoint = form.dataset.endpoint;
            submit.classList.add("is-loading");
            status.textContent = "";

            try {
                if (endpoint) {
                    // Works with Formspree, Netlify Forms, Basin, or your own API.
                    const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
                    if (!res.ok) throw new Error("Request failed");
                    status.textContent = `Thank you, ${data.get("name").split(" ")[0]}. Your inquiry has been sent — we'll reply within 1–2 business days.`;
                    form.reset();
                } else {
                    // No backend configured: hand off to the visitor's email app.
                    const subject = `Project inquiry — ${data.get("type")}`;
                    const lines = [
                        `Name: ${data.get("name")}`,
                        `Email: ${data.get("email")}`,
                        `Company: ${data.get("company") || "—"}`,
                        `Project type: ${data.get("type")}`,
                        `Budget: ${data.get("budget") || "Not specified"}`,
                        "",
                        data.get("message"),
                    ];
                    location.href = `mailto:hello@cdev.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
                    status.textContent = `Thanks, ${data.get("name").split(" ")[0]}. Your email app should open with the inquiry ready to send. If it doesn't, write to hello@cdev.studio.`;
                }
            } catch (err) {
                status.textContent = "Something went wrong sending your inquiry. Please email hello@cdev.studio directly.";
            } finally {
                submit.classList.remove("is-loading");
            }
        });
    }

    /* ----------------------------------------------------------------------
       Init
       ---------------------------------------------------------------------- */
    initSplits();
    initPageTransitions();
    initMenu();
    initCursor();
    initMagnetic();
    initReveals();
    initHero();
    initProximity();
    initBackToTop();
    initAccordion();
    initGallery();
    initForm();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
})();
