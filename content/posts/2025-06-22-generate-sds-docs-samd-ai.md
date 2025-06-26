---
layout: post
title: "The AI Prompt I Wish I Had While Documenting SaMD Systems in Rails"
description: "How AI could have helped me generate FDA audit-ready SDS documentation faster while building regulated software."
date: 2025-06-21
author: Damian Galarza
keywords:
  - SaMD
  - SDS
  - DHF
  - AI prompt engineering
  - FDA compliance,
  - Rails
  - Software Design Specification
  - Design History File
---

At Buoy Software, I led the design and development of our first **Software as a Medical Device (SaMD)**, which was my first experience operating within an FDA-regulated environment. It was a great learning experience, but it came with a lot of heavy documentation. One of the most time-consuming parts was compiling the Design History File (DHF) — the set of artifacts that describe how the system was built and tested. A central piece of that file is the Software Design Specification (SDS), which describes the behavior, design, and rationale for each component in the system.

For every Rails class we shipped, we had to trace requirements, detail business logic and interfaces, and map out risk controls — all in a format that is audit-ready for FDA review.

This post kicks off a series called ‘AI Prompts I Wish I Had’, sharing prompts that could’ve made our engineering workflows smoother while building regulated software.

The goal of this series is to offer **practical, high-context AI prompts** that help teams move faster toward an FDA submission — without compromising quality, traceability, or compliance.

---
## 🧠 The Prompt

```markdown
# SDS Documentation Prompt

You are a SaMD software engineer generating regulatory documentation.
I will provide you with one or more Ruby/Rails classes used in a regulated
Software as a Medical Device (SaMD) product.

Based on the code I provide, generate a **Software Design Specification (SDS)** entry suitable
for inclusion in a Design History File (DHF).

Your output should include:

1. **Component Name**  
2. **Purpose / Role in the System**  
3. **Description of Logic / Behavior** – Provide detailed explanations including:
   - Specific business rules with exact criteria and thresholds  
   - All possible status values/enums with definitions of what each represents  
   - Step-by-step process flows with decision points  
   - Data validation rules and constraints  
   - Error handling and edge cases  

4. **External Interfaces** – Include:
   - Specific API endpoints and GraphQL mutations/queries  
   - Database table names and key fields  
   - Session storage keys and data structures  
   - Third-party service integrations  

5. **How It Satisfies Specific SRS Requirements** – Expand on:
   - Security controls with implementation details  
   - Audit logging mechanisms and what data is captured  
   - Regulatory compliance features  
   - Data integrity safeguards  

6. **Design Considerations** – Detail:
   - Security flags and their enforcement mechanisms  
   - Session state management and validation logic  
   - Performance optimizations and their rationale  
   - Safety mechanisms and fail-safes  

7. **Traceability Notes** – Include:
   - Specific risk control implementations  
   - Audit trail mechanisms (PaperTrail, analytics events, etc.)  
   - Logging infrastructure for regulatory compliance  
   - Known technical limitations with business impact  

**Additional Requirements:**
- **No abbreviations or “etc.”** – List all status values, rules, and conditions explicitly  
- **Implementation details** – Show actual code snippets for critical security or compliance logic  
- **Business rule explanations** – Explain the medical/regulatory rationale behind complex rules  
- **Security deep-dive** – Cover authentication, authorization, session management, and data protection  
- **Audit compliance** – Document all logging, tracking, and audit trail mechanisms required for regulatory review

Format the output in Markdown with headers for each section. Be comprehensive, technical, and audit-ready.
```

**Example usage:** 

```markdown
The system we are documenting is located within `packs/authentication`.

I want documentation covering the login and session management flow for users.  

How does the system validate credentials?
How is the session established and managed?
What audit trails are recorded for access attempts?
```

Like anything generated with AI it requires a careful review, but this prompt can help you quickly generate a starting point for a comprehensive SDS entry that meets FDA requirements. It ensures that you cover all necessary aspects of the system's design and behavior, making it easier to compile your Design History File.

Let me know if this is helpful — and if you want me to share the next prompt in this series.

If you're building a SaMD or working in a regulated domain and want help tuning your dev workflows with AI, reach out.
