// Bloom Service Worker
const CACHE_NAME = 'bloom-v1';

self.addEventListener('install', e => {
self.skipWaiting();
});

self.addEventListener('activate', e => {
e.waitUntil(clients.claim());
});

// Handle notification click
self.addEventListener('notificationclick', e => {
e.notification.close();
e.waitUntil(
clients.matchAll({ type: 'window' }).then(clientList => {
if (clientList.length > 0) {
return clientList[0].focus();
}
return clients.openWindow('/');
})
);
});

// Listen for messages from the app
self.addEventListener('message', e => {
if (e.data && e.data.type === 'SCHEDULE_REMINDER') {
scheduleCheck(e.data.schedule);
}
});

// Check every minute if it's time to fire a reminder
let checkInterval = null;

function scheduleCheck(schedule) {
if (checkInterval) clearInterval(checkInterval);

checkInterval = setInterval(() => {
const now = new Date();
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const todayKey = days[now.getDay()];
const cfg = schedule[todayKey];

if (!cfg || !cfg.on) return;

const [h, m] = cfg.time.split(':').map(Number);
if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() < 60) {
const lastFired = schedule._lastFired;
const todayStr = now.toDateString();

if (lastFired !== todayStr) {
schedule._lastFired = todayStr;
self.registration.showNotification('🌸 Time to Bloom!', {
body: 'Your study session is ready. Open Bloom and start where you left off.',
icon: '/icon.svg',
badge: '/icon.svg',
tag: 'bloom-reminder',
renotify: true,
requireInteraction: false,
vibrate: [200, 100, 200],
});
}
}
}, 30000); // check every 30 seconds
}

