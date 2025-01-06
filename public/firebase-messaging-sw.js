/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

// import environment from '../src/environment';

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

// Initialize Firebase app
firebase.initializeApp(defaultConfig);
const messaging = firebase.messaging();

//Listens for background notifications
messaging.onBackgroundMessage(payload => {
  //customise notification
  const notificationTitle = payload?.data?.title;
  const link = payload?.data.link;
  let url = 'https://app.purringchat.io';
  if (link) {
    if (typeof environment !== 'undefined' && environment.domainName) {
      url === link.includes('localhost:4200')
        ? (url = link.replace('localhost:4200', environment.domainName))
        : (url = link);
    } else {
      console.error('Environment domain name is not defined');
      url = link; // Fallback to original link if environment domain name is not available
    }
  }
  const notificationOptions = {
    body: payload?.data?.body,
    icon: payload?.data?.icon || '/pwa-512x512.png',
    data: { link: url },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Close the notification

  let url = event.notification.data.link; // Get the URL from notification data
  if (!url) url = 'https://app.purringchat.io';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, then open a new window/tab with the target URL
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
