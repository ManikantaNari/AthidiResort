import { db, collection, addDoc, serverTimestamp } from './firebase.js';

export function initFormInteractions() {
    const contactForm = document.querySelector('.contact-form form');
    const newsletterForm = document.querySelector('footer form');

    function validateEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email).toLowerCase());
    }

    function showMessage(form, message, isError = false) {
        const existing = form.querySelector('.form-message');
        if (existing) existing.remove();
        const el = document.createElement('div');
        el.className = `form-message ${isError ? 'error' : 'success'}`;
        el.textContent = message;
        form.insertBefore(el, form.firstChild);
    }

    function highlightError(input, hasError) {
        input.classList.toggle('error-border', hasError);
    }

    function clearMessageOnInput(form) {
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error-border');
                form.querySelector('.form-message')?.remove();
            });
        });
    }

    // Contact Form
    if (contactForm) {
        clearMessageOnInput(contactForm);

        contactForm.addEventListener('submit', async function (e) {
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
            if (!name) { highlightError(nameInput, true); hasError = true; }
            if (!email || !validateEmail(email)) { highlightError(emailInput, true); hasError = true; }
            if (!subject) { highlightError(subjectInput, true); hasError = true; }
            if (!message) { highlightError(messageInput, true); hasError = true; }

            if (hasError) {
                showMessage(contactForm, 'Please fill in all fields correctly.', true);
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                await addDoc(collection(db, 'contacts'), {
                    name, email, subject, message,
                    read: false,
                    createdAt: serverTimestamp()
                });

                showMessage(contactForm, 'Thank you! We will get back to you within 24 hours.');
                contactForm.reset();
            } catch (err) {
                console.error('Contact form error:', err);
                showMessage(contactForm, 'Something went wrong. Please call us directly.', true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

    // Newsletter Subscription
    if (newsletterForm) {
        clearMessageOnInput(newsletterForm);

        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('email-address');
            const email = emailInput.value.trim();

            if (!email || !validateEmail(email)) {
                highlightError(emailInput, true);
                showMessage(newsletterForm, 'Please enter a valid email address.', true);
                return;
            }

            const subscribeBtn = newsletterForm.querySelector('button');
            subscribeBtn.disabled = true;
            subscribeBtn.textContent = 'Subscribing...';

            try {
                await addDoc(collection(db, 'subscribers'), {
                    email,
                    createdAt: serverTimestamp()
                });

                showMessage(newsletterForm, 'Thank you for subscribing!');
                emailInput.value = '';
            } catch (err) {
                console.error('Newsletter error:', err);
                showMessage(newsletterForm, 'Something went wrong. Please try again.', true);
            } finally {
                subscribeBtn.disabled = false;
                subscribeBtn.textContent = 'Subscribe';
            }
        });
    }

}