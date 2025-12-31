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

## Content Strategy

All written content / copy writing should follow the voice profile found in .claude/voice-profile.md

Here’s a **clean, one-page internal doc** you can drop straight into your codebase and reuse as a **prompt starter**.
It’s written to be stable, directive, and reusable over time.

---

# Website Goals & Positioning — Internal Reference

**Purpose**
This document defines the goals, positioning, and decision rules for damiangalarza.com.
Use it as a prompt starter when generating copy, reviewing pages, or making design decisions.

---

## 1. Primary Website Goal (Non-Negotiable)

**Generate high-quality consulting and coaching leads.**

The site should make it easy for the *right* person to:

* Understand what I do
* Trust my experience
* Start a conversation

Traffic volume is not the goal.
Lead quality is the goal.

---

## 2. Secondary Goal

**Reinforce authority through visible thinking and real work.**

The site should clearly demonstrate:

* How I think
* How I make decisions
* How I operate under real constraints

This is achieved through:

* Blog posts
* YouTube content
* Livestreams
* Public documentation of workflows and tradeoffs

This content exists to *build trust*, not to teach beginners.

---

## 3. Tertiary Goal (Near-Future)

**Capture early interest for paid products (courses).**

Examples:

* Rails LLM course waitlist
* Email capture for future offerings

This goal supports the consulting engine.
It does not replace it.

---

## 4. Target Audience (Implicit)

**Primary**

* Senior developers
* Tech leads
* Small teams making real technical decisions

**Secondary**

* Founders needing technical clarity
* Developers thinking about growth or leadership

The site should *feel* senior without explicitly saying “senior”.

---

## 5. Core Positioning Pillars

All copy and content should reinforce at least one pillar.

### Pillar 1: Real Systems Experience

* Production codebases
* Regulated environments
* Team scale
* Operational and maintenance constraints

### Pillar 2: Clear Technical Thinking

* Tradeoffs over best practices
* Decision-making under uncertainty
* Why approaches change as systems grow

### Pillar 3: Practical AI Integration

* AI as part of real workflows
* Focus on maintainability and handoff
* Avoid demos and novelty-first framing

---

## 6. Page-Level Intent

### Homepage

**Purpose:** Orientation and credibility.

Should answer quickly:

* Who this is for
* What problems I help with
* Why my experience matters

No deep detail.

---

### Services Page

**Purpose:** Convert trust into action.

* Concrete problems I help solve
* Clear engagement types
* Low-friction call to action

Avoid generic consulting language.

---

### Content (Blog / YouTube)

**Purpose:** Show how I think.

* Visible process
* Mistakes framed as tradeoffs
* Constraints made explicit

This is where authority compounds.

---

### About Page

**Purpose:** Humanize without diluting credibility.

* Short
* Grounded
* Experience-first

No full career narrative.

---

## 7. Content → Consulting Funnel Logic

1. Content shows **how I think**
2. Website confirms **I do this professionally**
3. Services page offers **a clear next step**
4. CTA invites **a conversation, not a sale**

No aggressive conversion tactics.

---

## 8. Tone & Framing Rules

* Calm, direct, precise
* No hype
* No beginner framing
* No “learning from scratch” language

When showing mistakes:

* Name the assumption
* Name the constraint
* Show the correction

Mistakes are instructional, not exploratory.

---

## 9. Decision Filter (Use This Always)

Before adding or changing anything, ask:

> Does this make it easier for the right person to trust me and reach out?

If the answer is not clearly “yes”, it’s optional or future work.
