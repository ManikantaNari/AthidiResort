document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll("nav ul li a");
    const exploreServices = document.getElementById("explore-service-link");

    const resortMenuItem = document.getElementById("resort-link");
    const poolMenuItem = document.getElementById("swimming-pool-link");
    const serviceMenuItem = document.getElementById("service-link");
    const eventMenuItem = document.getElementById("event-link");
    const contactMenuItem = document.getElementById("contact-link");
    const offerMenuItem = document.getElementById("offer-link");

    const bookingSection = document.getElementById("booking-section");
    const featuresSection = document.getElementById("features-section");
    const contactSection = document.getElementById("contact-section");
    const footerSection = document.getElementById("footer-section");
    const emailInput = document.getElementById("email-address");

    const resortTab = document.getElementById("resort-booking-tab");
    const poolTab = document.getElementById("pool-booking-tab");
    const eventsTab = document.getElementById("events-booking-tab");
    const tabItems = document.querySelectorAll(".tab-item");

    function setActiveMenuItem(clickedItem) {
        menuItems.forEach(item => item.classList.remove("active"));
        clickedItem.classList.add("active");
    }

    function setActiveTab(activeTab) {
        tabItems.forEach(tab => tab.classList.remove("active"));
        activeTab.classList.add("active");
    }

    tabItems.forEach(tab => {
        tab.addEventListener("click", function () {
            setActiveTab(tab);
        });
    });

    if (exploreServices && featuresSection) {
        exploreServices.addEventListener("click", function (event) {
            event.preventDefault();
            featuresSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(serviceMenuItem);
        });
    }

    if (resortMenuItem && bookingSection && resortTab) {
        resortMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });

            setActiveMenuItem(resortMenuItem);
            setTimeout(() => setActiveTab(resortTab), 300);
        });
    }

    if (poolMenuItem && bookingSection && poolTab) {
        poolMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(poolMenuItem);
            setTimeout(() => setActiveTab(poolTab), 300);
        });
    }

    if (eventMenuItem && bookingSection && eventsTab) {
        eventMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(eventMenuItem);
            setTimeout(() => setActiveTab(eventsTab), 300);
        });
    }

    if (serviceMenuItem && featuresSection) {
        serviceMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            featuresSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(serviceMenuItem);
        });
    }

    if (contactMenuItem && contactSection) {
        contactMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            contactSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(contactMenuItem);
        });
    }

    if (offerMenuItem && footerSection && emailInput) {
        offerMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            footerSection.scrollIntoView({ behavior: "smooth", block: "center" });

            setActiveMenuItem(offerMenuItem);

            setTimeout(() => {
                emailInput.style.border = "2px solid #ff6600";
                emailInput.style.boxShadow = "0 0 10px #ff6600";
            }, 1000);

            setTimeout(() => {
                emailInput.style.border = "";
                emailInput.style.boxShadow = "";
            }, 3000);
        });
    }

    window.addEventListener("scroll", function () {
        if (window.scrollY === 0) {
            setActiveMenuItem(resortMenuItem);
            setActiveTab(document.querySelector(".tab-item:first-child"));
        }
    });

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100); 

    const allTabs = document.querySelectorAll(".tab-item");
    allTabs.forEach(tab => tab.classList.remove("active"));

    const defaultTab = document.querySelector(".tab-item:first-child"); 
    if (defaultTab) {
        defaultTab.classList.add("active");
    }
});
