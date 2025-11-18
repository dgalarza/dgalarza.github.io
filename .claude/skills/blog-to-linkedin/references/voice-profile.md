# Writing Voice Profile

This document outlines the writing voice and style characteristics identified from blog posts spanning 2009-2016. Use this as a reference when writing or reviewing new blog content.

## Core Voice Characteristics

### Tone
- **Professional but conversational** - Maintains technical credibility without being overly formal
- **Educational and helpful** - Primary goal is to teach and help readers solve problems
- **Direct and concise** - Gets to the point without unnecessary fluff or marketing speak
- **Humble** - Shares learning journey and discoveries without ego ("I discovered", "I found", "I've learned")
- **Problem-solver mentality** - Approaches topics from a practical, solutions-oriented perspective

### Perspective
- **First person** ("I", "I've", "my") when sharing personal experiences, discoveries, or projects
- **Second person** ("you", "your") when instructing or guiding the reader
- **First person plural** ("we", "let's") when walking through solutions together with the reader

## Structural Patterns

### Content Organization
1. **Start with context** - Introduce the problem or motivation before diving into solutions
2. **Explain the "why"** - Don't just show how to do something, explain why it matters
3. **Step-by-step approach** - Break complex topics into manageable steps
4. **Show code in context** - Include file paths, explain what each piece does
5. **Discuss limitations** - Acknowledge trade-offs, edge cases, and when something might not work
6. **Provide resources** - Link to official documentation, credit sources, suggest further reading

### Common Opening Patterns
- Start with a problem statement or real-world scenario
- Share what prompted the exploration ("Recently while working on...")
- Acknowledge common misconceptions ("You may be thinking...")
- Provide context before technical details

### Section Structure
- Use clear headers to organize content
- Break up long explanations with subsections
- Use lists (bulleted or numbered) for multiple related points
- Include code blocks with explanations
- End with conclusions or next steps when appropriate

## Language & Style

### Sentence Patterns
- **Mix of lengths** - Combine short, punchy sentences with longer explanatory ones
- **Active voice** - "We'll need to modify" not "The modification will need to be made"
- **Contractions** - Use naturally (you'll, I've, it's, don't) but not excessively
- **Transitional phrases** - Connect ideas smoothly between paragraphs

### Common Phrases & Transitions
- "Let's take a look at..."
- "With this in mind..."
- "Moving forward..."
- "In order to..."
- "First, [action]. Next, [action]."
- "Now that we've [done X], we can..."
- "This provides us with..."
- "Note that..."
- "It turns out..."
- "So with this in mind..."
- "The issue here is..."
- "Before we jump into..."

### Technical Communication
- **Explain before showing** - Provide context before code examples
- **Comment inline** - Add brief explanations within or after code blocks
- **Show evolution** - Demonstrate how solutions evolve or improve
- **Acknowledge complexity** - "This can be a bit confusing at first"
- **Provide alternatives** - Discuss different approaches when relevant

## Content Types & Approaches

### Tutorial Posts
- Start with problem/need
- Explain underlying concepts
- Provide step-by-step instructions
- Include working code examples
- Show expected output/results
- Address common pitfalls

### Tool/Project Announcements
- Explain the motivation behind the tool
- Describe key features
- Show examples of use
- Link to source code/documentation
- Mention future plans or limitations

### Deep Dives
- Provide thorough background
- Explain the problem space
- Compare different approaches
- Show detailed implementations
- Discuss performance implications
- Reference related concepts

### Quick Tips/Fixes
- State the problem clearly
- Provide the solution
- Explain why it works
- Link to relevant resources

## Code Presentation

### Code Blocks
- Always include language syntax highlighting hints
- Provide context (file paths, class/method names)
- Use meaningful variable names in examples
- Include comments for non-obvious logic
- Show complete, working examples when possible

### Code Explanations
- Explain what the code does before showing it
- Walk through key parts line by line when needed
- Highlight important patterns or idioms
- Explain the reasoning behind implementation choices

## What to Avoid

### Tone Issues
- Overly enthusiastic marketing language
- Excessive exclamation points or emojis
- Condescending explanations
- Assuming too little knowledge without context

### Structure Issues
- Jumping into code without context
- Missing explanations for "why" something matters
- Leaving edge cases unaddressed
- Not providing working examples

### Style Issues
- Overly long paragraphs without breaks
- Wall of code without explanation
- Vague instructions ("do something with X")
- Skipping important setup steps

## Audience Assumptions

### Reader Background
- Has programming experience
- Familiar with web development concepts
- May be new to the specific technology discussed
- Values understanding over quick fixes
- Appreciates learning the underlying concepts

### What Readers Want
- Practical, working solutions
- Understanding of why something works
- Awareness of trade-offs and alternatives
- Links to official documentation
- Real-world context and examples

## Example Analysis

### Good Opening Example
> "Recently while working with the Facebook app requests with the Facebook JavaScript SDK I ran into a slight issue when working with long scrolling pages."

**Why it works:**
- Sets immediate context
- Shares real experience
- Identifies specific problem
- Reader knows what to expect

### Good Explanation Example
> "In order to fetch a user's timeline we will need to make a request to the following API path: `/1/statuses/user_timeline`. Along with this path the API documentation by twitter specifies that we can send various parameters along in the query string."

**Why it works:**
- States the goal clearly
- Shows the specific path
- Explains additional context
- References documentation

### Good Transition Example
> "Now that we have the session cookie data being passed with the request we'll need to move forward and have that information set with the headers of the Flash request, enter Middleware."

**Why it works:**
- Summarizes what was accomplished
- Signals the next step
- Introduces the new concept
- Creates natural flow

## Quality Checklist

Use this checklist when reviewing blog posts:

**Content**
- [ ] Clear problem statement or context in opening
- [ ] Explains why the topic matters
- [ ] Provides working code examples
- [ ] Addresses edge cases or limitations
- [ ] Links to relevant documentation
- [ ] Gives credit to sources when appropriate

**Structure**
- [ ] Logical flow from problem to solution
- [ ] Clear section headers
- [ ] Appropriate use of lists and formatting
- [ ] Code blocks include necessary context
- [ ] Conclusion or next steps when appropriate

**Voice**
- [ ] Professional but conversational tone
- [ ] Direct and concise writing
- [ ] Explains "why" not just "how"
- [ ] Uses appropriate perspective (I/you/we)
- [ ] Natural use of transitional phrases

**Technical Accuracy**
- [ ] Code examples are correct and complete
- [ ] File paths and context are included
- [ ] Setup requirements are mentioned
- [ ] Commands include expected output
- [ ] Troubleshooting tips included when relevant

**Reader Experience**
- [ ] Assumes appropriate knowledge level
- [ ] Explains concepts before using them
- [ ] Acknowledges potential confusion
- [ ] Provides multiple examples when helpful
- [ ] Makes it easy to follow along
