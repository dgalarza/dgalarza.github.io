# LinkedIn Best Practices for Technical Content

This document outlines best practices for creating engaging LinkedIn posts from technical blog content.

## Platform Constraints

### Character Limits
- **Optimal length:** 150-300 characters for mobile preview (the "hook")
- **Maximum length:** 3,000 characters total
- **Sweet spot:** 1,300-2,000 characters for detailed posts
- **Line breaks:** Use blank lines to create visual breaks (improves readability)

### Formatting
- **Emojis:** Use sparingly (1-3 per post) only for visual breaks or emphasis, never for decoration
- **Hashtags:** 3-5 relevant hashtags at the end of the post
- **Line breaks:** Add blank lines between paragraphs for better mobile reading
- **Lists:** Use bullet points with • or numbers for key takeaways
- **Bold text:** Not available on LinkedIn, use ALL CAPS sparingly for emphasis

## Hook Strategies (First 150 Characters)

The first 150 characters appear in the feed before "see more" - this is your hook.

### Effective Hook Patterns

1. **Problem Statement**
   - "I spent 2 weeks building an MCP server that consumed 746k tokens per query."
   - "Your API wrapper is probably wasting 90% of your AI's context window."

2. **Counter-Intuitive Statement**
   - "Exposing every API field to your AI makes it less accurate, not more."
   - "The best MCP tools return less data, not more."

3. **Specific Result**
   - "Three design changes reduced my context usage from 746k to 262 tokens (99.96%)."
   - "I cut context usage by 94.6% with one code change."

4. **Personal Discovery**
   - "While building a YNAB integration, I discovered something surprising about context windows."
   - "Last month I learned why most MCP servers fail at scale."

5. **Question (Use Sparingly)**
   - "Are you making this mistake with your AI integrations?"
   - "What if your API design is the bottleneck, not the model?"

### Hook Pitfalls to Avoid
- Generic statements ("AI is changing everything")
- Clickbait without substance ("You won't believe...")
- Starting with context instead of impact
- Overly technical jargon in the hook
- Long-winded explanations before the payoff

## Post Structure

### The Opening (Hook + Context)
1. **Hook (1-2 sentences):** Grab attention with the problem or result
2. **Context (2-3 sentences):** Quick backstory - what prompted this work
3. **Thesis (1 sentence):** What you learned or will teach

Example:
```
I built an MCP server that used 746,800 tokens for a single query. [HOOK]

That's 3.7x larger than Claude's entire context window. I couldn't even fit the response in a single request. [CONTEXT]

Here's how I reduced it to 262 tokens (99.96% reduction) and what I learned about building context-efficient AI tools: [THESIS]
```

### The Body (Key Points)
- **3-5 main points maximum** - LinkedIn readers skim
- **Use numbered lists or bullets** for scannable content
- **Lead with the insight, not the implementation** - save code for the blog
- **Include specific numbers** - "65% reduction" beats "significant improvement"
- **Tell the story** - What didn't work? What surprised you?

### The Close (Call-to-Action)
- **Link to blog post** - "Full implementation details and code examples: [URL]"
- **Invite discussion** - "What context optimization techniques have you discovered?"
- **Provide next steps** - "If you're building MCPs, start by asking..."
- **Soft CTA** - No pushy sales language; focus on value and community

### Hashtags
- Place at the very end, separated by a blank line
- 3-5 hashtags maximum
- Mix of broad (#AI, #SoftwareEngineering) and specific (#ModelContextProtocol, #ClaudeAI)
- Use actual topic hashtags, not keyword stuffing

## Adapting Technical Blog Posts

### What to Include
- **The core insight** - The "aha moment" or key learning
- **Specific results** - Metrics, percentages, before/after numbers
- **Why it matters** - Impact on readers' work
- **1-2 concrete examples** - Brief code snippets or scenarios
- **Link to full post** - For implementation details

### What to Omit
- Detailed code walkthroughs (save for blog)
- Step-by-step tutorials (tease, don't teach fully)
- Edge cases and caveats (mention briefly if critical)
- Multiple approaches (pick the best one for LinkedIn)
- Setup instructions (save for blog)

### Condensing Without Losing Value
- **Focus on one insight** - Even if the blog covers three principles, your LinkedIn post can focus on the most surprising one
- **Use concrete examples** - "I removed 12 fields from 47 accounts and cut tokens by 65%" is better than explaining field filtering theory
- **Show the journey** - What you tried first, what didn't work, what you learned
- **Make it skimmable** - Use short paragraphs, lists, and clear transitions

## Engagement Tactics

### Driving Comments
- **End with a question** - "What techniques have you discovered?"
- **Invite experiences** - "Have you run into this problem?"
- **Request feedback** - "Would you approach this differently?"
- **Share learnings** - "What surprised me most was..." invites others to share surprises

### Driving Shares
- **Provide actionable value** - Specific numbers, techniques, frameworks
- **Include "steal this" content** - Code snippets, checklists, frameworks
- **Create reference value** - Posts people want to bookmark
- **Solve a common pain point** - Problems many engineers face

### Driving Traffic to Blog
- **Create information gap** - "Here's the result" (LinkedIn) → "Here's how" (blog)
- **Tease the details** - "Three principles" (LinkedIn) → "With code examples and measurements" (blog)
- **Position as resource** - "Full implementation with token counting methodology: [URL]"
- **Respect the reader** - Give value in the post, more value in the blog

## Voice and Tone Alignment

When adapting blog content to LinkedIn, maintain these characteristics:

### Tone Adjustments for LinkedIn
- **More conversational** - LinkedIn is a professional social network, not a docs site
- **First-person narrative** - Lead with personal experience and learning
- **Community-focused** - Invite dialogue, not just inform
- **Humble confidence** - Share wins without bragging; admit mistakes
- **Value-first** - Help others, don't just showcase your work

### Structural Differences from Blog Posts
- **Blog:** Problem → Background → Solution → Implementation → Results
- **LinkedIn:** Results → Problem → Key Insight → Impact → Link to Details

### Language Adaptations
- **Blog:** "In order to fetch a user's timeline we will need to make a request..."
- **LinkedIn:** "I needed to fetch timeline data and discovered this approach reduced tokens by 65%."

Blog posts teach with step-by-step instructions. LinkedIn posts share insights and invite conversation.

## Common Mistakes to Avoid

### Content Mistakes
- **Copying the blog intro** - Blog intros often include too much context; condense for LinkedIn
- **Burying the lede** - Start with the result or insight, not the background
- **Too much technical depth** - Save implementation details for the blog
- **No clear takeaway** - Every post should have one core insight readers can use

### Formatting Mistakes
- **Wall of text** - Use line breaks generously; mobile readers need breathing room
- **No visual hierarchy** - Use lists, spacing, and structure to guide the eye
- **Weak first line** - If the hook doesn't grab attention, nothing else matters
- **Forgetting the link** - Always link to the full blog post

### Engagement Mistakes
- **No call-to-action** - End with a question or invitation to engage
- **Being overly promotional** - Focus on value and learning, not self-promotion
- **Ignoring comments** - Respond to comments to boost engagement
- **Posting and ghosting** - Engage with your audience in the first 2 hours

## Examples of Strong Adaptations

### Blog Title
"Build Efficient MCP Servers: Three Design Principles"

### LinkedIn Hook (First 150 Characters)
"I built an MCP server that used 746,800 tokens for a single query.

That's 3.7x larger than Claude's entire context window."

### Body Structure
```
I built an MCP server that used 746,800 tokens for a single query.

That's 3.7x larger than Claude's entire context window. I couldn't even fit the response in a single request.

Here's how I reduced it to 262 tokens (99.96% reduction):

• Filter at the source - Remove unnecessary API fields before sending to the model (65% reduction)
• Pre-aggregate data - Compute summaries in your code, not in the context window (94% reduction)
• Work within constraints - Design workflows that combine available operations creatively

The key insight: APIs are designed for apps, not AI context windows.

Apps can cache and filter data efficiently. AI models pay a "context tax" for every unnecessary byte. When you blindly pass through API responses, you're asking the model to waste context on data it doesn't need.

I measured this on a real YNAB integration:
→ Budget overview: 30k → 19k tokens (38% reduction)
→ Spending analysis: 4.9k → 262 tokens (94.6% reduction)
→ Full year query: 746k → 262 tokens (99.96% reduction)

The full article includes:
→ Real token measurements with tiktoken
→ Code examples for each optimization
→ When to apply each technique
→ Trade-offs and limitations

[Link to blog post]

If you're building MCP servers, start by asking: "What does the model actually need?" Not "What does the API return?"

What context optimization techniques have you discovered?

#AI #ModelContextProtocol #SoftwareEngineering #AITools #ClaudeAI
```

## Quality Checklist

Before posting, verify:

**Hook & Opening**
- [ ] First 150 characters grab attention
- [ ] Core insight or result is clear upfront
- [ ] Context is provided but not excessive

**Content**
- [ ] 3-5 key points maximum
- [ ] Specific numbers and results included
- [ ] Story and journey are present
- [ ] One clear takeaway

**Structure**
- [ ] Blank lines between paragraphs
- [ ] Lists used for key points
- [ ] Scannable on mobile
- [ ] Total length under 2,000 characters

**Engagement**
- [ ] Ends with question or invitation
- [ ] Link to blog post included
- [ ] 3-5 relevant hashtags at end
- [ ] Call-to-action is clear but not pushy

**Voice**
- [ ] Conversational and personal
- [ ] Humble and helpful tone
- [ ] Focus on value, not self-promotion
- [ ] Authentic to your writing style
