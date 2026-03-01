'use strict';

/**
 * error.js — Renderer script for the error/offline page.
 *
 * Reads error details from URL query params and renders them.
 * Communicates with main process via window.electronAPI (contextBridge).
 */

(function () {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('code') || '';
    const errorDesc = params.get('desc') || '';

    const subtitleEl = document.getElementById('subtitle-text');
    const detailEl = document.getElementById('error-detail');
    const detailsBtn = document.getElementById('details-btn');
    const retryBtn = document.getElementById('retry-btn');
    const statusBanner = document.getElementById('status-banner');

    // ── Render error details ─────────────────────────────────────────────────
    if (errorDesc && errorDesc !== 'Unknown error') {
        const codeStr = errorCode ? `[${errorCode}] ` : '';
        detailEl.textContent = codeStr + errorDesc;

        // Specific messaging for common codes.
        if (errorCode === '-2' || errorCode === '-105') {
            subtitleEl.textContent = 'No internet connection. Connect to a network and try again.';
            showOfflineBanner();
        }
    }

    // ── Toggle details panel ─────────────────────────────────────────────────
    let detailsVisible = false;
    detailsBtn.addEventListener('click', () => {
        detailsVisible = !detailsVisible;
        detailEl.classList.toggle('visible', detailsVisible);
        detailsBtn.textContent = detailsVisible ? 'Hide Details' : 'Show Details';
    });

    // ── Retry button ─────────────────────────────────────────────────────────
    retryBtn.addEventListener('click', () => {
        retryBtn.disabled = true;
        retryBtn.textContent = 'Retrying…';

        if (window.electronAPI && window.electronAPI.reload) {
            window.electronAPI.reload();
        } else {
            // Fallback: direct location reload (will re-navigate to messages.google.com
            // because main catches did-fail-load and routes here; going back works
            // only if there's history, so we use the IPC path primarily).
            window.location.href = 'https://messages.google.com/web';
        }

        // Re-enable after 3s in case reload fails silently.
        setTimeout(() => {
            retryBtn.disabled = false;
            retryBtn.textContent = 'Try Again';
        }, 3000);
    });

    // ── Network status listener ───────────────────────────────────────────────
    if (window.electronAPI && window.electronAPI.onOnlineStatus) {
        window.electronAPI.onOnlineStatus((isOnline) => {
            if (isOnline) {
                showOnlineBanner();
                // Auto-retry after brief delay.
                setTimeout(() => {
                    if (window.electronAPI && window.electronAPI.reload) {
                        window.electronAPI.reload();
                    }
                }, 1500);
            } else {
                showOfflineBanner();
            }
        });
    }

    function showOfflineBanner() {
        statusBanner.textContent = '● No internet connection detected';
        statusBanner.className = 'status-banner offline';
    }

    function showOnlineBanner() {
        statusBanner.textContent = '● Connection restored — reloading…';
        statusBanner.className = 'status-banner online';
    }
})();
