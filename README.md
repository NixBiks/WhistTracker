# Whist Tracker

A Danish Whist (Call-ace Whist) score tracking app with statistics and trend visualization.

**Live App:** https://nixbiks.github.io/WhistTracker/

## Features

- Track scores across game nights with 4 players
- Support for all bid types (Alm, Vip, Gode, Halve, Sans)
- Special bids (Sol, Ren Sol, Bordlægger, Super Bordlægger, Nolo variants)
- Vip count multiplier (1x, 2x, 3x based on kat cards looked at)
- Running score table with round history
- Statistics page with score trends and head-to-head records
- Data persisted locally in browser (localStorage)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

Static files are exported to `out/` for GitHub Pages deployment.
