// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add assets folder to watch list
config.watchFolders = [
  ...config.watchFolders,
  path.resolve(__dirname, 'assets') // ← This makes @assets/ work
];

// Ensure PNGs are treated as assets (usually already included, but safe)
if (!config.resolver.assetExts.includes('png')) {
  config.resolver.assetExts.push('png');
}

module.exports = withNativeWind(config, { input: './global.css' });