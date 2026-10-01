# John's Project Hub

A public, searchable launcher for the projects on the **JohnComputers** GitHub account.

## What it does

- Pulls public repositories directly from GitHub.
- Automatically excludes private repos in the browser because the GitHub public API cannot return them.
- Filters archived, empty, forked, or manually hidden repositories according to `site.config.js`.
- Detects GitHub Pages sites and repository homepage URLs and gives them a **Launch** button.
- Supports search, categories, featured projects, live-site filtering, sorting, grid/list views, and mobile layouts.
- Includes a browser-based **Customizer** at `customizer.html`.

## Main files

- `index.html` — site structure.
- `styles.css` — layout and component styling.
- `app.js` — GitHub loading, filtering, categorization, sorting, and rendering.
- `site.config.js` — the main control file. Most normal changes should happen here.
- `customizer.html` + `customizer.js` — visual editor and config exporter.
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment.

## Customizing the site

Open the live site's **Customize** page. You can adjust branding, hero text, theme colors, card sizing, featured repositories, hidden repositories, and the entire JSON configuration.

The advanced configuration includes:

- `github`
- `brand`
- `theme`
- `repositoryRules`
- `featured`
- `categories`
- `projectOverrides`
- `labels`
- `customCss`

For a specific repo, add an entry under `projectOverrides`:

```js
"PromptLab": {
  title: "PromptLab",
  description: "Custom description",
  category: "AI",
  icon: "✦",
  launchUrl: "https://example.com",
  hideLaunch: false,
  hidden: false,
  tags: ["AI", "Prompts"]
}
```

The visual Customizer downloads a replacement `site.config.js`. Replace the existing file in this repository and commit it. The Pages workflow will redeploy automatically.

## Publishing

This repository includes a GitHub Pages Actions workflow. In GitHub repository settings, set **Settings → Pages → Source** to **GitHub Actions** if it is not already selected.

Expected project URL:

`https://johncomputers.github.io/JohnWilliamsPortfolio/`

## Security

The public site never contains a GitHub access token. It reads only public repository information through GitHub's public API. Private repositories remain private and are not fetched by the site.
