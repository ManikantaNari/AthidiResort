// scripts/scroll-indicators.js
export function initScrollIndicators() {
    function initializeScroll(sectionClass) {
        const section = document.querySelector(sectionClass);
        if (!section) return;

        const cards = section.querySelectorAll(".feature-card, .testimonial-card");
        const indicatorContainer = section.parentElement.querySelector(".scroll-indicator");

        if (!indicatorContainer) return;

        // Clear existing dots before appending new ones
        indicatorContainer.innerHTML = '';

        // Create dots based on the number of cards
        cards.forEach(() => {
            const dot = document.createElement("div");
            indicatorContainer.appendChild(dot);
        });

        const indicatorDots = indicatorContainer.querySelectorAll("div");

        function updateIndicator() {
            const scrollPosition = section.scrollLeft;
            const totalWidth = section.scrollWidth;
            const cardWidth = cards[0].offsetWidth;
            const index = Math.round(scrollPosition / cardWidth);

            indicatorDots.forEach(dot => dot.classList.remove("active"));
            if (indicatorDots[index]) {
                indicatorDots[index].classList.add("active");
            }
        }

        // Initial state
        updateIndicator();

        // Scroll event to update dots
        section.addEventListener("scroll", updateIndicator);

        // Enable horizontal scroll with mouse wheel on mobile
        section.addEventListener("wheel", (evt) => {
            if (window.innerWidth <= 768) {
                evt.preventDefault();
                section.scrollLeft += evt.deltaY;
            }
        });
    }

    // Initialize scrolling for both sections
    initializeScroll(".features");
    initializeScroll(".testimonial-grid");
}