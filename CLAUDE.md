# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog for Damian Galarza, built with Hugo and Tailwind CSS v4. Deployed to GitHub Pages at damiangalarza.com.

## Development Commands

```bash
# Development server (runs Tailwind watch + Hugo server with drafts)
npm run dev

# Production build
npm run build

# Build CSS only
npm run build:css
```

## Architecture

### Content Structure
- `content/posts/` - Blog posts in Markdown with YAML frontmatter
- `content/pages/` - Static pages
- Blog post filename format: `YYYY-MM-DD-slug.md`

### Layouts & Styling
- `layouts/` - Hugo templates (custom, not using a theme)
- `assets/css/main.css` - Tailwind CSS v4 source with custom theme variables
- `static/css/style.css` - Compiled Tailwind output (generated)
- `tailwind.config.js` - Tailwind configuration with custom color scheme

### Custom Theme Colors
- Background: `#030712` (dark-bg)
- Surface: `#1a1f2e` (dark-surface)
- Accent teal: `#20D0BC`
- Accent purple: `#9333ea`
- Accent blue: `#3b82f6`

## Blog Post Workflow

### Creating New Posts
Use the slash command: `/new-blog-post [working title]`

This creates a properly formatted post with:
- Correct filename format
- Complete frontmatter (title, description, date, tags, og_image, etc.)

### Writing & Reviewing
Two skills are available for blog content:
- `blog-post-editor` - Write or edit posts matching the established voice
- `blog-post-reviewer` - Review posts against voice/style guidelines

### Voice Profile
The `.claude/voice-profile.md` file contains detailed writing guidelines extracted from historical blog posts. Key characteristics:
- Professional but conversational tone
- Educational and problem-solver mentality
- First person for experiences, second person for instructions
- Start with context, explain the "why", provide working code examples

## Deployment

Automatic via GitHub Actions on push to `main` branch. The workflow:
1. Installs Hugo 0.137.1 (extended)
2. Runs npm ci
3. Builds with Hugo (minified)
4. Deploys to GitHub Pages

## Key Configuration

- `config.toml` - Hugo configuration, site metadata, menu structure
- `.tool-versions` - Node.js 22.14.0 (asdf)
- Code syntax highlighting uses `catppuccin-mocha` theme
