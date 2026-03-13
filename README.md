# FoldDB Website

The official marketing website for [FoldDB](https://github.com/shiba4life/fold_db) — The Open Data Ownership Platform.

![FoldDB](https://img.shields.io/badge/Built%20with-Rust-orange?logo=rust)
![License](https://img.shields.io/badge/license-MIT%20%2F%20Apache--2.0-blue)

## 🌐 Overview

This is a static marketing website showcasing FoldDB's features and capabilities to developers. It includes:

- **Hero Section** — Eye-catching introduction with terminal animation
- **Features Grid** — 8 key capabilities (AI ingestion, NL queries, serverless, etc.)
- **Code Examples** — Interactive tabs with Rust and TypeScript snippets
- **Quick Start Guide** — 4-step installation process
- **Architecture Diagram** — Visual overview of the system layers
- **CTA & Footer** — Links to GitHub, docs, and resources

## 🚀 Quick Start

### Local Development

```bash
# Serve locally with Python
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080)

### Deploy to GitHub Pages

1. Go to repository Settings → Pages
2. Set source to "Deploy from a branch"
3. Select `main` branch and `/` (root)
4. Save and wait for deployment

## 📁 Project Structure

```
fold_db_website/
├── index.html      # Main HTML structure
├── styles.css      # All styling (CSS variables, responsive)
├── script.js       # Interactive features (tabs, copy, animations)
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

## ✨ Features

- **Premium Dark Theme** — Modern gradient orbs with glassmorphism effects
- **Fully Responsive** — Mobile-first design with hamburger navigation
- **Interactive Code Examples** — Tab switching with copy-to-clipboard
- **Scroll Animations** — Intersection Observer for reveal effects
- **Zero Dependencies** — Pure HTML, CSS, and vanilla JavaScript

## 🎨 Design System

### Colors

| Variable             | Value     | Usage                    |
| -------------------- | --------- | ------------------------ |
| `--primary`          | `#6366f1` | Primary accent (indigo)  |
| `--accent`           | `#22d3ee` | Secondary accent (cyan)  |
| `--accent-secondary` | `#a855f7` | Tertiary accent (purple) |
| `--bg-dark`          | `#0a0a0f` | Background               |
| `--text-primary`     | `#f1f5f9` | Primary text             |

### Typography

- **Sans**: Inter (headings, body)
- **Mono**: JetBrains Mono (code, terminal)

## 📄 License

This website is part of the FoldDB project and is dual-licensed under:

- [MIT License](https://opensource.org/licenses/MIT)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

---

Built with ❤️ for the FoldDB community
