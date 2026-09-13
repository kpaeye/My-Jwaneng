/* =========================================================
   MY JWANENG SERVICE WORKER
   PWA CACHE + FIREBASE CLOUD MESSAGING
   ========================================================= */

const CACHE_NAME = "myjwaneng-cache-v3";


/* =========================================================
   CORE FILES
   =========================================================
   Only include files that are known to exist.

   PWA icons are intentionally NOT included.
   We will handle MyTown360 branding/icons later.
========================================================= */

const urlsToCache = [
    "/",
    "/index.html",
    "/jobs.html",
    "/news.html",
    "/admin.html",
    "/manifest.json"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", function(event) {

    console.log("[My Jwaneng SW] Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function(cache) {

                /*
                   Cache files individually instead of using
                   cache.addAll().

                   This prevents one missing file from
                   cancelling the entire installation.
                */

                return Promise.all(

                    urlsToCache.map(function(url) {

                        return cache.add(url)

                            .then(function() {

                                console.log(
                                    "[My Jwaneng SW] Cached:",
                                    url
                                );

                            })

                            .catch(function(error) {

                                console.warn(
                                    "[My Jwaneng SW] Could not cache:",
                                    url,
                                    error
                                );

                                /*
                                   Continue installing even if
                                   an optional page is missing.
                                */

                                return null;

                            });

                    })

                );

            })

            .then(function() {

                console.log(
                    "[My Jwaneng SW] Core cache installation complete."
                );

                return self.skipWaiting();

            })

            .catch(function(error) {

                console.error(
                    "[My Jwaneng SW] Installation error:",
                    error
                );

            })

    );

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", function(event) {

    console.log("[My Jwaneng SW] Activated.");

    event.waitUntil(

        caches.keys()

            .then(function(cacheNames) {

                return Promise.all(

                    cacheNames

                        .filter(function(cacheName) {

                            return (
                                cacheName !== CACHE_NAME &&
                                cacheName.startsWith(
                                    "myjwaneng-cache-"
                                )
                            );

                        })

                        .map(function(cacheName) {

                            console.log(
                                "[My Jwaneng SW] Removing old cache:",
                                cacheName
                            );

                            return caches.delete(cacheName);

                        })

                );

            })

            .then(function() {

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", function(event) {

    const request = event.request;


    /*
       Only handle GET requests.
    */

    if (request.method !== "GET") {
        return;
    }


    const requestUrl = new URL(request.url);


    /*
       Do not interfere with external requests.

       Supabase
       Firebase
       Google Fonts
       Open-Meteo
       CDN resources

       should continue using the network.
    */

    if (
        requestUrl.origin !== self.location.origin
    ) {

        return;

    }


    /* =====================================================
       NAVIGATION REQUESTS
       Network first, cache fallback.
    ===================================================== */

    if (request.mode === "navigate") {

        event.respondWith(

            fetch(request)

                .then(function(response) {

                    if (
                        response &&
                        response.ok
                    ) {

                        const responseClone =
                            response.clone();

                        caches.open(CACHE_NAME)

                            .then(function(cache) {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });

                    }

                    return response;

                })

                .catch(function() {

                    return caches.match(request)

                        .then(function(cachedResponse) {

                            return (
                                cachedResponse ||
                                caches.match("/index.html")
                            );

                        });

                })

        );

        return;

    }


    /* =====================================================
       STATIC FILES
       Cache first, network fallback.
    ===================================================== */

    event.respondWith(

        caches.match(request)

            .then(function(cachedResponse) {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(function(response) {

                        if (
                            response &&
                            response.ok &&
                            response.type === "basic"
                        ) {

                            const responseClone =
                                response.clone();

                            caches.open(CACHE_NAME)

                                .then(function(cache) {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                });

                        }

                        return response;

                    })

                    .catch(function(error) {

                        console.warn(
                            "[My Jwaneng SW] Network request failed:",
                            request.url,
                            error
                        );

                        /*
                           Return a normal failed response rather
                           than breaking the entire service worker.
                        */

                        throw error;

                    });

            })

    );

});


/* =========================================================
   FIREBASE CLOUD MESSAGING
========================================================= */

importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js"
);


/* =========================================================
   FIREBASE CONFIG
========================================================= */

firebase.initializeApp({

    apiKey:
        "AIzaSyACs94wRK3_KJIOB1zPz5d14zDBc10cxPM",

    authDomain:
        "myjwaneng.firebaseapp.com",

    projectId:
        "myjwaneng",

    storageBucket:
        "myjwaneng.firebasestorage.app",

    messagingSenderId:
        "849209313231",

    appId:
        "1:849209313231:web:619775720fa9b0f2ff74ba",

    measurementId:
        "G-VE9Z3FR118"

});


/* =========================================================
   FIREBASE MESSAGING
========================================================= */

const messaging = firebase.messaging();


/* =========================================================
   BACKGROUND MESSAGE HANDLER
========================================================= */

messaging.onBackgroundMessage(function(payload) {

    console.log(
        "[My Jwaneng SW] Background message:",
        payload
    );


    /*
       If Firebase sends a notification payload,
       the browser/Firebase can display it automatically.

       Do not manually display it again.
    */

    if (
        payload.notification &&
        payload.notification.title
    ) {

        return;

    }


    const data =
        payload.data || {};


    const title =
        data.title ||
        "My Jwaneng";


    const body =
        data.body ||
        "There is a new update from My Jwaneng.";


    /*
       No custom icon for now.

       We deliberately do NOT reference:
       /icons/icon-192.png
    */

    const url =
        data.url ||
        "https://myjwaneng.co.bw/";


    const notificationOptions = {

        body: body,

        tag:
            data.tag ||
            "myjwaneng-notification",

        renotify: true,

        data: {

            url: url

        }

    };


    return self.registration.showNotification(

        title,

        notificationOptions

    );

});


/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener(
    "notificationclick",
    function(event) {

        console.log(
            "[My Jwaneng SW] Notification clicked."
        );


        event.notification.close();


        const notificationData =
            event.notification.data || {};


        const targetUrl =
            notificationData.url ||
            "https://myjwaneng.co.bw/";


        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled: true

            })

            .then(function(clientList) {

                /*
                   If My Jwaneng is already open,
                   focus it and navigate to the
                   notification destination.
                */

                for (
                    const client of clientList
                ) {

                    if (
                        client.url.startsWith(
                            "https://myjwaneng.co.bw"
                        ) &&
                        "focus" in client
                    ) {

                        return client.focus()

                            .then(function() {

                                if (
                                    "navigate" in client
                                ) {

                                    return client.navigate(
                                        targetUrl
                                    );

                                }

                            });

                    }

                }


                /*
                   Otherwise open a new window.
                */

                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        targetUrl
                    );

                }

            })

        );

    }
);