---
layout: post
description: "Customer obsession can sharpen focus and drive urgency—but left unchecked, it burns out teams and breaks products. Here's how to get it right."
title: "Startup Software in a Regulated World — Without Slowing Down"
summary: "We built the internal platform that powered Join Parachute’s first plasma collection center and scaled it to 26+ FDA-licensed sites. This post shares how we delivered under tight timelines, aligned with regulatory requirements, and laid the groundwork for our first FDA-cleared SaMD — all while maintaining startup speed."
home_summary: "I led the development of internal software that supported Join Parachute’s first plasma center and scaled to 26+ FDA-licensed sites. Built under tight deadlines and complex SOPs, the system later became the foundation for our first FDA-cleared SaMD. This post shares how we moved fast — without compromising compliance or reliability."
og_image: "images/posts/og-building-compliant-startup-software.png"
date: 2025-07-10
author: Damian Galarza
tags: ["rails", "regulatory-compliance", "operational-software", "mvp", "product-strategy", "startup-advice", "case-study"]
keywords:
  - building software in regulated environments
  - startup software delivery
  - plasma center software
  - how to build audit-ready software
---

When we launched our internal donor operations platform to support [Join Parachute’s](http://www.joinparachute.com) first plasma center, it wasn’t formally FDA-regulated — but it operated like it was.

The system supported the launch of Join Parachute’s very first plasma collection center — a pilot site that couldn’t legally  sell plasma without passing FDA inspections. That meant every workflow, audit trail, and failure mode had real regulatory consequences. Even though we weren’t submitting the software for 510(k) clearance (yet), it had to be audit-ready from day one.

At the time, I was VP of Engineering at Buoy, leading architecture, delivery, and cross-functional alignment across product, regulatory, and operations. We built internal systems from scratch and scaled them across dozens of licensed centers — all while maintaining startup speed in a compliance-heavy domain.

This post unpacks the architectural and process decisions we made — and what matters most when you’re building software in high-stakes, regulated environments.

## The Timeline

In August of 2020, as we prepared to open Join Parachute’s first center, we faced a familiar startup question: build a tightly integrated platform in-house, or piece together existing tools. Both had their benefits. Using something off the shelf would let us move quickly with a proven solution. Our end goal, however, was to build a rich experience for both the donors and the centers themselves. We believed owning the full ecosystem would deliver the most value — for both the center and the donor base. We already had built our MVP mobile application for donors. Now we needed to build the operational layer beneath it.

With this in mind we had a target date in place, launching Join Parachute’s first donation center in December of 2020. Construction was underway, SOPs were still in flux, and our team was small: three senior engineers (including myself), our VP of Product and Design, our founder/CEO, and a subject matter expert from Join Parachute.

With the timeline set and the roadmap clear we knew we had to balance velocity with setting up a strong foundation for future growth. We needed to build a system that could scale across multiple centers, support complex workflows, and be ready for FDA scrutiny — all while delivering a great user experience for donors and staff.

## The Tech Stack

Our donor mobile app was built in React Native, powered by a GraphQL API within our Ruby on Rails application. To maintain velocity and reduce context switching, we decided to build our platform using the same stack: a React front-end inside our Rails application backed by our existing GraphQL API. While this helped early on, we’d later outgrow this setup as complexity and team size increased — but for the pilot, it gave us the speed we needed. You can learn more about our future migration [here](/posts/2024-09-05-react-to-view-components).

One of GraphQL’s biggest strengths — its flexible, single-endpoint structure — gave us the ability to move quickly without needing to rethink backend patterns for every new UI.

The system also included a donor-facing check-in kiosk, delivered as a React Native iOS app for iPads. This allowed us to reuse components and APIs across platforms with minimal overhead.

To divide the roadmap efficiently, we split responsibilities: one engineer handled the kiosk app, one focused on authentication, and I led the design of the center’s core operational workflows.

## Designing the Internal Systems

The donor journey in the center was the least defined — and also the most critical. I took ownership of that piece, building a foundation the rest of the team could extend once their features were in place.

My goal was to build a repeatable framework that the rest of the team could use when they were done with their pieces of the roadmap and were able to swing in to support the donor journey work. In order to accomplish this we needed to understand the needs of a donor center. What flows existed, what roles and responsibilities existed in the centers and what the donor journey looked like in a center. This meant more than just understanding how users were going to use our software but also the physical layout — how donors navigated the center and how staff were allocated throughout.

Because this software would be relied on during FDA inspections, we also had to ensure full audit traceability. That meant building robust logging for donor flow events, role-based action histories, and clear handoffs between stations — all timestamped and attributable. Every action needed to be traceable to a person, a device, and a time. These constraints influenced everything from how we structured data models to how we handled failures and retries.

We broke the donor journey into five core flows:

- New Donor Registration
- Donor Screening
- Physicals
- Quality Review
- Donor Floor (Plasmapheresis)

Each of these stages was effectively its own system — with branching logic, role-based access, and multiple points where a donor could be deferred based on medical history, vitals, or other SOP-driven criteria, ending the visit on the spot.

I designed a modular queue-based system to model this. Each flow was represented as a queue with discrete steps, validations, and transitions. This made it easier to:

- Model SOPs as workflows
- Track where donors were in the process
- Support conditional paths and deferrals

Take “Donor Screening,” for example: it might include vitals entry, medical history questions, and deferral checks — each represented as a discrete validation step in the queue. More importantly, the queue-based approach gave the team a consistent foundation to build on — one that could scale across centers and evolve as we refined operational needs.

## Process

Shipping under tight timelines meant optimizing for alignment, iteration, and speed of decision-making. We couldn’t afford long design cycles or exhaustive specs — instead, we focused on:

- Daily standups to ensure visibility and quick unblockers
- Frequent design reviews with product, design, and our subject matter expert
- Shared ownership of goals, not just features — everyone understood how our work connected to operational readiness and SOPs

By staying tightly aligned across engineering, product, and regulatory, we were able to adjust quickly as new requirements surfaced — often mid-cycle — without losing momentum.

## What Happened Next

After a few months of focused, collaborative buildout, we launched our internal operations software in December 2020 — just in time for Join Parachute’s first plasma collection center to open.

Since then, Join Parachute has launched [dozens of plasma centers](https://www.joinparachute.com/plasma-donation/location/) across the U.S., all powered by the internal systems we built at Buoy.

Those same internal systems later served as the foundation for our first FDA-cleared Software as a Medical Device (SaMD): the Blood Product Questionnaire Module, cleared under 510(k) number [BK231004](https://www.fda.gov/vaccines-blood-biologics/substantially-equivalent-510k-device-information/bk231004-blood-product-questionnaire-module).

## What Founders Should Know

You don’t need to be in healthcare to feel the weight of regulation — or the complexity of operations. If your software powers physical sites, field teams, inspections, or other mission-critical workflows, the margin for error shrinks fast.

I’ve helped teams go from zero to production in those environments. I’ve made the tradeoffs, built the right foundations, and shipped fast — even when the stakes were high.

If you’re building software that needs to perform under pressure — whether that means regulatory readiness, ops complexity, or field execution — I can help.

👉 [Let’s talk](/#contact) — I help teams move fast — without cutting corners when it matters most.

*This post reflects my personal experience building software in a regulated environment and does not represent any official claims or product positioning by Buoy Software or Join Parachute.*
