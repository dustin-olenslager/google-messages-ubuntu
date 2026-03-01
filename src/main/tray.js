'use strict';

const { Tray, Menu, nativeImage, app, ipcMain } = require('electron');
const path = require('path');
const log = require('electron-log');

let tray = null;
let mainWindow = null;
let currentUnreadCount = 0;
// Track whether the app is quitting so tray click doesn't fight quit sequence.
let isQuitting = false;

// Icon paths — generated PNGs in assets/icons/
const ICON_DIR = path.join(__dirname, '..', '..', 'assets', 'icons');
const ICON_PATH = path.join(ICON_DIR, '48.png');

function getIcon() {
    try {
        return nativeImage.createFromPath(ICON_PATH);
    } catch (err) {
        log.warn('Tray icon not found at', ICON_PATH, '— using empty image');
        return nativeImage.createEmpty();
    }
}

function buildContextMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Open Messages',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);
}

function updateTooltip() {
    if (!tray) return;
    const label = currentUnreadCount > 0
        ? `Messages (${currentUnreadCount} unread)`
        : 'Messages';
    tray.setToolTip(label);
}

/**
 * Create and configure the system tray icon.
 * @param {BrowserWindow} win  The main application window.
 * @param {object} opts
 * @param {function} opts.onQuit  Called when user selects Quit from tray.
 */
function createTray(win, { onQuit }) {
    mainWindow = win;

    tray = new Tray(getIcon());
    tray.setToolTip('Messages');
    tray.setContextMenu(buildContextMenu());

    // Single click toggles window visibility.
    tray.on('click', () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible() && mainWindow.isFocused()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // Listen for badge update events from IPC.
    ipcMain.on('badge:update', (event, count) => {
        currentUnreadCount = typeof count === 'number' ? count : 0;
        updateTooltip();
        // Rebuild context menu to reflect count in tooltip; menu itself is static.
        tray.setContextMenu(buildContextMenu());

        // On Linux, nativeImage overlay badges aren't natively supported by all
        // desktop environments. We use the tooltip as the primary indicator.
        // GNOME/Unity launcher badge via app.setBadgeCount is handled in ipc.js.
    });

    return tray;
}

function isAppQuitting() {
    return isQuitting;
}

function setQuitting(val) {
    isQuitting = val;
}

function destroyTray() {
    if (tray) {
        tray.destroy();
        tray = null;
    }
}

module.exports = { createTray, isAppQuitting, setQuitting, destroyTray };
