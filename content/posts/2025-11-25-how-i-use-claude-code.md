---
layout: post
title: "How I Use Claude Code: My Complete Development Workflow"
description: "After 8 months with Claude Code, here's my complete workflow. Learn how I combine Linear, MCP servers, and Obsidian for AI-assisted development that works."
summary: "A deep dive into my daily Claude Code workflow, covering how I leverage the CLI tool for code exploration, implementation, refactoring, and debugging. Learn practical patterns that boost development productivity."
home_summary: "My complete Claude Code workflow using Linear, MCP servers, and Obsidian for AI-assisted development."
date: 2025-11-25
author: Damian Galarza
category: "AI Development"
tags:
  - claude-code
  - ai-tools
  - developer-productivity
  - workflow
keywords:
  - Claude Code
  - Claude Code workflow
  - AI-assisted development
  - developer productivity
  - Claude CLI
  - AI coding assistant
  - development workflow
  - Claude Code tips
  - AI pair programming
  - code exploration
reading_time: 10
og_image: "images/posts/og-how-i-use-claude-code.png"
og_image_alt: "How I Use Claude Code: My Complete Development Workflow - How I combine AI tools for context-rich development"
schema_type: "TechArticle"
proficiency_level: "Intermediate"
dependencies: "Claude Code, Linear, Obsidian, GitHub CLI, MCP Servers"
how_to_steps:
  - name: "Set up MCP servers for context"
    text: "Install Linear MCP, Sentry MCP, Memory MCP, and GitHub CLI to provide rich context for Claude Code."
  - name: "Connect Obsidian notes"
    text: "Use /add-dir to add your Obsidian vault path for accessing project notes during development."
  - name: "Break down problems into Linear issues"
    text: "Create detailed Linear issues that break complex features into manageable chunks."
  - name: "Run the linear-implement skill"
    text: "Execute the automated workflow that gathers context, creates plans, implements with TDD, and creates PRs."
  - name: "Review and approve the plan"
    text: "Validate Claude's implementation plan at the human-in-the-loop checkpoint before code is written."
---

For the past 8 months I've been using Claude Code as my daily driver. It's become a core part of my development workflow. Before this I tried Cursor for a few months and enjoyed it. However, I've been a terminal/Vim user for quite a while, so moving to an IDE was a significant change. I found myself drawn to Claude Code's agentic workflow rather than autocomplete or chat panels.

During this time my workflow has evolved significantly. This is partly from learning how to get the most out of it, but also from the Anthropic team's continuous improvements to the product. New features are coming out at a rapid pace.

There's an ongoing debate in our industry. Some developers swear by AI assistants while others remain skeptical. You hear stories about companies claiming developers are no longer needed, alongside dismissals that AI-generated code is always garbage. I find myself somewhere in the middle.

I believe using these tools is a skill in and of itself. When people tell me "it takes longer to get the LLM to do it right" or "I can do it faster myself," I understand where they're coming from. When I first started programming, I was slow too. But I got faster with practice. The same applies to working with agentic development tools.

This post walks through my typical Claude Code workflow. While I focus on Claude Code specifically, these concepts apply to many agentic coding tools.

## Context is King

One of the biggest complaints I hear from developers goes something like this: "I tried using an AI assistant but it just wouldn't get it right. I spent so much time trying to get it to do what I wanted and eventually gave up."

I've written about [how MCP tools consume the context window](/posts/2025-11-06-build-efficient-mcp-servers-three-design-principles/) before. But context matters in other ways too.

When I dig deeper into these frustrations, I typically ask how they prompted the LLM. The answer is usually a fairly vague prompt. In a smaller codebase this might work fine, but in an established codebase it often falls short. We need to give the LLM a well-structured problem.

One thing I've learned is that developers who have experience managing or delegating tasks tend to adapt quickly. They already understand how to break down problems into small pieces for someone else to work on. This is why I spend time breaking down problems into bite-sized chunks—a common practice in agile development.

For example, while building [Tracewell AI](https://www.tracewell.ai) I work with Linear for issue tracking. Even though I'm typically working alone, being disciplined about creating issues pays off. I often use Claude via the desktop app or terminal to scope out work, break down problems, and create Linear issues. This upfront work makes implementation much smoother.

## Tools I Use

My Claude Code setup relies on a few key tools that work together to provide rich context. Each addresses a different aspect of development—project management, error tracking, version control, and memory—creating a network of information that Claude can draw from when planning and implementing features.

### Linear MCP Server

The [Linear MCP Server](https://linear.app/docs/mcp) is a backbone of my workflow. It gives Claude direct access to project issues, enabling both the creation of backlog items and the delegation of implementation tasks.

### Sentry MCP Server

I use Sentry for error tracking, so the [Sentry MCP](https://docs.sentry.io/product/sentry-mcp/) is a natural addition. It allows me to point Claude at an exception for triaging or fixing. While I have Sentry connected to Linear for automatic issue creation, the MCP integration adds another layer of context when investigating errors.

### GitHub CLI

This one is critical. If you've read the [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) you've likely seen the recommendation to install the [GitHub CLI](https://cli.github.com/) (`gh`). If you haven't read that guide, I highly recommend starting there.

Claude Code excels at using the GitHub CLI for tasks like:

1. Opening pull requests
2. Investigating GitHub issues
3. Debugging GitHub Action runs
4. Reviewing PR feedback
5. Performing code review on others' pull requests

### Memory MCP Server

The [Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) provides Claude with persistent memory across conversations. In my workflow, I use it to store implementation plans so Claude can track progress and maintain context throughout a feature's development. When Claude creates a plan for a Linear issue, it saves it to the memory graph. This becomes especially useful when work spans multiple sessions.

With these tools in place, let's look at another core part of my workflow.

## Obsidian Notes

I've been using Obsidian for notes for over a year, but it never occurred to me to connect it to Claude Code until I heard the Every podcast episode with Noah Brier: [How to Use Claude Code as a Second Brain](https://every.to/podcast/how-to-use-claude-code-as-a-thinking-partner). This significantly changed how I provide context to my development work.

Why is this connection so important? When I'm working on a project, I'm taking notes. At a project kick-off I'm capturing potential solutions, key pieces of code, and product knowledge. These notes go into my vault under paths like `01-Projects/DHF Extraction/2025-11-01-Pairing Session.md`. Meeting transcripts end up in the same project folder.

When it's time to implement, I put Claude in plan mode and instruct it to "Review my notes in 01-Projects/DHF Extraction and help me implement X." Claude can now gather all the context I've assembled to inform its implementation plan.

> If you want to learn more about how I process meeting notes in Obsidian, check out my [Process Meeting Transcript Skill](https://github.com/dgalarza/claude-code-workflows/tree/main/.claude/skills/process-meeting-transcript) on GitHub.

To make the most of this, use the `/add-dir` command to add your Obsidian vault path. This allows Claude Code to reference files in your vault without permission issues.

## Putting It All Together

With MCP servers handling project management, error tracking, and memory, plus Obsidian providing my accumulated notes and research, I have all the pieces needed for a comprehensive workflow. All of these tools come together in a [Claude Agent Skill](https://www.claude.com/blog/skills) that takes a Linear issue by ID and implements a solution. Let me break down this skill.

```markdown
# Overview

This skill provides a comprehensive workflow for implementing Linear issues with professional software engineering practices. It automates the entire development lifecycle from issue analysis through PR creation, ensuring quality through test-driven development, parallel code reviews, and systematic validation.

## When to Use This Skill

Use this skill when:
- User provides a Linear issue ID (format: `TRA-9`, `DEV-123`, etc.)
- User requests implementation of a Linear issue
- User wants a structured TDD approach with code review
- User needs automated workflow from issue to PR

Examples:
- "Implement TRA-142"
- "Help me build the feature in DEV-89"
- "Work on Linear issue ABC-456"
```

This sets the stage for what the skill does and when to invoke it. Now let's look at the core workflow.

```markdown
# Core Workflow

The skill follows a 14-step process:

1. **Fetch Linear Issue** - Retrieve complete issue details via Linear MCP
2. **Gather Additional Context** - Search Obsidian, Sentry, and GitHub for related information
3. **Move to In Progress** - Update issue status to indicate active work
4. **Create Feature Branch** - Use Linear's suggested git branch naming
5. **Analyze & Plan** - Break down requirements and create implementation plan
6. **Save to Memory** - Store plan in memory graph for tracking
7. **Review Plan** - Present plan for user confirmation
8. **TDD Implementation** - Invoke `tdd-workflow` skill for test-driven development
9. **Parallel Code Reviews** - Invoke `parallel-code-review` skill for comprehensive analysis
10. **Address Feedback** - Invoke `code-review-implementer` skill to systematically fix issues
11. **Validation** - Ensure all tests and linters pass
12. **Logical Commits** - Create meaningful commit history
13. **Create PR** - Generate comprehensive pull request with Linear linking
14. **Final Verification** - Confirm CI/CD pipeline and Linear integration
```

There's a lot happening here, but the goal is straightforward: build as much context as possible before implementation begins. The workflow pulls in details from the Linear issue, related Obsidian notes, Sentry exceptions if relevant, and any linked GitHub discussions. For example, a Linear issue might have been extracted from a previous pull request discussion as a follow-up task—pulling that context in gives Claude a much better starting point.

One thing worth highlighting: step 7 (Review Plan) is a key part of this workflow. After gathering context and creating a plan, Claude presents it and *waits for my approval* before writing any code. This human-in-the-loop checkpoint prevents runaway implementations and gives me a chance to course-correct before significant work begins.

You'll notice a few other skills referenced in the workflow. These are also available in the [claude-code-workflows](https://github.com/dgalarza/claude-code-workflows/tree/main/.claude/skills) repo:

**tdd-workflow skill**
A skill that outlines a test-driven development workflow following an outside-in testing approach.

**parallel-code-review**
This workflow spins off two Claude sub-agents to perform code review in parallel. One focuses on Rails and object-oriented best practices while the other performs security analysis.

**code-review-implementer**
A skill that ranks code review feedback by priority and systematically addresses it. High priority feedback is always addressed. Medium and low priority items are presented for my decision before implementation.

## Getting Started

If you want to try this workflow yourself, here's how to get started:

1. **Install the MCP servers** - Set up Linear, Sentry (if you use it), and Memory MCP servers in your Claude Code configuration.

2. **Copy the skills** - Clone or copy the skills from my [claude-code-workflows](https://github.com/dgalarza/claude-code-workflows) repo into your project's `.claude/skills/` directory. You'll need `linear-implement` and its dependencies (`tdd-workflow`, `parallel-code-review`, `code-review-implementer`).

3. **Customize for your stack** - My skills are tailored to Rails projects with specific conventions (POODR principles, Result pattern, RSpec). If you're using Django, Node, Go, or another stack, you'll want to adapt the code review criteria and testing workflows to match your conventions.

4. **Connect your notes** - Use `/add-dir` to add your Obsidian vault (or wherever you keep project notes) so Claude can reference them.

5. **Try it out** - Once everything is set up, just type "Implement TRA-142" (substituting your issue ID) and the workflow kicks off automatically.

Claude Code auto-discovers skills in the `.claude/skills/` directory, so there's no additional configuration needed beyond placing the files.

## Conclusion

Getting value from agentic development tools requires building the right habits. By investing time upfront in breaking down problems, maintaining good notes, and connecting your tools together, you can create workflows that dramatically improve your productivity.

The key insight is that context matters. The more relevant information you can surface for the LLM, the better its output will be. This is true whether you're using Claude Code, Cursor, or any other AI-assisted development tool.

If you're interested in the full skill, you can find it in my [claude-code-workflows](https://github.com/dgalarza/claude-code-workflows/tree/main/.claude/skills/linear-implement) repo on GitHub.

## Further Reading

- [Claude Code: Best Practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [How to Use Claude Code as a Second Brain](https://every.to/podcast/how-to-use-claude-code-as-a-thinking-partner)
- [Forward Deployed, Episode 2: Claude Code Skills and the Progressive Disclosure Problem](https://www.youtube.com/watch?v=qizQkByZ4WM&t=1246s)
- [Most devs don't understand how context windows work](https://www.youtube.com/watch?v=-uW5-TaVXu4)
