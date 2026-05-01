import { db, collection, addDoc, serverTimestamp } from './firebase.js';
import { initNotifications, notifyAdminNewBooking } from './notify.js';

export function initBooking() {
    initNotifications();

    // "Book Now" (header) + "Book Your Stay" (hero) → scroll to booking
    document.querySelectorAll('a.book-now, a.primary-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // "Book This Room" buttons in rooms section
    document.querySelectorAll('.book-room-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const roomType = btn.closest('.room-card')?.dataset.room;
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            if (roomType) {
                setTimeout(() => {
                    const roomSelect = document.getElementById('room-type');
                    if (roomSelect) roomSelect.value = roomType;
                }, 600);
            }
        });
    });

    // "Book This Offer" pool offer button
    document.querySelector('.offer-btn')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            document.getElementById('pool-booking-tab')?.click();
        }, 600);
    });

    const bookingBtn = document.querySelector('.book-widget .book-btn');
    if (!bookingBtn) return;

    bookingBtn.addEventListener('click', async () => {
        const activeTab = document.querySelector('.tab-item.active');
        const bookingType = activeTab?.textContent.trim() || 'Resort Stay';

        const name     = document.getElementById('booking-name')?.value.trim();
        const email    = document.getElementById('booking-email')?.value.trim();
        const phone    = document.getElementById('booking-phone')?.value.trim();
        const checkIn  = document.getElementById('check-in')?.value;
        const checkOut = document.getElementById('check-out')?.value;
        const guests   = document.getElementById('guests')?.value;
        const roomType = document.getElementById('room-type')?.value;
        const special  = document.getElementById('special-requests')?.value.trim();

        if (!name || !email || !phone || !checkIn) {
            showMsg('Please fill in Name, Email, Phone and Check-in date.', true);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMsg('Please enter a valid email address.', true);
            return;
        }

        setLoading(bookingBtn, true);

        try {
            const booking = {
                name, email, phone,
                type: bookingType,
                checkIn,
                checkOut: checkOut || '',
                guests: guests || '',
                roomType: roomType || '',
                specialRequests: special || '',
                status: 'pending',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'bookings'), booking);
            const adminLink = `${window.location.origin}/admin.html?booking=${docRef.id}`;
            notifyAdminNewBooking({ ...booking, id: docRef.id, adminLink }); // fire-and-forget

            showMsg('Booking request submitted! We will call you shortly to confirm and discuss pricing.', false);
            clearForm();
        } catch (err) {
            console.error('Booking error:', err);
            showMsg('Something went wrong. Please call us directly at +91 77308-32757.', true);
        } finally {
            setLoading(bookingBtn, false);
        }
    });
}

function showMsg(text, isError) {
    let el = document.getElementById('booking-message');
    if (!el) {
        el = document.createElement('div');
        el.id = 'booking-message';
        document.querySelector('.book-widget')?.appendChild(el);
    }
    el.textContent = text;
    el.className = `booking-msg ${isError ? 'error' : 'success'}`;
    if (!isError) setTimeout(() => { el.textContent = ''; el.className = ''; }, 9000);
}

function setLoading(btn, on) {
    btn.disabled = on;
    btn.textContent = on ? 'Submitting...' : 'Request Booking';
}

function clearForm() {
    ['booking-name', 'booking-email', 'booking-phone', 'check-in', 'check-out', 'special-requests']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const g = document.getElementById('guests');
    if (g) g.selectedIndex = 0;
}
