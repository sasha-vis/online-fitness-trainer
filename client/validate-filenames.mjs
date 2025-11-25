//#!/usr/bin/env node
import fg from 'fast-glob';
import { basename, extname } from 'node:path';

const IS_WINDOWS = process.platform === 'win32';

// Normalize path separator for display (optional)
function normalizePath(p) {
    return IS_WINDOWS ? p.replace(/\\/g, '/') : p;
}

/**
 * Strip .module from CSS stems
 */
function getCssBaseName(filename) {
    const ext = extname(filename);
    let base = basename(filename, ext);

    if (base.endsWith('.module')) {
        base = base.slice(0, -7);
    }

    return base;
}

/**
 * Strict kebab-case: lowercase, digits, hyphens (no leading/trailing/consecutive hyphens)
 */
function isKebabCase(str) {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

/**
 * Should we ignore this name?
 */
function shouldIgnoreFile(base) {
    return base === 'index';
}

function shouldIgnoreDir(name) {
    return [
        'node_modules',
        'dist',
        '__tests__',
        '__test__',
        '.git',
        '.vite',
        'public',
        'assets',
    ].includes(name);
}

let hasError = false;

function reportError(message) {
    console.error(`❌ ${message}`);
    hasError = true;
}

async function validate() {
    console.time('🔍 Filename & folder linting');

    // 👉 1. Get ALL directories under src/
    const dirs = await fg('src/**/', { onlyDirectories: true, dot: false });

    for (const dir of dirs) {
        const dirName = basename(dir.replace(/[/\\]$/, '')); // remove trailing slash

        if (!shouldIgnoreDir(dirName) && !isKebabCase(dirName)) {
            reportError(`${normalizePath(dir)} (directory) is not kebab-case`);
        }
    }

    // 👉 2. Get ALL CSS/SCSS files
    const cssFiles = await fg('src/**/*.{css,scss}', { onlyFiles: true, dot: false });

    for (const file of cssFiles) {
        const base = getCssBaseName(file);

        if (!shouldIgnoreFile(base) && !isKebabCase(base)) {
            reportError(
                `${normalizePath(file)} (file) is not kebab-case (base: "${base}")`
            );
        }
    }

    console.timeEnd('🔍 Filename & folder linting');

    if (hasError) {
        console.log('\n⚠️  Fix the above naming violations.');
        process.exit(1);
    } else {
        console.log('✅ All directories and CSS/SCSS filenames are valid kebab-case');
    }
}

validate().catch((err) => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
});
