'use strict';

const { ipcMain, app, Notification, shell } = require('electron');
const log = require('electron-log');

// Holds a reference to the main window; set by main.js after window creation.
let mainWindow = null;

function setMainWindow(win) {
    mainWindow = win;
}

function registerHandlers() {
    // --- Notification bridge ---
    // Renderer sends this when a web Notification is intercepted by the preload.
    ipcMain.on('notification:show', (event, { title, body, icon, tag }) => {
        if (!Notification.isSupported()) {
            log.warn('Native notifications not supported on this system');
            return;
        }

        try {
            const notif = new Notification({
                title: title || 'Messages',
                body: body || '',
                // Electron's Notification icon expects a local path or data URL.
                // Google sends HTTPS icon URLs — we skip them to avoid async fetch
                // complexity; the app icon serves as implicit fallback on GNOME.
                silent: false
            });

            notif.on('click', () => {
                if (mainWindow) {
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.show();
                    mainWindow.focus();
                }
            });

            notif.show();
        } catch (err) {
            log.error('Failed to show native notification:', err);
        }
    });

    // --- Unread badge count ---
    // Preload sends updated count whenever page title changes.
    ipcMain.on('badge:update', (event, count) => {
        try {
            // GNOME doesn't support app.setBadgeCount on all versions but we try.
            // The tray module also reads this via a shared event.
            if (typeof app.setBadgeCount === 'function') {
                app.setBadgeCount(count);
            }
        } catch (err) {
            log.warn('setBadgeCount failed:', err);
        }
    });

    // --- External URL handler ---
    // Preload forwards URLs that should open in the system browser.
    ipcMain.on('open:external', (event, url) => {
        try {
            const parsed = new URL(url);
            // Only open http/https URLs externally; ignore anything else.
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                shell.openExternal(url).catch((err) => {
                    log.error('shell.openExternal failed:', err);
                });
            }
        } catch (err) {
            log.warn('Invalid URL passed to open:external:', url, err);
        }
    });

    // --- Protocol handler (sms://, tel://) ---
    ipcMain.on('protocol:url', (event, url) => {
        // Focus the window when a protocol URL is triggered.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
        log.info('Protocol URL received:', url);
    });
}

module.exports = { registerHandlers, setMainWindow };
