document.addEventListener("DOMContentLoaded", function () {
    const offerMenuItem = document.getElementById("offer-link");
    const emailInput = document.getElementById("email-address");
    const footerSection = document.getElementById("footer-section");

    if (offerMenuItem && footerSection && emailInput) {
        offerMenuItem.addEventListener("click", function (event) {
            event.preventDefault();
            footerSection.scrollIntoView({ behavior: "smooth", block: "center" });

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
});
