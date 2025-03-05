// main.js
import { initNavigation } from "./navigation.js";
import { initTabs } from "./tabs.js";
import { initFormInteractions } from "./form-interactions.js";
import { initScrolls } from "./scroll.js";
import { initGallery } from "./gallery.js";

// Run functions on page load
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initTabs();
    initFormInteractions();
    initScrolls();
    initGallery();
});
