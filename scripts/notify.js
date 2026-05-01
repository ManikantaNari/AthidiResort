import { EMAILJS_CONFIG, NTFY_TOPIC, OWNER_EMAIL, RESORT_PHONE } from './config.js';
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm';

let emailjsReady = false;

export function initNotifications() {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    emailjsReady = true;
}

// Called when a new booking is submitted — notifies admin
export async function notifyAdminNewBooking(booking) {
    const msg = [
        `🏨 New ${booking.type} Booking`,
        `👤 ${booking.name}`,
        `📞 ${booking.phone}`,
        `📅 Check-in: ${booking.checkIn}`,
        booking.checkOut ? `📅 Check-out: ${booking.checkOut}` : '',
        booking.guests ? `👥 Guests: ${booking.guests}` : '',
        booking.roomType ? `🛏 Room: ${booking.roomType}` : '',
        booking.specialRequests ? `💬 Note: ${booking.specialRequests}` : ''
    ].filter(Boolean).join('\n');

    // ntfy.sh — free push notification to admin's phone
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        body: msg,
        headers: {
            'Title': '🏨 New Booking — Athidhi Resort',
            'Priority': 'high',
            'Tags': 'hotel,tada'
        }
    }).catch(e => console.warn('ntfy failed:', e));

    // EmailJS — email to admin as backup with link to admin panel
    if (emailjsReady && booking.adminLink) {
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.bookingTemplateId, {
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
            admin_link: booking.adminLink
        }).catch(e => console.warn('Admin email failed:', e));
    }
}

// Called when admin confirms a booking — notifies guest
export async function notifyGuestConfirmation(booking) {
    if (!emailjsReady || !booking.email) return;
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.guestConfirmTemplateId, {
        to_email: booking.email,
        guest_name: booking.name,
        booking_type: booking.type,
        check_in: booking.checkIn,
        check_out: booking.checkOut || 'N/A',
        price: booking.price ? `₹${booking.price}` : 'To be advised',
        admin_phone: RESORT_PHONE
    }).catch(e => console.warn('Guest confirmation email failed:', e));
}
