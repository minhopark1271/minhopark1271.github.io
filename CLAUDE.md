# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based documentation site using the "Just the Docs" theme, hosted on GitHub Pages. The site serves as a personal knowledge base covering technology, development, investment, and hobbies.

**Stack**: Jekyll 3.10.0, Just the Docs theme, Ruby 3.2, GitHub Pages
**Package Manager**: Bundler
**Site URL**: https://minhopark1271.github.io

## Common Commands

```bash
# Installation
bundle install                          # Install Jekyll and dependencies

# Local Development
bundle exec jekyll serve                # Build and serve at localhost:4000
bundle exec jekyll serve --livereload   # With auto-reload on changes
bundle exec jekyll build                # Build static site to _site/

# Check versions
bundle exec jekyll --version            # Check Jekyll version
ruby --version                          # Check Ruby version
```

## Architecture

```
docs/                    # Main content organized by topic
├── development/         # Tech and development notes
├── investment/          # Investment and trading research
├── golf/               # Hobby content
└── paper/              # Research papers

_includes/              # Reusable HTML components
_layouts/               # Page layout templates
_sass/                  # Sass/SCSS stylesheets
assets/                 # Images, JavaScript, static files
_config.yml             # Jekyll configuration
index.md                # Homepage

GitHub Actions          # Auto-deploy on push to main
└── .github/workflows/pages.yml
```

**Content Organization**:
- Each content directory under `docs/` has an `index.md` with `has_children: true`
- Individual pages use frontmatter to set `title`, `nav_order`, `parent`, etc.
- Navigation hierarchy controlled by Jekyll frontmatter, not folder structure

## Key Patterns

**Page Frontmatter**: All markdown files require YAML frontmatter for navigation
```yaml
---
title: Page Title
nav_order: 20              # Determines sidebar order
parent: Development        # For nested pages
has_children: true         # For parent pages
---
```

**Navigation Order**: Lower `nav_order` values appear first in sidebar (10, 20, 30...)

**Theme Customization**:
- Just the Docs theme is included via `github-pages` gem
- Custom styles in `_sass/custom/custom.scss`
- Layout overrides in `_layouts/`

**GitHub Pages Deployment**:
- Automatic build on push to `main` branch
- Uses GitHub Actions workflow defined in `.github/workflows/pages.yml`
- Built site deployed to GitHub Pages, not committed to repo

## Important Constraints

- Ruby 3.2 required (GitHub Pages compatibility)
- Jekyll 3.10.0 (latest GitHub Pages version)
- All content must be markdown (`.md`) files
- Images and assets go in `assets/` directory
- Korean language content is primary (site is in Korean)

## Content Structure

**Adding New Pages**:
1. Create `.md` file in appropriate `docs/` subdirectory
2. Add frontmatter with title, nav_order, and parent (if nested)
3. Write content in markdown below frontmatter

**Creating New Sections**:
1. Add `index.md` in new `docs/category/` directory
2. Set `has_children: true` in frontmatter
3. Add child pages with `parent: Category Name` in their frontmatter

## Testing Locally

Before pushing changes:
1. Run `bundle exec jekyll serve` to test locally
2. Navigate to `http://localhost:4000`
3. Verify navigation hierarchy and content rendering
4. Check for build warnings/errors in terminal output
