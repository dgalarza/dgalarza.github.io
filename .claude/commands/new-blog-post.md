---
allowed-tools: [Write, Bash, AskUserQuestion]
description: Bootstrap a new Hugo blog post with proper frontmatter
argument-hint: "[working title]"
---

# New Blog Post

Creates a new Hugo blog post with proper frontmatter and file naming conventions.

## Task

Generate a new blog post file in `content/posts/` with:
- Proper filename format: `YYYY-MM-DD-slug.md`
- Complete Hugo frontmatter based on existing blog post patterns
- Today's date
- User-provided working title

## Process

1. Get the working title from the user (use argument if provided, otherwise ask)
2. Generate a URL-friendly slug from the title (lowercase, hyphens instead of spaces)
3. Create filename with today's date: `YYYY-MM-DD-slug.md`
4. Ask user for:
   - Category (e.g., "AI Development", "Product Strategy", "Tutorial")
   - Tags (comma-separated list)
   - Brief description (1-2 sentences)
5. Generate frontmatter with all required fields based on blog post examples
6. Write the file to `content/posts/`
7. Confirm file creation and show the path

## Frontmatter Template

Use this structure (customize based on blog type):

```yaml
---
layout: post
title: "[User's Title]"
description: "[Brief 1-2 sentence description]"
summary: "[Optional longer summary for SEO]"
date: YYYY-MM-DD
author: Damian Galarza
category: "[Category]"
tags:
  - [tag1]
  - [tag2]
keywords:
  - [keyword1]
  - [keyword2]
og_image: "images/posts/og-[slug].png"
og_image_alt: "[Description of OG image]"
---

[Your content starts here]
```

## Notes

- For technical tutorials, consider adding: `schema_type`, `proficiency_level`, `dependencies`, `how_to_steps`
- For blog posts with code examples, add `reading_time` estimate
- The `og_image` path should follow the pattern but the image doesn't need to exist yet
- Keywords should expand on tags with more specific search terms
- Use proper YAML list syntax for arrays (tags, keywords, etc.)

## Output

Confirm the file was created and display:
- Full file path
- Filename
- Next steps: "Edit the file to add your content, and create the OG image at [path] when ready"

## Example Usage

```bash
/new-blog-post Building Efficient MCP Servers
```
