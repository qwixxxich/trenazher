document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const sectionLabels = [
        { id: "first", label: "о проекте" },
        { id: "second", label: "контакты" },
        { id: "third", label: "партнеры" },
        { id: "fourth", label: "спецпроекты" },
        { id: "fifth", label: "сотрудничество" },
    ];

    const buildAutoplayUrl = (source) => {
        const url = new URL(source);
        url.searchParams.set("autoplay", "1");
        return url.toString();
    };

    const mountVideoPlayer = (player) => {
        const posterButton = player.querySelector(".video-player-poster");
        const source = player.dataset.videoSrc;

        if (!posterButton || !source) {
            return;
        }

        posterButton.addEventListener("click", () => {
            const iframe = document.createElement("iframe");

            iframe.src = buildAutoplayUrl(source);
            iframe.allow = "autoplay";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";

            posterButton.remove();
            player.append(iframe);
        }, { once: true });
    };

    const setupToggleGroup = ({ toggleSelector, answerSelector, targetAttribute }) => {
        const toggles = Array.from(document.querySelectorAll(toggleSelector));
        const answers = Array.from(document.querySelectorAll(answerSelector));

        const closeAll = () => {
            toggles.forEach((toggle) => {
                toggle.classList.remove("is-active");
                toggle.setAttribute("aria-expanded", "false");
            });

            answers.forEach((answer) => {
                answer.hidden = true;
            });
        };

        toggles.forEach((toggle) => {
            toggle.addEventListener("click", (event) => {
                event.preventDefault();

                const targetId = toggle.dataset[targetAttribute];
                const targetAnswer = targetId ? document.getElementById(targetId) : null;
                const isOpen = toggle.classList.contains("is-active") && targetAnswer && !targetAnswer.hidden;

                closeAll();

                if (!targetAnswer || isOpen) {
                    return;
                }

                toggle.classList.add("is-active");
                toggle.setAttribute("aria-expanded", "true");
                targetAnswer.hidden = false;
            });
        });

        return { closeAll };
    };

    setupToggleGroup({
        toggleSelector: ".faq-toggle",
        answerSelector: ".faq-ans",
        targetAttribute: "faqTarget",
    });

    const faqMoreGroup = setupToggleGroup({
        toggleSelector: ".faq-more-item",
        answerSelector: ".faq-more-ans",
        targetAttribute: "faqMoreAnswerTarget",
    });

    const faqMoreToggle = document.querySelector(".faq-more-toggle");
    const faqMoreTargetId = faqMoreToggle?.dataset.faqMoreTarget;
    const faqMore = faqMoreTargetId ? document.getElementById(faqMoreTargetId) : null;

    if (faqMoreToggle && faqMore) {
        faqMoreToggle.addEventListener("click", (event) => {
            event.preventDefault();

            const isOpen = faqMoreToggle.classList.contains("is-active") && !faqMore.hidden;

            faqMoreToggle.classList.remove("is-active");
            faqMoreToggle.setAttribute("aria-expanded", "false");
            faqMore.hidden = true;
            faqMoreGroup.closeAll();

            if (isOpen) {
                return;
            }

            faqMoreToggle.classList.add("is-active");
            faqMoreToggle.setAttribute("aria-expanded", "true");
            faqMore.hidden = false;
        });
    }

    const navCurrentSection = document.querySelector(".nav-current-section");
    const trackedSections = sectionLabels
        .map(({ id, label }) => {
            const element = document.getElementById(id);
            return element ? { element, id, label } : null;
        })
        .filter(Boolean);

    const getActiveSection = () => {
        if (!trackedSections.length) {
            return null;
        }

        const viewportHeight = window.innerHeight;
        const focusTop = viewportHeight * 0.2;
        const focusBottom = viewportHeight * 0.8;
        const focusCenter = (focusTop + focusBottom) / 2;

        return trackedSections.reduce((bestMatch, section) => {
            const rect = section.element.getBoundingClientRect();
            const overlap = Math.max(0, Math.min(rect.bottom, focusBottom) - Math.max(rect.top, focusTop));
            const rectCenter = rect.top + (rect.height / 2);
            const distanceToFocus = Math.abs(rectCenter - focusCenter);

            if (!bestMatch) {
                return { section, overlap, distanceToFocus };
            }

            if (overlap > bestMatch.overlap) {
                return { section, overlap, distanceToFocus };
            }

            if (overlap === bestMatch.overlap && distanceToFocus < bestMatch.distanceToFocus) {
                return { section, overlap, distanceToFocus };
            }

            return bestMatch;
        }, null)?.section ?? null;
    };

    const syncNavigationState = () => {
        const activeSection = getActiveSection();

        if (!activeSection) {
            return;
        }

        document.querySelectorAll(".nav-sections-text").forEach((link) => {
            const isActive = link.getAttribute("href") === `#${activeSection.id}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
                return;
            }

            link.removeAttribute("aria-current");
        });

        if (navCurrentSection) {
            navCurrentSection.textContent = activeSection.label;
            navCurrentSection.setAttribute("href", `#${activeSection.id}`);
        }
    };

    const syncNavScrollState = () => {
        if (!nav) {
            return;
        }

        nav.classList.toggle("is-scrolled", window.scrollY > 0);
    };

    syncNavScrollState();
    syncNavigationState();
    window.addEventListener("scroll", syncNavScrollState, { passive: true });
    window.addEventListener("scroll", syncNavigationState, { passive: true });
    window.addEventListener("resize", syncNavigationState);

    document.querySelectorAll(".video-player").forEach(mountVideoPlayer);
});
