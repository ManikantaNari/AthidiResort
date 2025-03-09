// scripts/tabs.js
export function initTabs() {
    const tabItems = document.querySelectorAll(".tab-item");
    const resortTab = document.getElementById("resort-booking-tab");
    const poolTab = document.getElementById("pool-booking-tab");
    const eventsTab = document.getElementById("events-booking-tab");

    const guestsField = document.querySelector(".input-group.guests");
    const accommodationField = document.querySelector(".input-group.accommodation");

    function setActiveTab(activeTab) {
        tabItems.forEach(tab => tab.classList.remove("active"));
        activeTab.classList.add("active");

        // Reset all fields to hidden, then show only the required ones
        guestsField.classList.add("hidden");
        accommodationField.classList.add("hidden");

        if (activeTab === resortTab) {
            guestsField.classList.remove("hidden");
            accommodationField.classList.remove("hidden");
        } else if (activeTab === poolTab) {
            // No guests and no accommodation needed
        } else if (activeTab === eventsTab) {
            guestsField.classList.remove("hidden");
        }
    }

    // Set up click listeners for tabs
    tabItems.forEach(tab => {
        tab.addEventListener("click", function () {
            setActiveTab(tab);
        });
    });

    // Initialize the default state based on the active tab
    setActiveTab(document.querySelector(".tab-item.active"));

    // Expose tab management for other scripts if needed
    window.TabManager = {
        setActiveTab: setActiveTab,
        tabs: {
            resort: resortTab,
            pool: poolTab,
            events: eventsTab
        }
    };
}
