// ============================================================
// STEP 1: Paste your Firebase config
// Firebase Console → Project Settings → Your apps → Web app
// ============================================================
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAzWTJzyf3u9uZ7ufzOtSvni9LPZPhpGjQ",
    authDomain: "athidi-resort.firebaseapp.com",
    projectId: "athidi-resort",
    storageBucket: "athidi-resort.firebasestorage.app",
    messagingSenderId: "73834897384",
    appId: "1:73834897384:web:5b0b6cfe08bdf00bb40e5d",
    measurementId: "G-NCN9CVKHCB"
};

// ============================================================
// STEP 2: EmailJS credentials
// emailjs.com → Account → General → Public Key
// Create 2 templates:
//   bookingTemplateId      → variables: guest_name, guest_email, guest_phone,
//                            booking_type, check_in, check_out, guests, room_type, special_requests, admin_link
//   guestConfirmTemplateId → variables: guest_name, booking_type, check_in,
//                            check_out, price, admin_phone
// ============================================================
export const EMAILJS_CONFIG = {
    publicKey: "_BVzfw7k0ViuQRt3L",
    serviceId: "service_ia9akg3",
    bookingTemplateId: "template_gnfxmkd",
    guestConfirmTemplateId: "template_vwfv40j"
};

// ============================================================
// STEP 3: ntfy.sh push notifications (100% free, no sign-up)
// Admin: install "ntfy" app → subscribe to topic below
// iOS: https://apps.apple.com/app/ntfy/id1625396347
// Android: https://play.google.com/store/apps/details?id=io.heckel.ntfy
// ============================================================
export const NTFY_TOPIC = "athidhi-resort-7842220506"; // keep this private

// ============================================================
// STEP 4: Admin settings
// ============================================================
export const ADMIN_PIN = "1111";
export const OWNER_EMAIL = "shoppings.mani@gmail.com";
export const ADMIN_PHONES = ["+917842220506"]; // add more numbers here

// Resort contact details (shown on the site)
export const RESORT_PHONE = "+91 77308-32757";
