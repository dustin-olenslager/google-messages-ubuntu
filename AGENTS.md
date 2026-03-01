# AGENTS.md — Google Messages Ubuntu (Electron)

## Project
Electron desktop wrapper for https://messages.google.com/web targeting Linux (Zorin OS 18 / Ubuntu 24.04, GNOME).

## Stack
- Electron (latest stable)
- Node LTS
- CommonJS (main process)
- electron-store: window state + settings persistence
- electron-log: file logging
- electron-builder: AppImage + deb distribution
- electron-auto-launch: login startup option

## Architecture
```
src/main/       — main process modules (Node/Electron)
src/renderer/   — renderer-side HTML/JS (error page)
assets/icons/   — PNG icon sizes (16–512)
```

## Key Decisions
- CommonJS throughout (ESM has friction with Electron main process tooling)
- Persistent session via `partition: 'persist:messages'` — keeps auth across launches
- UA spoofed to current Chrome Linux — prevents Google degrading the experience
- Native Notification bridge via preload contextBridge — renderer calls `window.electronNotify`
- On window close → hide to tray; only tray Quit / Ctrl+Q actually exits
- Single instance lock enforced; second launch focuses existing window
- All non-messages.google.com navigations → shell.openExternal
- `backgroundThrottling: false` — ensures notifications fire while window hidden
- contextIsolation + sandbox + no nodeIntegration on webview

## Known Issues / Decisions Log
- Auto-updater: stubbed only (hook comment in main.js) — not implemented
- DevTools only available when NODE_ENV=development

## Conventions
- Explicit try/catch on all async Electron ops
- electron-log writes to ~/.config/Messages/logs/
- CHANGELOG.md tracks all changes
