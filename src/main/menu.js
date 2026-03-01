'use strict';

const { app, Menu, shell, BrowserWindow, dialog } = require('electron');
const log = require('electron-log');
const store = require('./store');
const { setQuitting } = require('./tray');
const AutoLaunch = require('electron-auto-launch');

const autoLauncher = new AutoLaunch({ name: 'Messages' });

const isDev = process.env.NODE_ENV === 'development';

/**
 * Build and set the application menu.
 * @param {BrowserWindow} win  Main window reference.
 */
function buildMenu(win) {
    const template = [
        // ── File ──────────────────────────────────────────────────────────────
        {
            label: 'File',
            submenu: [
                {
                    label: 'Hide to Tray',
                    accelerator: 'Ctrl+W',
                    click: () => {
                        win.hide();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Ctrl+Q',
                    click: () => {
                        setQuitting(true);
                        app.quit();
                    }
                }
            ]
        },

        // ── Edit ──────────────────────────────────────────────────────────────
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Ctrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'Ctrl+Shift+Z', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Ctrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'Ctrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'Ctrl+V', role: 'paste' },
                { label: 'Select All', accelerator: 'Ctrl+A', role: 'selectAll' }
            ]
        },

        // ── View ──────────────────────────────────────────────────────────────
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Ctrl+R',
                    click: () => {
                        win.webContents.reload();
                    }
                },
                {
                    label: 'Force Reload',
                    accelerator: 'Ctrl+Shift+R',
                    click: () => {
                        win.webContents.reloadIgnoringCache();
                    }
                },
                ...(isDev
                    ? [
                        {
                            label: 'Toggle DevTools',
                            accelerator: 'F12',
                            click: () => {
                                win.webContents.toggleDevTools();
                            }
                        }
                    ]
                    : []),
                { type: 'separator' },
                {
                    label: 'Zoom In',
                    accelerator: 'Ctrl+Plus',
                    click: () => {
                        const current = win.webContents.getZoomFactor();
                        const next = Math.min(current + 0.1, 3.0);
                        win.webContents.setZoomFactor(next);
                        store.set('zoomFactor', next);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'Ctrl+-',
                    click: () => {
                        const current = win.webContents.getZoomFactor();
                        const next = Math.max(current - 0.1, 0.5);
                        win.webContents.setZoomFactor(next);
                        store.set('zoomFactor', next);
                    }
                },
                {
                    label: 'Reset Zoom',
                    accelerator: 'Ctrl+0',
                    click: () => {
                        win.webContents.setZoomFactor(1.0);
                        store.set('zoomFactor', 1.0);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Toggle Fullscreen',
                    accelerator: 'F11',
                    click: () => {
                        win.setFullScreen(!win.isFullScreen());
                    }
                }
            ]
        },

        // ── Window ────────────────────────────────────────────────────────────
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Super+H',
                    click: () => win.minimize()
                },
                {
                    label: 'Close',
                    accelerator: 'Alt+F4',
                    click: () => win.hide() // hide to tray, not quit
                }
            ]
        },

        // ── Settings ──────────────────────────────────────────────────────────
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Launch at Login',
                    type: 'checkbox',
                    checked: store.get('launchAtLogin'),
                    click: async (menuItem) => {
                        const enabled = menuItem.checked;
                        store.set('launchAtLogin', enabled);
                        try {
                            if (enabled) {
                                await autoLauncher.enable();
                            } else {
                                await autoLauncher.disable();
                            }
                            log.info('Auto-launch set to:', enabled);
                        } catch (err) {
                            log.error('Failed to set auto-launch:', err);
                            // Revert checkbox state on failure.
                            menuItem.checked = !enabled;
                            store.set('launchAtLogin', !enabled);
                        }
                    }
                }
            ]
        },

        // ── Help ──────────────────────────────────────────────────────────────
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About Messages',
                    click: () => {
                        dialog.showMessageBox(win, {
                            type: 'info',
                            title: 'About Messages',
                            message: 'Messages',
                            detail: [
                                `Version: ${app.getVersion()}`,
                                `Electron: ${process.versions.electron}`,
                                `Node: ${process.versions.node}`,
                                `Platform: ${process.platform} ${process.arch}`
                            ].join('\n'),
                            buttons: ['OK']
                        }).catch((err) => log.warn('About dialog error:', err));
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Google Messages on Web',
                    click: () => {
                        shell.openExternal('https://messages.google.com/web').catch((err) =>
                            log.error('shell.openExternal failed:', err)
                        );
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
}

module.exports = { buildMenu };
