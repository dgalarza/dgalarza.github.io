---
layout: post
title: "Build Efficient MCP Servers: Three Design Principles"
description: "Three design principles for context-efficient MCP servers: filter at source, pre-aggregate data, work creatively. Real reductions: 746k→262 tokens."
summary: "Learn how to build Model Context Protocol servers that are 90%+ more efficient through strategic filtering and pre-aggregation. Real YNAB example shows reductions from 746,800 tokens to 262 tokens with measured optimization techniques and code examples."
date: 2025-11-06
author: Damian Galarza
category: "AI Development"
tags:
  - model-context-protocol
  - mcp-development
  - ai-tools
  - context-optimization
  - claude-code
  - tutorial
  - python
  - ynab
keywords:
  - Model Context Protocol
  - MCP server
  - context window optimization
  - token efficiency
  - Claude MCP
  - AI tool development
  - API wrapper design
  - pre-aggregation
  - YNAB MCP
  - context-efficient design
  - reduce AI token costs
  - MCP optimization tutorial
  - context window management
  - AI tool performance
  - Claude Code tools
reading_time: 25
og_image: "images/posts/og-build-efficient-mcp-servers-three-design-principles.png"
og_image_alt: "MCP Servers That Scale - 99.96% Token Reduction. Three design principles for efficient AI integrations."
schema_type: "TechArticle"
proficiency_level: "Intermediate"
dependencies: "Python, Model Context Protocol, YNAB API"
how_to_steps:
  - name: "Filter at the source"
    text: "Return only essential fields from API responses instead of passing through all data. Remove unnecessary fields to reduce token usage by 30-65%."
  - name: "Pre-aggregate data"
    text: "Compute summaries, totals, and statistics in your tool code rather than returning raw data. Pre-calculate aggregations to reduce tokens by 90-99%."
  - name: "Work within API constraints creatively"
    text: "Design workflows that combine available API operations to achieve desired outcomes when direct endpoints don't exist."
---

Recently I had an idea: what would it be like to interact with my YNAB budget via Claude Code using natural language? I wanted to be able to ask questions like "How much did I spend on groceries last month?" or "What categories am I overspending in?" and get accurate answers without digging through the app.

I found some existing YNAB MCPs, but most were inactive with limited features. This seemed like a good opportunity to learn MCP design from scratch. What followed was a deep dive into context efficiency that changed how I think about building AI tools.

## Understanding Model Context Protocols (MCPs)

If you're already familiar with Model Context Protocol (MCP) servers, feel free to skip ahead to [The Naive Approach](#the-naive-approach-direct-api-wrapping).

The Model Context Protocol (MCP) is a standardized way to extend language models with external capabilities. Unlike traditional APIs where you write code to call endpoints, MCP servers allow AI models to discover and use tools autonomously. The protocol defines how models can:

- **Call tools** - Execute functions that interact with external systems
- **Read resources** - Access files, databases, or other data sources
- **Receive prompts** - Get specialized instructions for specific tasks

When you build an MCP server, you're essentially creating a set of capabilities that any MCP-compatible AI assistant (like Claude) can use. The model sees your tool descriptions, understands what they do, and calls them as needed to fulfill user requests.

### The Naive Approach: Direct API Wrapping

I started with what seemed obvious: create a thin wrapper around the existing YNAB Python SDK. Each MCP tool would correspond to one API endpoint, passing through the full response. This is a common pattern I've seen in many MCP implementations.

```python
# Naive approach: Just wrap the SDK
@mcp.tool()
async def get_budget(budget_id: str) -> str:
    response = ynab_client.budgets.get_budget(budget_id)
    return json.dumps(response.data.budget)  # Return everything
```

This approach works, technically. The model gets access to the data. But there's a critical problem: **API responses are designed for applications, not for AI context windows.**

Traditional applications can process, filter, and cache data efficiently, so APIs return comprehensive data structures optimized for completeness, not token efficiency. A single endpoint might return thousands of fields because the API designers don't know which specific fields your application needs.

AI models work differently. Every byte consumes precious context window space—space you could use for reasoning, conversation history, or additional tool calls. When you blindly pass through full API responses, you're asking the model to pay the "context tax" for data it might not even need. Worse, the model has to analyze and determine which parts of that data are actually relevant—a cognitive load that can lead to errors or missed information.

To put this in perspective: tool results compete with everything else for context space. In a real Claude Code session (visible via `/context`), I saw the context window at 118k/[200k tokens](https://docs.anthropic.com/en/docs/about-claude/models) (59%)—before I'd even started a conversation. MCP tool definitions alone consumed 47.9k tokens (24%), system tools used 17.3k tokens (9%), custom agents took 2.4k tokens, and memory files added another 2.3k tokens. That's 59% of the context window used just by the environment.

A naive MCP that returns 30k tokens for a budget overview would push that to 74% in a single tool call—leaving just 52k tokens for the actual conversation, reasoning, and additional tool calls. Every inefficient tool response eats into the space you need for multi-turn conversations.

This realization fundamentally changed how I approached the design: MCPs need to be context-aware intermediaries, not transparent proxies. The question shifted from "How do I expose this API to the model?" to "What does the model actually need to help the user?"

## Three Design Principles for Context-Efficient MCPs

One of the first things I wanted to do was check my budget overview - see my accounts, categories, and how I'm tracking for the current month. A straightforward use case that any budgeting tool should support.

My initial thought was to create tools that directly wrapped the YNAB API endpoints. Let's take the accounts endpoint as an example. Here's what the API returns:

```json
{
  "data": {
    "accounts": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Checking Account",
        "type": "checking",
        "on_budget": true,
        "closed": false,
        "note": "Primary checking",
        "balance": 125000,
        "cleared_balance": 120000,
        "uncleared_balance": 5000,
        "transfer_payee_id": "...",
        "direct_import_linked": true,
        "direct_import_in_error": false,
        "last_reconciled_at": "2025-11-05T18:27:20.140Z",
        "debt_original_balance": 0,
        "debt_interest_rates": {},
        "debt_minimum_payments": {},
        "debt_escrow_amounts": {},
        "deleted": false
      }
      // ... 46 more accounts
    ]
  }
}
```

For **my 47 accounts**, this API response contains **18 fields per account**. Many of these fields are irrelevant for typical budget questions:
- Debt interest rates and minimum payments (only relevant for debt accounts)
- Direct import status (internal system state)
- Cleared vs uncleared balance breakdown (too granular for overview)
- Transfer payee IDs (internal references)
- Last reconciliation date (accounting detail)

When you're answering budget questions, these internal bookkeeping details just create noise.

A naive wrapper would return all 18 fields × 47 accounts = **9,960 tokens**.

But here's what I actually need to answer questions like "What's my checking account balance?" or "How much do I have across all accounts?":
- Account name
- Account type
- Balance
- Whether it's on-budget
- Whether it's closed

That's it. Just 6 fields. Here's the filtered implementation:

**For accounts (47 accounts):**

```python
# src/ynab_mcp/ynab_client.py
async def get_accounts(self, budget_id: str) -> list[dict[str, Any]]:
    """Get all accounts for a budget."""
    response = self.client.accounts.get_accounts(budget_id)
    accounts = []

    for account in response.data.accounts:
        # Skip deleted accounts entirely
        if account.deleted:
            continue

        # Return only the fields the model actually needs
        accounts.append({
            "id": account.id,
            "name": account.name,
            "type": account.type,
            "on_budget": account.on_budget,
            "closed": account.closed,
            "balance": account.balance / 1000 if account.balance else 0,
        })

    return accounts
```

**Filtered approach (6 essential fields):** 3,451 tokens for 47 accounts

**Reduction: 65.4%** by removing 12 unnecessary fields that the model doesn't need for typical budget questions.

### The Full Budget Overview

Of course, checking accounts is just one part of viewing your budget. A complete budget overview requires three tool calls:

**Naive approach (no filtering):**
- Accounts (all fields): 9,960 tokens
- Categories (all, including hidden): 12,445 tokens
- Monthly summary (estimated): ~8,000 tokens
- **Total: ~30,405 tokens**

**Context-efficient approach:**
- Accounts (filtered): 3,451 tokens
- Categories (visible only): 8,620 tokens
- Monthly budget summary: 6,808 tokens
- **Total: ~18,879 tokens**

**Workflow reduction: 38% fewer tokens** for the same functionality - a complete picture of my budget for the current month. This leaves plenty of room in Claude's context window for conversation history, reasoning, and additional tool calls.

But it's not just about saving tokens. By filtering out unnecessary data, I'm also **improving model accuracy**. When Claude doesn't see fields like `debt_escrow_amounts` or `direct_import_in_error`, it can't get confused by them or incorrectly incorporate them into calculations. The model focuses on exactly what matters: account names, balances, and budget status.

The key insight: **the model doesn't need to see all the data to work with it effectively**. In fact, it works *better* with less data. By doing the filtering in the tool layer, I kept the context window lean while maintaining full functionality and improving reliability.

The filtering techniques I'd learned from accounts and categories immediately paid off when I tackled the next challenge: helping Claude categorize uncategorized transactions.

## Categorizing Transactions

One of the workflows I wanted help with was taking uncategorized transactions and suggesting categories for them. This would help me ensure that my budget was accurate and up-to-date. To do this I created a tool that would fetch all uncategorized transactions from YNAB and get a list of the categories available in the budget.

On the first pass I noticed something unusual. Claude was recommending categories that were hidden in my budget - old categories I no longer used but hadn't deleted. I quickly realized that the YNAB REST API doesn't provide a way to exclude hidden categories in the API call itself. That meant I had two options:

1. Include instructions in my tool description telling Claude to ignore hidden categories
2. Filter them out in the tool code before returning data to Claude

I chose option 2. Here's why: every instruction you add to a tool description consumes context window. More importantly, it puts the burden of filtering on the model. This means we're knowingly giving the model more data than it needs, forcing it to do more work and potentially allowing the model to make mistakes.

It's worth emphasizing: tool descriptions themselves consume context tokens. In my Claude Code session, MCP tool definitions consumed 47.9k tokens (24% of the context window) before any tools were even called. Every line of documentation, every parameter description, every usage instruction adds up. This creates a tension: you want clear, helpful descriptions, but verbose documentation eats into the space available for actual tool results and conversation.

The solution isn't to write minimal descriptions—clarity matters. Instead, keep descriptions focused on what the tool does and its parameters, and handle behavior rules (like "ignore hidden items") in your implementation code rather than in lengthy instructions. Instead, I implemented filtering at the tool layer:

```python
def _filter_categories(
    self, categories: list[dict[str, Any]], include_hidden: bool = False
) -> list[dict[str, Any]]:
    """Filter categories to exclude hidden/deleted ones by default."""
    filtered = []
    for category in categories:
        # Always skip deleted categories
        if category.get("deleted"):
            continue
        # Skip hidden categories unless explicitly included
        if not include_hidden and category.get("hidden"):
            continue
        filtered.append(category)
    return filtered
```

Then I exposed this as a parameter in the tool:

```python
@mcp.tool()
async def get_categories(budget_id: str, include_hidden: bool = False) -> str:
    """Get all categories for a budget.

    Args:
        budget_id: The ID of the budget (use 'last-used' for default budget)
        include_hidden: Include hidden categories and groups (default: False)

    Returns:
        JSON string with category groups and categories
    """
```

This approach gave me the best of both worlds: by default, Claude only sees active categories, but I can still access hidden categories when needed (like when I wanted to identify old balances that needed cleanup). This saved **30.7% of tokens** per category list request (from 12,445 to 8,620 tokens by filtering out 69 hidden categories) while improving accuracy.

### Design Principle #1: Filter at the Source

Do data filtering in your tool code rather than relying on prompt instructions. This saves tokens and prevents errors.

## Historical Spending Analysis

Next, I wanted to be able to ask questions about my historical spending. Questions like "How much did I spend on groceries last month?" or "What categories am I overspending in?" would be really useful.

My first instinct was to create a tool that fetched all transactions for a date range and let Claude analyze them. But I quickly realized this approach had serious problems.

To illustrate, let me show you the real numbers for my 2024 transactions:
- **Total transactions in 2024:** 3,456
- **Fields per transaction:** 14 (id, date, amount, memo, account_name, payee_name, category_name, cleared, approved, etc.)
- **Average per transaction:** ~216 tokens

Now extrapolate this to common queries:
- **1 month** of transactions (~284 txns): ~61,368 tokens
- **3 months** of transactions (~852 txns): ~184,106 tokens
- **6 months** of transactions (~1,704 txns): ~368,213 tokens
- **1 year** of transactions (3,456 txns): **~746,800 tokens**

The problems with this approach:
1. **Token usage**: A full year query would consume **746,800 tokens** - that's 3.7x larger than Claude Sonnet 4.5's entire 200k context window! You literally couldn't fit a year of transactions in a single request.
2. **Speed**: Transferring and parsing thousands of transaction objects is slow
3. **Analysis burden**: Claude would need to group, sum, and calculate averages on raw data
4. **Wasted context**: Most of those 14 fields per transaction aren't relevant to "how much did I spend?"

Even a modest 3-month query would consume 184k tokens - using 92% of the available context window just for raw transaction data. This leaves almost no room for Claude to maintain conversation history, reason about the results, or make additional tool calls to answer follow-up questions.

Instead, I realized these calculations could easily be handled in the tool layer. Here's what the aggregation logic looks like:

```python
async def get_category_spending_summary(
    self,
    budget_id: str,
    category_id: str,
    since_date: str,
    until_date: str,
    include_graph: bool = True,
) -> dict[str, Any]:
    """Get spending summary for a category over a date range."""

    # Fetch transactions from API
    result = await self._make_request_with_retry("get", url, params=params)
    txn_data = result["data"]["transactions"]

    # Aggregate in tool layer
    total_spent = 0
    transaction_count = 0
    monthly_totals = {}

    for txn in txn_data:
        # Filter by category and date range
        if txn.get("category_id") != category_id:
            continue
        if txn["date"] > until_date:
            continue

        # YNAB stores amounts in milliunits (e.g., $125.00 = 125000)
        amount = txn["amount"] / 1000 if txn.get("amount") else 0
        total_spent += amount
        transaction_count += 1

        # Build monthly breakdown
        month_key = txn["date"][:7]  # YYYY-MM
        if month_key not in monthly_totals:
            monthly_totals[month_key] = 0
        monthly_totals[month_key] += amount

    # Calculate average per month
    num_months = len(monthly_totals) if monthly_totals else 1
    average_per_month = total_spent / num_months if num_months > 0 else 0

    # Return only the summary
    return {
        "category_id": category_id,
        "date_range": {"start": since_date, "end": until_date},
        "total_spent": total_spent,
        "transaction_count": transaction_count,
        "average_per_month": average_per_month,
        "monthly_breakdown": [
            {"month": month, "spent": amount}
            for month, amount in sorted(monthly_totals.items())
        ],
    }
```

The impact was dramatic. Let me show you a real example from my implementation:

**Scenario:** Analyze 6 months of spending for a single category (22 transactions)

- **Before (returning raw transactions)**: 4,890 tokens
- **After (pre-aggregated summary)**: 262 tokens
- **Reduction**: 94.6%

The aggregated response includes:
- Total spent
- Average per month
- Transaction count
- Monthly breakdown (array of {month, amount} objects)

That's everything Claude needs to answer questions like "Am I spending more on groceries this year than last year?" without having to receive, parse, and aggregate dozens of individual transaction records.

### Design Principle #2: Pre-Aggregate Data

Pre-calculate aggregations, summaries, and statistics in your tool code. Return insights, not raw data. This keeps your context window lean while still giving the model everything it needs to help users.

While filtering and aggregation solved the token efficiency problem, I ran into a different challenge: the API itself had limitations.

## Building Tools for Unsupported Actions

While working on the workflow to have Claude help me categorize transactions, I realized I needed a way to split a transaction across multiple categories. For example, a Costco purchase might include $150 of groceries, $50 of household items, and $30 of gas.

Unfortunately, the YNAB API does not provide a way to convert an existing transaction into a split transaction. The API only allows creating NEW transactions with splits. This was a real limitation - but it presented an opportunity to think creatively about tool design.

Instead of telling users "sorry, the API doesn't support this," I created a tool that works within the API's constraints:

```python
@mcp.tool()
async def prepare_split_for_matching(
    budget_id: str,
    transaction_id: str,
    subtransactions: str,
) -> str:
    """Prepare a split transaction to match with an existing imported transaction.

    This tool fetches an existing transaction's details and creates a new UNAPPROVED split
    transaction with the same date, amount, account, and payee. You can then manually match
    them together in the YNAB web or mobile UI.

    Workflow:
        1. This tool fetches the existing transaction details
        2. Creates a new unapproved split transaction with those details
        3. You manually match them in the YNAB UI
        4. YNAB merges them into one split transaction

    Note:
        - The new split is created as UNAPPROVED for manual matching
        - The sum of subtransaction amounts should equal the original transaction amount
    """
```

The implementation:

```python
async def prepare_split_for_matching(
    self,
    budget_id: str,
    transaction_id: str,
    subtransactions: list[dict[str, Any]],
) -> dict[str, Any]:
    # Fetch the original transaction details
    original = await self.get_transaction(budget_id, transaction_id)

    # Create a new split transaction with the same details but unapproved
    new_split = await self.create_split_transaction(
        budget_id=budget_id,
        account_id=original["account_id"],
        date=original["date"],
        amount=original["amount"],
        subtransactions=subtransactions,
        payee_name=original.get("payee_name"),
        memo=original.get("memo"),
        cleared=original.get("cleared", "uncleared"),
        approved=False,  # Key: create as unapproved for matching
    )

    return {
        "original_transaction": original,
        "new_split_transaction": new_split,
        "instructions": (
            "A new unapproved split transaction has been created. "
            "Go to YNAB and manually match these two transactions together. "
            "Look for the match indicator in the YNAB UI."
        ),
    }
```

This solution works because YNAB has a built-in "matching" feature where it can merge a manually-entered transaction with an imported one. By creating the split as unapproved, YNAB's UI will detect the duplicate and offer to match them. When you accept the match, the imported transaction becomes a proper split transaction.

Is this ideal? No - I'd prefer a direct API endpoint. But it's a pragmatic solution that works within the constraints of the underlying platform while still providing value to the user.

### Design Principle #3: Work Within API Constraints

When an API doesn't support something directly, look for workflows that combine available operations to achieve the desired outcome.

## Real-World Token Reduction Results

Here's a summary of the optimizations applied across the YNAB MCP, with real measured token counts:

| Tool/Workflow | Naive Approach | Optimized | Reduction | Technique Applied |
|---------------|----------------|-----------|-----------|-------------------|
| **Accounts** | 9,960 tokens (18 fields) | 3,451 tokens (6 fields) | 65.4% | Field filtering |
| **Categories** | 12,445 tokens (all) | 8,620 tokens (visible) | 30.7% | Default filtering + opt-in |
| **Budget Overview** | ~30,405 tokens | ~18,879 tokens | 38% | Combined filtering |
| **Category Spending (6mo)** | 4,890 tokens (raw txns) | 262 tokens (summary) | 94.6% | Pre-aggregation |
| **Year of Transactions** | 746,800 tokens | 262 tokens | 99.96% | Pre-aggregation |

### When to Apply Each Technique

**Field Filtering** (accounts, categories)
- Use when: API returns many fields, but only subset is needed for common queries
- Savings: Moderate (30-65%)
- Complexity: Low - simple field selection
- Example: Remove debt details from non-debt accounts, skip internal IDs like `transfer_payee_id`, drop reconciliation timestamps
  ```python
  # Instead of returning all 18 fields, return only what matters
  return {
      "id": account.id,
      "name": account.name,
      "balance": account.balance / 1000,
      "on_budget": account.on_budget
  }
  ```

**Default Filtering with Parameters** (hidden categories)
- Use when: Some data is rarely needed but occasionally useful
- Savings: Moderate (30-40%)
- Complexity: Low - add optional boolean parameter
- Example: Hide deleted/archived items by default, expose via `include_deleted` flag

**Pre-aggregation** (spending analysis)
- Use when: Model would need to compute summaries from raw data
- Savings: High (90-99%)
- Complexity: Medium - requires aggregation logic
- Example: Return monthly totals instead of individual transactions

**Creative Workarounds** (split transactions)
- Use when: API doesn't support desired operation directly
- Savings: Enables new functionality (not about tokens)
- Complexity: High - requires understanding API constraints
- Example: Multi-step workflows that achieve goals indirectly

### How to Measure Your Own MCP

You might be wondering: how did I get these specific numbers? Here's my methodology—and how you can apply it to your own MCPs.

All the numbers in this post came from real measurements. Here's how I validated the optimizations, and how you can do the same for your MCP:

#### 1. Set Up Token Counting

Install [tiktoken](https://github.com/openai/tiktoken), OpenAI's tokenizer library (Claude uses a similar tokenization scheme):

```bash
pip install tiktoken
```

Create a helper function to count tokens:

```python
import tiktoken

def count_tokens(text: str) -> int:
    """Count tokens using tiktoken's cl100k_base encoding."""
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))
```

#### 2. Measure API Responses

Create a script that fetches data both ways and compares:

```python
import json

# Get raw API response
raw_response = api.get_accounts(budget_id)
raw_json = json.dumps(raw_response, indent=2)
raw_tokens = count_tokens(raw_json)

# Get your filtered response
filtered_response = your_mcp_tool.get_accounts(budget_id)
filtered_json = json.dumps(filtered_response, indent=2)
filtered_tokens = count_tokens(filtered_json)

# Compare
reduction = ((raw_tokens - filtered_tokens) / raw_tokens) * 100
print(f"Raw: {raw_tokens:,} tokens")
print(f"Filtered: {filtered_tokens:,} tokens")
print(f"Reduction: {reduction:.1f}%")
```

#### 3. Test Real Workflows

Don't just measure individual tools - measure complete workflows users will perform:

```python
# Simulate a budget overview workflow
accounts = your_mcp.get_accounts(budget_id)
categories = your_mcp.get_categories(budget_id, include_hidden=False)
summary = your_mcp.get_budget_summary(budget_id, current_month)

total_tokens = (
    count_tokens(json.dumps(accounts)) +
    count_tokens(json.dumps(categories)) +
    count_tokens(json.dumps(summary))
)

print(f"Budget overview workflow: {total_tokens:,} tokens")
```

This revealed that my budget overview workflow uses ~19k tokens - well within Claude's [200k context window](https://docs.anthropic.com/en/docs/about-claude/models) with room to spare.

#### 4. Watch for Runtime Warnings

Claude Code will warn you when tool responses exceed ~10k tokens. If you see these warnings frequently, it's a signal to investigate:

> ⚠️ Large MCP response (~12.5k tokens), this can fill up context quickly.

These warnings helped me identify which tools needed optimization.

#### 5. Validate Correctness

Token reduction means nothing if your tools return incorrect data. Always verify:
- Does the filtered data answer the user's questions?
- Are calculations accurate? (spot-check aggregations against raw data)
- Does pagination work correctly? (ensure you're not computing on partial datasets)

The goal isn't to minimize tokens at all costs - it's to return exactly what the model needs, nothing more, nothing less.

## Limitations and Trade-offs

This context-efficient approach works well for YNAB, but it's not without limitations. Before applying these patterns to your own MCP, consider these trade-offs:

**Pre-aggregation assumes query patterns.** If users ask questions that need raw transaction details (like "show me the memo for my largest grocery purchase"), the aggregated data won't help. You'll need additional tools that return raw data for those cases.

**Filtering loses flexibility.** By removing fields, you can't answer questions that need those fields without making additional API calls. The key is knowing your use cases. For budget analysis and categorization, these trade-offs are worth it. For transaction-level forensics, you might need different tools.

**Caching complexity.** Pre-computed aggregations need invalidation strategies when data changes. If your underlying data updates frequently, you'll need to think carefully about cache freshness and when to recompute.

**Development overhead.** Writing aggregation logic and filtering code is more work than simple pass-through wrappers. You're trading implementation time for runtime efficiency. For frequently-used tools, this is usually worth it.

The goal isn't to optimize every tool to the extreme. It's to identify the high-impact workflows—the ones users will perform repeatedly—and optimize those intelligently.

## Key Takeaways

- **Context is expensive**: In real Claude Code sessions, MCP tool definitions can consume 24% of the 200k context window before any tools are called
- **Measure everything**: Use tiktoken to count tokens on API responses before and after optimization
- **Filter proactively**: Removing 12 unnecessary fields from 47 accounts reduced tokens by 65.4%
- **Aggregate strategically**: Pre-computing spending summaries reduced a 6-month query by 94.6%
- **Design for the model**: Ask "What does the model need?" not "What does the API provide?"
- **Default to minimal data**: Return only what's necessary by default, with optional parameters for edge cases
- **Validate with real workflows**: Test complete user flows, not just individual tools, to understand cumulative token impact

## Conclusion

Building a context-efficient MCP requires a mindset shift: design for what the model needs, not just what the API provides. The three principles I learned—filter at the source, compute in tools, and work within constraints creatively—apply to any MCP wrapping an external API.

Through careful design, the YNAB MCP achieves dramatic efficiency:
- Budget overview: 38% reduction (30k → 19k tokens)
- Spending analysis: 94.6% reduction (4.9k → 262 tokens)
- Category filtering: 30.7% reduction (12.4k → 8.6k tokens)

These aren't theoretical—they're real measurements from actual usage. Context is expensive, and every token matters when you're building tools for multi-turn conversations.

If you're building an MCP, start by asking: "What does the model actually need to answer the user's question?" Not "What does the API return?" That mindset shift makes all the difference.

## Further Reading

If you want to dive deeper into MCP development and context optimization:

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/) - Official MCP spec and documentation
- [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) - Anthropic's engineering blog on building with MCP
- [Most devs don't understand how context windows work](https://youtu.be/-uW5-TaVXu4?si=GBCXG3Q5QcfEdvnJ) - Deep dive into context window fundamentals and practical management strategies
- [YNAB API Documentation](https://api.ynab.com/) - The API this MCP wraps
- [Anthropic's Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) - Understanding context windows and token efficiency

The full YNAB MCP implementation is available at [github.com/dgalarza/ynab-mcp-dgalarza](https://github.com/dgalarza/ynab-mcp-dgalarza) if you want to dive deeper into the code. I'd love to hear about the context optimization techniques you've discovered in your own MCP projects.

