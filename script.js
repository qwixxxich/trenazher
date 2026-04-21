document.addEventListener("DOMContentLoaded", () => {
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
});
