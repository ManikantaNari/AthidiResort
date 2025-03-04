import { setActiveMenuItem, setActiveTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    const resortMenuItem = document.getElementById("resort-link");
    const tabItems = document.querySelectorAll(".tab-item");

    window.addEventListener("scroll", function () {
        if (window.scrollY === 0) {
            setActiveMenuItem(document.querySelectorAll("nav ul li a"), resortMenuItem);
            setActiveTab(tabItems, document.querySelector(".tab-item:first-child"));
        }
    });

    window.onload = () => window.scrollTo(0, 0);
});
