#!/usr/bin/env node
/**
 * Copy .next/static (and public if present) into the standalone output
 * so that CSS and other static assets are served when running the standalone server.
 * Next.js standalone puts server.js in a subfolder (e.g. frontend/) when the app is in a subfolder.
 */
const fs = require('fs');
const path = require('path');

const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
const appDir = fs.existsSync(path.join(standaloneDir, 'frontend'))
  ? path.join(standaloneDir, 'frontend')
  : standaloneDir;

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const nextDir = path.join(appDir, '.next');
if (!fs.existsSync(nextDir)) fs.mkdirSync(nextDir, { recursive: true });

const staticSrc = path.join(__dirname, '..', '.next', 'static');
if (fs.existsSync(staticSrc)) {
  copyRecursive(staticSrc, path.join(nextDir, 'static'));
}

const publicSrc = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicSrc)) {
  copyRecursive(publicSrc, path.join(appDir, 'public'));
}
