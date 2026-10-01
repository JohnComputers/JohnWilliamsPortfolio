# John's Project Hub

A public, searchable launcher for the projects on the **JohnComputers** GitHub account.

## What it does

- Pulls public repositories directly from GitHub.
- Automatically excludes private repos in the browser because the GitHub public API cannot return them.
- Filters archived, empty, forked, or manually hidden repositories according to `site.config.js`.
- Detects GitHub Pages sites and repository homepage URLs and gives them a **Launch** button.
- Supports search, categories, featured projects, live-site filtering, sorting, grid/list views, and mobile layouts.

## Main files

- `index.html` — site structure.
- `styles.css` — layout and component styling.
- `app.js` — GitHub loading, filtering, categorization, sorting, and rendering.
- `site.config.js` — the main control file. Most normal changes should happen here.
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment.

## Customizing the site

Customization is owner-only through the GitHub repository. Edit `site.config.js` on the `main` branch to control branding, theme colors, featured repositories, hidden repositories, categories, project overrides, labels, launch URLs, and custom CSS.

For deeper changes, edit:
- `styles.css` for appearance
- `index.html` for layout
- `app.js` for behavior

Because these files are changed through GitHub, only accounts with write access to this repository can publish customizations.

## Publishing

This repository includes a GitHub Pages Actions workflow. In GitHub repository settings, set **Settings → Pages → Source** to **GitHub Actions** if it is not already selected.

Expected project URL:

`https://johncomputers.github.io/JohnWilliamsPortfolio/`

## Security

The public site never contains a GitHub access token. It reads only public repository information through GitHub's public API. Private repositories remain private and are not fetched by the site.
