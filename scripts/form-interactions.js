// scripts/form-interactions.js
document.addEventListener("DOMContentLoaded", function () {
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

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                showMessage(contactForm, 'Please fill in all fields', true);
                return;
            }

            if (!validateEmail(email)) {
                showMessage(contactForm, 'Please enter a valid email address', true);
                return;
            }

            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            showMessage(contactForm, 'Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter Subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email-address');
            const email = emailInput.value.trim();

            if (!email) {
                showMessage(newsletterForm, 'Please enter an email address', true);
                return;
            }

            if (!validateEmail(email)) {
                showMessage(newsletterForm, 'Please enter a valid email address', true);
                return;
            }

            // Here you would typically send the email to a newsletter service
            showMessage(newsletterForm, 'Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
});