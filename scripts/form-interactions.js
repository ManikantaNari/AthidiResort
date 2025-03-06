// scripts/form-interactions.js
export function initFormInteractions() {
    const contactForm = document.querySelector(".contact-form form");
    const newsletterForm = document.querySelector("footer form");

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function showMessage(form, message, isError = false) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${isError ? 'error' : 'success'}`;
        messageEl.textContent = message;
        
        // Insert message
        form.insertBefore(messageEl, form.firstChild);
    }

    function highlightError(input, hasError) {
        if (hasError) {
            input.classList.add("error-border");
        } else {
            input.classList.remove("error-border");
        }
    }

    function clearMessageOnInput(form) {
        form.querySelectorAll("input, textarea").forEach((input) => {
            input.addEventListener("input", () => {
                // Remove error border
                input.classList.remove("error-border");

                // Remove the error message if it exists
                const existingMessage = form.querySelector(".form-message");
                if (existingMessage) {
                    existingMessage.remove();
                }
            });
        });
    }

    // Contact Form Submission
    if (contactForm) {
        clearMessageOnInput(contactForm);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            let hasError = false;

            // Basic validation with error highlighting
            if (!name) {
                highlightError(nameInput, true);
                hasError = true;
            } 

            if (!email || !validateEmail(email)) {
                highlightError(emailInput, true);
                hasError = true;
            } 

            if (!subject) {
                highlightError(subjectInput, true);
                hasError = true;
            } 

            if (!message) {
                highlightError(messageInput, true);
                hasError = true;
            } 

            if (hasError) {
                showMessage(contactForm, 'Please fill in all fields correctly', true);
                return;
            }

            // Success message
            showMessage(contactForm, 'Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter Subscription
    if (newsletterForm) {
        clearMessageOnInput(newsletterForm);

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email-address');
            const email = emailInput.value.trim();

            if (!email || !validateEmail(email)) {
                highlightError(emailInput, true);
                showMessage(newsletterForm, 'Please enter a valid email address', true);
                return;
            }

            // Success message
            showMessage(newsletterForm, 'Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
}