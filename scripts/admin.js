import {
    db, collection, doc, updateDoc,
    query, orderBy, onSnapshot, serverTimestamp
} from './firebase.js';
import { ADMIN_PIN } from './config.js';
import { initNotifications, notifyGuestConfirmation } from './notify.js';

// ── State ────────────────────────────────────────────────────────────────────
let pinEntry = '';
let allBookings = [];   // live cache for reports
let unsubscribers = []; // Firestore listeners to clean up on logout

// ── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
    initPinPad();
    initTabs();
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('refresh-bookings').addEventListener('click', () => {});
    document.getElementById('refresh-contacts').addEventListener('click', () => {});
    document.getElementById('refresh-subscribers').addEventListener('click', () => {});
});

// ── PIN Auth ─────────────────────────────────────────────────────────────────
function initPinPad() {
    document.querySelectorAll('.pin-key').forEach(key => {
        key.addEventListener('click', () => {
            const { digit, action } = key.dataset;
            if (digit !== undefined && pinEntry.length < 4) {
                pinEntry += digit;
                renderPin();
                if (pinEntry.length === 4) setTimeout(checkPin, 120);
            }
            if (action === 'back')  { pinEntry = pinEntry.slice(0, -1); renderPin(); }
            if (action === 'clear') { pinEntry = ''; renderPin(); }
        });
    });
}

function renderPin() {
    const display = document.getElementById('pin-display');
    display.textContent = ('●'.repeat(pinEntry.length) + '○'.repeat(4 - pinEntry.length)).split('').join(' ');
}

function checkPin() {
    if (pinEntry !== ADMIN_PIN) {
        document.getElementById('pin-error').textContent = 'Incorrect PIN. Try again.';
        pinEntry = '';
        renderPin();
        const card = document.querySelector('.login-card');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
        return;
    }
    document.getElementById('pin-error').textContent = '';
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    startRealtimeListeners();
}

function logout() {
    unsubscribers.forEach(fn => fn());
    unsubscribers = [];
    allBookings = [];
    pinEntry = '';
    renderPin();
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    resetPanels();
}

function resetPanels() {
    ['bookings-list', 'contacts-list', 'subscribers-list'].forEach(id => {
        document.getElementById(id).innerHTML =
            '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    });
    document.getElementById('report-body').innerHTML = '';
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
            if (tab.dataset.tab === 'reports') renderReports();
        });
    });
}

// ── Real-time Firestore Listeners ─────────────────────────────────────────────
function startRealtimeListeners() {
    const unsub1 = onSnapshot(
        query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
        snap => {
            allBookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderBookings(snap);
            updateBadge('bookings-count', snap.size);
            const activeTab = document.querySelector('.admin-tab.active');
            if (activeTab?.dataset.tab === 'reports') renderReports();
        },
        err => showListError('bookings-list', err)
    );

    const unsub2 = onSnapshot(
        query(collection(db, 'contacts'), orderBy('createdAt', 'desc')),
        snap => {
            renderContacts(snap);
            updateBadge('contacts-count', snap.size);
        },
        err => showListError('contacts-list', err)
    );

    const unsub3 = onSnapshot(
        query(collection(db, 'subscribers'), orderBy('createdAt', 'desc')),
        snap => {
            renderSubscribers(snap);
            updateBadge('subscribers-count', snap.size);
        },
        err => showListError('subscribers-list', err)
    );

    unsubscribers = [unsub1, unsub2, unsub3];
}

function updateBadge(id, count) {
    document.getElementById(id).textContent = count;
}

function showListError(listId, err) {
    console.error(err);
    document.getElementById(listId).innerHTML =
        `<div class="error-state">Failed to load. Check Firebase config.</div>`;
}

// ── Booking Rendering ─────────────────────────────────────────────────────────
function renderBookings(snap) {
    const list = document.getElementById('bookings-list');
    if (snap.empty) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No bookings yet.</p></div>';
        return;
    }
    list.innerHTML = '';
    snap.docs.forEach(d => list.appendChild(buildBookingCard(d.id, d.data())));
}

function buildBookingCard(id, data) {
    const card = document.createElement('div');
    card.className = `admin-card booking-card status-${data.status || 'pending'}`;
    card.id = `booking-${id}`;

    const isPending = data.status === 'pending';
    const isCancelled = data.status === 'cancelled';

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-user"></i>
                <strong>${esc(data.name)}</strong>
                <span class="booking-type-tag">${esc(data.type)}</span>
            </div>
            <span class="status-badge ${data.status}">${capitalize(data.status || 'pending')}</span>
        </div>
        <div class="card-body">
            <div class="card-field"><i class="fas fa-envelope"></i>${esc(data.email)}</div>
            <div class="card-field"><i class="fas fa-phone"></i>${esc(data.phone)}</div>
            <div class="card-field"><i class="fas fa-calendar-alt"></i>Check-in: <strong>${esc(data.checkIn)}</strong>${data.checkOut ? ` &nbsp;→&nbsp; Check-out: <strong>${esc(data.checkOut)}</strong>` : ''}</div>
            ${data.guests ? `<div class="card-field"><i class="fas fa-users"></i>${esc(data.guests)} Guests</div>` : ''}
            ${data.roomType ? `<div class="card-field"><i class="fas fa-bed"></i>${esc(data.roomType)}</div>` : ''}
            ${data.specialRequests ? `<div class="card-field"><i class="fas fa-comment-dots"></i>${esc(data.specialRequests)}</div>` : ''}
            ${data.price ? `<div class="card-field price-field"><i class="fas fa-indian-rupee-sign"></i>Price: <strong>₹${esc(String(data.price))}</strong></div>` : ''}
            <div class="card-date">${formatDate(data.createdAt)}</div>
        </div>
        ${isPending ? `
        <div class="card-actions" id="actions-${id}">
            <div class="price-entry-row">
                <div class="price-input-wrap">
                    <span class="rupee-prefix">₹</span>
                    <input type="number" class="price-input" id="price-${id}" placeholder="Enter price" min="0">
                </div>
                <button class="action-btn confirm-btn" onclick="confirmWithPrice('${id}')">
                    <i class="fas fa-check"></i> Confirm & Notify Guest
                </button>
            </div>
            <button class="action-btn cancel-btn" onclick="cancelBooking('${id}')">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>` : ''}
        ${isCancelled ? '' : ''}
    `;
    return card;
}

// ── Contact Rendering ─────────────────────────────────────────────────────────
function renderContacts(snap) {
    const list = document.getElementById('contacts-list');
    if (snap.empty) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No messages yet.</p></div>';
        return;
    }
    list.innerHTML = '';
    snap.docs.forEach(d => list.appendChild(buildContactCard(d.id, d.data())));
}

function buildContactCard(id, data) {
    const card = document.createElement('div');
    card.className = `admin-card contact-card ${data.read ? 'read' : 'unread'}`;
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fas fa-user"></i>
                <strong>${esc(data.name)}</strong>
                ${!data.read ? '<span class="unread-dot"></span>' : ''}
            </div>
            <span class="card-date">${formatDate(data.createdAt)}</span>
        </div>
        <div class="card-body">
            <div class="card-field"><i class="fas fa-envelope"></i>${esc(data.email)}</div>
            <div class="card-field subject"><i class="fas fa-tag"></i>${esc(data.subject)}</div>
            <div class="card-message">${esc(data.message)}</div>
        </div>
        ${!data.read ? `
        <div class="card-actions">
            <button class="action-btn read-btn" onclick="markRead('${id}', this)">
                <i class="fas fa-check-double"></i> Mark as Read
            </button>
        </div>` : ''}
    `;
    return card;
}

// ── Subscriber Rendering ──────────────────────────────────────────────────────
function renderSubscribers(snap) {
    const list = document.getElementById('subscribers-list');
    if (snap.empty) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-bell-slash"></i><p>No subscribers yet.</p></div>';
        return;
    }
    list.innerHTML = '';
    snap.docs.forEach(d => {
        const card = document.createElement('div');
        card.className = 'admin-card subscriber-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title"><i class="fas fa-at"></i><strong>${esc(d.data().email)}</strong></div>
                <span class="card-date">${formatDate(d.data().createdAt)}</span>
            </div>`;
        list.appendChild(card);
    });
}

// ── Reports ───────────────────────────────────────────────────────────────────
function renderReports() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthBookings = allBookings.filter(b => {
        if (!b.createdAt) return false;
        const d = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const confirmed  = monthBookings.filter(b => b.status === 'confirmed');
    const pending    = monthBookings.filter(b => b.status === 'pending');
    const cancelled  = monthBookings.filter(b => b.status === 'cancelled');
    const revenue    = confirmed.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

    const byType = { 'Resort Stay': [], 'Pool Booking': [], 'Events': [] };
    confirmed.forEach(b => {
        const key = b.type in byType ? b.type : 'Resort Stay';
        byType[key].push(b);
    });

    const monthName = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    document.getElementById('report-body').innerHTML = `
        <div class="report-month-label">${monthName}</div>

        <div class="report-stats-grid">
            <div class="report-stat-card total">
                <div class="rsc-icon"><i class="fas fa-calendar-check"></i></div>
                <div class="rsc-value">${monthBookings.length}</div>
                <div class="rsc-label">Total Bookings</div>
            </div>
            <div class="report-stat-card revenue">
                <div class="rsc-icon"><i class="fas fa-indian-rupee-sign"></i></div>
                <div class="rsc-value">₹${revenue.toLocaleString('en-IN')}</div>
                <div class="rsc-label">Total Revenue</div>
            </div>
            <div class="report-stat-card confirmed">
                <div class="rsc-icon"><i class="fas fa-check-circle"></i></div>
                <div class="rsc-value">${confirmed.length}</div>
                <div class="rsc-label">Confirmed</div>
            </div>
            <div class="report-stat-card pending">
                <div class="rsc-icon"><i class="fas fa-clock"></i></div>
                <div class="rsc-value">${pending.length}</div>
                <div class="rsc-label">Pending</div>
            </div>
            <div class="report-stat-card cancelled">
                <div class="rsc-icon"><i class="fas fa-times-circle"></i></div>
                <div class="rsc-value">${cancelled.length}</div>
                <div class="rsc-label">Cancelled</div>
            </div>
        </div>

        <h3 class="report-section-title">Revenue by Booking Type</h3>
        <div class="report-breakdown-grid">
            ${Object.entries(byType).map(([type, bookings]) => {
                const typeRevenue = bookings.reduce((s, b) => s + (Number(b.price) || 0), 0);
                const pct = revenue > 0 ? Math.round((typeRevenue / revenue) * 100) : 0;
                return `
                <div class="breakdown-card">
                    <div class="bc-type">${type}</div>
                    <div class="bc-count">${bookings.length} bookings</div>
                    <div class="bc-revenue">₹${typeRevenue.toLocaleString('en-IN')}</div>
                    <div class="bc-bar-wrap">
                        <div class="bc-bar" style="width:${pct}%"></div>
                    </div>
                    <div class="bc-pct">${pct}% of revenue</div>
                </div>`;
            }).join('')}
        </div>

        ${confirmed.length > 0 ? `
        <h3 class="report-section-title">Recent Confirmed Bookings</h3>
        <div class="report-table-wrap">
            <table class="report-table">
                <thead><tr>
                    <th>Guest</th><th>Type</th><th>Check-in</th><th>Price</th><th>Date</th>
                </tr></thead>
                <tbody>
                    ${confirmed.slice(0, 10).map(b => `
                    <tr>
                        <td>${esc(b.name)}</td>
                        <td><span class="booking-type-tag">${esc(b.type)}</span></td>
                        <td>${esc(b.checkIn)}</td>
                        <td class="price-cell">₹${(Number(b.price) || 0).toLocaleString('en-IN')}</td>
                        <td class="date-cell">${formatDate(b.createdAt)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>` : ''}
    `;
}

// ── Actions ───────────────────────────────────────────────────────────────────
window.confirmWithPrice = async (id) => {
    const priceInput = document.getElementById(`price-${id}`);
    const price = priceInput?.value.trim();
    if (!price || isNaN(price) || Number(price) <= 0) {
        priceInput?.classList.add('error-border');
        priceInput?.focus();
        return;
    }
    priceInput?.classList.remove('error-border');
    const btn = document.querySelector(`#actions-${id} .confirm-btn`);
    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

    try {
        await updateDoc(doc(db, 'bookings', id), {
            status: 'confirmed',
            price: Number(price),
            confirmedAt: serverTimestamp()
        });
        const booking = allBookings.find(b => b.id === id);
        if (booking) notifyGuestConfirmation({ ...booking, price: Number(price) });
    } catch (err) {
        console.error(err);
        alert('Failed to confirm. Please try again.');
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Notify Guest'; }
    }
};

window.cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
        await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
    } catch (err) {
        console.error(err);
        alert('Failed to cancel. Please try again.');
    }
};

window.markRead = async (id, btn) => {
    btn.disabled = true;
    try {
        await updateDoc(doc(db, 'contacts', id), { read: true });
    } catch (err) {
        console.error(err);
        btn.disabled = false;
    }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function formatDate(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}
