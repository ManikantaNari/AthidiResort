import { EMAILJS_CONFIG, NTFY_TOPIC, OWNER_EMAIL, RESORT_PHONE } from './config.js';

let emailjsReady = false;

export function initNotifications() {
    if (typeof window.emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded. Check the <script> tag in HTML.');
        return;
    }
    try {
        window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        emailjsReady = true;
        console.log('EmailJS initialized with public key:', EMAILJS_CONFIG.publicKey);
    } catch (e) {
        console.error('EmailJS init failed:', e);
    }
}

export async function notifyAdminNewBooking(booking) {
    const msg = [
        `New ${booking.type} Booking`,
        `${booking.name}`,
        `${booking.phone}`,
        `Check-in: ${booking.checkIn}`,
        booking.checkOut ? `Check-out: ${booking.checkOut}` : '',
        booking.guests ? `Guests: ${booking.guests}` : '',
        booking.roomType ? `Room: ${booking.roomType}` : '',
        booking.specialRequests ? `Note: ${booking.specialRequests}` : ''
    ].filter(Boolean).join('\n');

    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        body: msg,
        headers: {
            'Title': 'New Booking - Athidhi Resort',
            'Priority': 'high',
            'Tags': 'hotel,tada'
        }
    }).catch(e => console.warn('ntfy failed:', e));

    if (!emailjsReady) {
        console.warn('EmailJS not ready, skipping admin email');
        return;
    }

    const templateParams = {
        to_email: OWNER_EMAIL,
        guest_name: booking.name,
        guest_email: booking.email,
        guest_phone: booking.phone,
        booking_type: booking.type,
        check_in: booking.checkIn,
        check_out: booking.checkOut || 'N/A',
        guests: booking.guests || 'N/A',
        room_type: booking.roomType || 'N/A',
        special_requests: booking.specialRequests || 'None',
        admin_link: booking.adminLink || ''
    };

    console.log('Sending admin email with params:', JSON.stringify(templateParams, null, 2));

    try {
        const result = await window.emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.bookingTemplateId,
            templateParams
        );
        console.log('Admin email sent:', result.status, result.text);
    } catch (e) {
        console.error('Admin email FAILED:', e);
    }
}

export async function notifyGuestConfirmation(booking) {
    if (!emailjsReady) {
        console.warn('EmailJS not ready, skipping guest confirmation email');
        return;
    }
    if (!booking.email) {
        console.warn('No guest email, skipping confirmation');
        return;
    }

    const templateParams = {
        to_email: booking.email,
        guest_name: booking.name,
        booking_type: booking.type,
        check_in: booking.checkIn,
        check_out: booking.checkOut || 'N/A',
        price: booking.price ? `₹${booking.price}` : 'To be advised',
        admin_phone: RESORT_PHONE
    };

    console.log('Sending guest confirmation with params:', JSON.stringify(templateParams, null, 2));

    try {
        const result = await window.emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.guestConfirmTemplateId,
            templateParams
        );
        console.log('Guest confirmation email sent:', result.status, result.text);
    } catch (e) {
        console.error('Guest confirmation email FAILED:', e);
    }
}
