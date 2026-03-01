# CHANGELOG

All notable changes to this project.

Format: `Added | Changed | Fixed | Removed` — present tense, with commit hash when available.

---

## [1.0.0] — 2024-03-01

### Added
- Initial release — full Google Messages Electron wrapper for Linux
- Persistent session via `partition: 'persist:messages'` (auth survives restarts)
- Chrome Linux UA spoofing to prevent Google session degradation
- System tray with badge tooltip showing unread count
- Hide-to-tray on window close (only Quit from tray/Ctrl+Q exits)
- Native Linux notifications bridged from Web Notification API via preload
- Single-instance lock; second launch focuses existing window
- `sms://` and `tel://` protocol handler registration
- App menu: File, Edit, View, Window, Settings (auto-launch), Help
- Context menu: Cut/Copy/Paste, Reload, Inspect Element (dev only)
- Keyboard shortcuts: Ctrl+Q quit, Ctrl+W hide, Ctrl+R reload, F12 DevTools (dev)
- Network offline detection with auto-retry on restore
- Styled error/offline page with retry button
- Window state persistence (size, position, maximized) via electron-store
- Zoom level persistence
- `electron-log` file logging to `~/.config/Messages/logs/`
- AppImage + deb build targets via electron-builder
- SVG icon source + generation script (inkscape / imagemagick)
- Auto-launch toggle in Settings menu (electron-auto-launch)
