// scripts/tabs.js
document.addEventListener("DOMContentLoaded", function () {
    const tabItems = document.querySelectorAll(".tab-item");
    const resortTab = document.getElementById("resort-booking-tab");
    const poolTab = document.getElementById("pool-booking-tab");
    const eventsTab = document.getElementById("events-booking-tab");

    function setActiveTab(activeTab) {
        tabItems.forEach(tab => tab.classList.remove("active"));
        activeTab.classList.add("active");
    }

    // Set up click listeners for tabs
    tabItems.forEach(tab => {
        tab.addEventListener("click", function () {
            setActiveTab(tab);
        });
    });

    // Expose tab management for other scripts if needed
    window.TabManager = {
        setActiveTab: setActiveTab,
        tabs: {
            resort: resortTab,
            pool: poolTab,
            events: eventsTab
        }
    };
});