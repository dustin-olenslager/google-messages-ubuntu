# Google Messages for Linux

> A native-feeling Google Messages desktop app for Ubuntu, Debian, and other Linux distributions — built with Electron.

Use Google Messages (RCS, SMS, MMS) on your Linux desktop with full system integration: notifications, system tray, protocol handlers, and persistent sessions.

[![Platform](https://img.shields.io/badge/platform-Linux-blue?logo=linux)](https://github.com/dustin-olenslager/google-messages-ubuntu)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Electron](https://img.shields.io/badge/electron-29-47848f?logo=electron)](https://www.electronjs.org/)

---

## Why This Exists

Google Messages has no official Linux client. The web app at [messages.google.com](https://messages.google.com) works, but you lose:

- System notifications that integrate with GNOME / KDE
- A persistent dock/tray icon with unread count
- Window state memory between sessions
- `sms://` and `tel://` deep link handling from other apps
- Launch-on-login support

This app wraps the official Google Messages web interface and wires it into your Linux desktop properly.

---

## Features

- **RCS & SMS** — Full Google Messages experience via the official web interface
- **System Tray** — Persistent tray icon with unread badge count in tooltip
- **Native Notifications** — Bridges web `Notification` API to native Linux notifications; clicking a notification focuses the app
- **Persistent Session** — Stays paired to your Android phone between launches; no re-scanning QR codes
- **Launch on Login** — Optional auto-start via Settings menu
- **Protocol Handlers** — Registers as the default handler for `sms://` and `tel://` URIs
- **Single Instance** — Second launch focuses the existing window instead of opening a duplicate
- **Hide to Tray** — Closing the window minimizes to tray; app keeps running in the background
- **Keyboard Shortcuts** — `Ctrl+Q` quit, `Ctrl+W` hide to tray, `Ctrl+R` reload, `F12` DevTools
- **Right-Click Menu** — Context menu with Cut / Copy / Paste / Reload
- **Secure by Default** — `contextIsolation`, `sandbox`, no `nodeIntegration` in the webview
- **Crash Logs** — Structured logs written to `~/.config/Messages/logs/` via `electron-log`
- **Offline Detection** — Detects network loss and auto-retries on reconnect

---

## Installation

### Option 1 — .deb package (Ubuntu / Debian / Zorin OS / Pop!_OS)

Download the latest `.deb` from [Releases](https://github.com/dustin-olenslager/google-messages-ubuntu/releases) and install:

```bash
sudo dpkg -i google-messages-ubuntu_*.deb
```

Launch from your app drawer as **Messages**, or run:

```bash
google-messages-ubuntu
```

### Option 2 — AppImage (any Linux distro)

Download the `.AppImage` from [Releases](https://github.com/dustin-olenslager/google-messages-ubuntu/releases):

```bash
chmod +x Messages-*.AppImage
./Messages-*.AppImage
```

### Option 3 — Build from source

Requirements: Node.js 18+, npm

```bash
git clone https://github.com/dustin-olenslager/google-messages-ubuntu.git
cd google-messages-ubuntu
npm install
npm start                  # run in development mode
npm run build:deb          # build .deb package
npm run build:appimage     # build AppImage
```

---

## Usage

1. Launch the app — it opens [messages.google.com](https://messages.google.com)
2. On your Android phone, open **Google Messages → Device pairing**
3. Scan the QR code in the app
4. You're connected — your session persists between launches

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Q` | Quit the app |
| `Ctrl+W` | Hide to system tray |
| `Ctrl+R` | Reload the page |
| `F12` | Toggle DevTools (dev mode only) |

---

## Compatibility

| Distribution | Status |
|---|---|
| Ubuntu 22.04 LTS | ✅ Tested |
| Ubuntu 24.04 LTS | ✅ Tested |
| Zorin OS 18 | ✅ Tested |
| Debian 12 | ✅ Should work |
| Pop!_OS 22.04 | ✅ Should work |
| Fedora (via AppImage) | ✅ Should work |
| Arch Linux (via AppImage) | ✅ Should work |

Requires a desktop session (X11 or Wayland via XWayland). Not suitable for headless servers.

---

## Privacy & Security

- All communication goes directly between the app and Google's servers — no third-party relay
- No data is collected by this app
- Credentials (your Google session) are stored locally in `~/.config/Messages/` using Electron's default session storage
- Webview runs with `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`
- External links open in your system browser, not inside the app

---

## Known Limitations

- **RCS message editing** — Feature availability is controlled by Google's servers, not this app
- **Multi-account** — One Google account per instance (same as the web app)
- **App badge count** — GNOME taskbar badge requires a supported shell extension

---

## Configuration

Window size, position, zoom level, and maximized state are persisted automatically to `~/.config/Messages/settings.json`.

App logs are written to `~/.config/Messages/logs/`.

---

## Contributing

Pull requests welcome. Please open an issue first for significant changes.

```bash
git clone https://github.com/dustin-olenslager/google-messages-ubuntu.git
cd google-messages-ubuntu
npm install
npm run dev    # hot reload / DevTools enabled
```

---

## Related Projects

Looking for Google Messages on other platforms?

- **macOS** — [Google Messages for Desktop](https://github.com/nicholasstephan/google-messages-desktop) (community app)
- **Windows** — Use the [Windows Subsystem for Android](https://learn.microsoft.com/en-us/windows/android/wsa/) or [Phone Link](https://www.microsoft.com/en-us/windows/sync-across-devices)
- **Web** — [messages.google.com](https://messages.google.com) (official, browser-based)
- **Android** — [Google Messages](https://play.google.com/store/apps/details?id=com.google.android.apps.messaging) (official app)

---

## License

MIT — see [LICENSE](LICENSE) for details.

This project is not affiliated with, endorsed by, or supported by Google LLC. Google Messages and related marks are trademarks of Google LLC.
