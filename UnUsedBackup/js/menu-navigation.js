import { setActiveMenuItem } from "./utils.js";
import "./modules/menu-navigation.js";

document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll("nav ul li a");
    const sections = {
        resort: "booking-section",
        pool: "booking-section",
        service: "features-section",
        event: "booking-section",
        contact: "contact-section",
        offer: "footer-section"
    };

    Object.entries(sections).forEach(([key, sectionId]) => {
        const menuItem = document.getElementById(`${key}-link`);
        const section = document.getElementById(sectionId);
        if (menuItem && section) {
            menuItem.addEventListener("click", function (event) {
                event.preventDefault();
                section.scrollIntoView({ behavior: "smooth", block: "center" });
                setActiveMenuItem(menuItems, menuItem);
            });
        }
    });
});
