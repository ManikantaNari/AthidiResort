// scripts/navigation.js
export function initNavigation() {
    console.log("Navigation script loaded");
    const menuItems = document.querySelectorAll("nav ul li a");
    const exploreServices = document.getElementById("explore-service-link");

    console.log("Navigation script loaded");
    console.log("Menu items found:", menuItems.length);
    
    const sections = {
        resort: {
            menuItem: document.getElementById("resort-link"),
            section: document.getElementById("booking-section"),
            tab: document.getElementById("resort-booking-tab")
        },
        pool: {
            menuItem: document.getElementById("swimming-pool-link"),
            section: document.getElementById("booking-section"),
            tab: document.getElementById("pool-booking-tab")
        },
        events: {
            menuItem: document.getElementById("event-link"),
            section: document.getElementById("booking-section"),
            tab: document.getElementById("events-booking-tab")
        },
        services: {
            menuItem: document.getElementById("service-link"),
            section: document.getElementById("features-section")
        },
        contact: {
            menuItem: document.getElementById("contact-link"),
            section: document.getElementById("contact-section")
        },
        offers: {
            menuItem: document.getElementById("offer-link"),
            section: document.getElementById("footer-section"),
            emailInput: document.getElementById("email-address")
        }
    };

    function setActiveMenuItem(clickedItem) {
        menuItems.forEach(item => item.classList.remove("active"));
        clickedItem.classList.add("active");
    }

    function navigateToSection(sectionConfig, event) {
        event.preventDefault();
        
        // Scroll to section
        if (sectionConfig.section) {
            sectionConfig.section.scrollIntoView({ 
                behavior: "smooth", 
                block: sectionConfig.tab ? "center" : "start" 
            });
        }

        // Set active menu item
        setActiveMenuItem(sectionConfig.menuItem);

        // Handle tab switching if applicable
        if (sectionConfig.tab) {
            setTimeout(() => {
                const tabItems = document.querySelectorAll(".tab-item");
                tabItems.forEach(tab => tab.classList.remove("active"));
                sectionConfig.tab.classList.add("active");
            }, 300);
        }

        // Special handling for offers section
        if (sectionConfig.emailInput) {
            setTimeout(() => {
                sectionConfig.emailInput.style.border = "2px solid #ff6600";
                sectionConfig.emailInput.style.boxShadow = "0 0 10px #ff6600";
            }, 1000);

            setTimeout(() => {
                sectionConfig.emailInput.style.border = "";
                sectionConfig.emailInput.style.boxShadow = "";
            }, 3000);
        }
    }

    // Set up event listeners for each section
    Object.values(sections).forEach(sectionConfig => {
        if (sectionConfig.menuItem && sectionConfig.section) {
            sectionConfig.menuItem.addEventListener("click", (event) => 
                navigateToSection(sectionConfig, event)
            );
        }
    });

    // Explore services link
    if (exploreServices && sections.services.section) {
        exploreServices.addEventListener("click", function (event) {
            event.preventDefault();
            sections.services.section.scrollIntoView({ 
                behavior: "smooth", 
                block: "center" 
            });
            setActiveMenuItem(sections.services.menuItem);
        });
    }

    // Reset to default on page load and scroll to top
    window.addEventListener("scroll", function () {
        if (window.scrollY === 0) {
            setActiveMenuItem(sections.resort.menuItem);
            const tabItems = document.querySelectorAll(".tab-item");
            tabItems.forEach(tab => tab.classList.remove("active"));
            document.querySelector(".tab-item:first-child").classList.add("active");
        }
    });

    // Ensure page starts at top with default states
    setTimeout(() => {
        window.scrollTo(0, 0);
        const defaultTab = document.querySelector(".tab-item:first-child");
        if (defaultTab) {
            defaultTab.classList.add("active");
        }
    }, 100);
}