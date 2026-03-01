#!/usr/bin/env node
/**
 * generate-icons.js
 *
 * Generates PNG icon files at standard Linux icon sizes from an SVG source.
 * Requires: imagemagick (convert) or inkscape — falls back between them.
 *
 * Usage: node scripts/generate-icons.js
 *
 * Output: assets/icons/{16,32,48,64,128,256,512}.png
 */

'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SVG_SRC = path.join(ROOT, 'assets', 'icons', 'icon.svg');
const ICONS_DIR = path.join(ROOT, 'assets', 'icons');
const SIZES = [16, 32, 48, 64, 128, 256, 512];

if (!fs.existsSync(SVG_SRC)) {
    console.error(`SVG source not found: ${SVG_SRC}`);
    console.error('Place your icon.svg in assets/icons/ and re-run this script.');
    process.exit(1);
}

fs.mkdirSync(ICONS_DIR, { recursive: true });

// Detect available converter.
function hasCommand(cmd) {
    const result = spawnSync('which', [cmd], { encoding: 'utf8' });
    return result.status === 0;
}

const useInkscape = hasCommand('inkscape');
const useConvert = hasCommand('convert');

if (!useInkscape && !useConvert) {
    console.error('Neither inkscape nor imagemagick (convert) found.');
    console.error('Install with: sudo apt install inkscape  OR  sudo apt install imagemagick');
    process.exit(1);
}

for (const size of SIZES) {
    const outPath = path.join(ICONS_DIR, `${size}.png`);

    try {
        if (useInkscape) {
            execSync(
                `inkscape --export-type=png --export-filename="${outPath}" -w ${size} -h ${size} "${SVG_SRC}"`,
                { stdio: 'pipe' }
            );
        } else {
            execSync(
                `convert -background none -resize ${size}x${size} "${SVG_SRC}" "${outPath}"`,
                { stdio: 'pipe' }
            );
        }
        console.log(`  ✓ ${size}x${size} → ${outPath}`);
    } catch (err) {
        console.error(`  ✗ Failed to generate ${size}x${size}:`, err.message);
    }
}

console.log('\nIcon generation complete.');
