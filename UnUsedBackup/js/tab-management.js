import { setActiveTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    const tabItems = document.querySelectorAll(".tab-item");

    tabItems.forEach(tab => {
        tab.addEventListener("click", function () {
            setActiveTab(tabItems, tab);
        });
    });

    // Set default active tab
    const defaultTab = document.querySelector(".tab-item:first-child");
    if (defaultTab) {
        defaultTab.classList.add("active");
    }
});
