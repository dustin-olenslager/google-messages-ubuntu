'use strict';

const Store = require('electron-store');

// Schema defines defaults and types for all persisted settings.
// electron-store validates against this on read/write.
const schema = {
    windowBounds: {
        type: 'object',
        properties: {
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number', default: 1280 },
            height: { type: 'number', default: 800 }
        },
        default: { width: 1280, height: 800 }
    },
    windowMaximized: {
        type: 'boolean',
        default: false
    },
    launchAtLogin: {
        type: 'boolean',
        default: false
    },
    zoomFactor: {
        type: 'number',
        default: 1.0
    }
};

const store = new Store({ schema, name: 'settings' });

module.exports = store;
