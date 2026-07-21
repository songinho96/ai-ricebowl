#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveDir = path.join(repoRoot, 'data', 'daily-archives');

function loadWindowScript(fileName) {
  const code = fs.readFileSync(path.join(repoRoot, fileName), 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: fileName });
  return context.window;
}

function mostCommonDate(items) {
  const counts = new Map();

  items.forEach((item) => {
    if (!item.date) return;
    counts.set(item.date, (counts.get(item.date) || 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || new Date().toISOString().slice(0, 10);
}

const trendsWindow = loadWindowScript('daily_trends.js');
const guidesWindow = loadWindowScript('daily_survival_guides.js');
const trends = trendsWindow.dailyTrendCards || [];
const guides = guidesWindow.dailySurvivalGuides || [];
const date = process.argv[2] || mostCommonDate([...trends, ...guides]);

fs.mkdirSync(archiveDir, { recursive: true });
fs.writeFileSync(
  path.join(archiveDir, `${date}-trends.json`),
  `${JSON.stringify(trends, null, 2)}\n`
);
fs.writeFileSync(
  path.join(archiveDir, `${date}-guides.json`),
  `${JSON.stringify(guides, null, 2)}\n`
);

console.log(`Archived daily site data for ${date}: trends=${trends.length}, guides=${guides.length}`);
