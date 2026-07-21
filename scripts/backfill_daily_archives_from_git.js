#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveDir = path.join(repoRoot, 'data', 'daily-archives');

const sources = [
  {
    fileName: 'daily_trends.js',
    windowKey: 'dailyTrendCards',
    suffix: 'trends'
  },
  {
    fileName: 'daily_survival_guides.js',
    windowKey: 'dailySurvivalGuides',
    suffix: 'guides'
  }
];

function git(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function loadItemsFromCommit(commit, source) {
  const code = git(['show', `${commit}:${source.fileName}`]);
  const context = { window: {} };

  vm.createContext(context);
  vm.runInContext(code, context, { filename: `${commit}:${source.fileName}` });

  const items = context.window[source.windowKey];
  return Array.isArray(items) ? items : [];
}

function dominantDate(items) {
  const counts = new Map();

  items.forEach((item) => {
    if (!item.date) return;
    counts.set(item.date, (counts.get(item.date) || 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

fs.mkdirSync(archiveDir, { recursive: true });

sources.forEach((source) => {
  const commits = git(['log', '--format=%H', '--', source.fileName])
    .trim()
    .split('\n')
    .filter(Boolean);
  const seenDates = new Set();

  commits.forEach((commit) => {
    let items;
    try {
      items = loadItemsFromCommit(commit, source);
    } catch (error) {
      console.warn(`Skipping ${source.fileName} at ${commit.slice(0, 7)}: ${error.message}`);
      return;
    }

    const date = dominantDate(items);
    if (!date || seenDates.has(date)) return;
    seenDates.add(date);

    const outputPath = path.join(archiveDir, `${date}-${source.suffix}.json`);
    fs.writeFileSync(outputPath, `${JSON.stringify(items, null, 2)}\n`);
    console.log(`Backfilled ${path.relative(repoRoot, outputPath)}: ${items.length} items from ${commit.slice(0, 7)}`);
  });
});
