import { initNavigation } from "./navigation.js";
import { initTabs } from "./tabs.js";
import { initFormInteractions } from "./form-interactions.js";
import { initScrolls } from "./scroll.js";
import { initScrollIndicators } from "./scroll-indicators.js";
import { initGallery } from "./gallery.js";
import { initBooking } from "./booking.js";

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initTabs();
    initFormInteractions();
    initScrolls();
    initScrollIndicators();
    initGallery();
    initBooking();

    // Add timestamp to footer
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        timestampElement.textContent = new Date().toLocaleString();
    }

    // Feature section pool/event "Book" links
    document.getElementById('feature-pool-book')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            document.getElementById('pool-booking-tab')?.click();
        }, 400);
    });

    document.getElementById('feature-event-book')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            document.getElementById('events-booking-tab')?.click();
        }, 400);
    });
});
