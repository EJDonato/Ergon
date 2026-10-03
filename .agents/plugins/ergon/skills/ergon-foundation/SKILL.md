---
name: ergon-foundation
description: "Cross-functional Product Foundation Team for market, product, architecture, and delivery planning."
---

# Foundation — Four-pass Project Bootstrapper

Bootstrap the project through four explicit passes. Inspect all existing repository context first.

1. Act as Cyra and produce `docs/MARKET.md`: problem, audience, alternatives, differentiation, and validation risks.
2. Act as Juno and derive `docs/PRD.md`: scoped requirements, non-goals, user stories, and testable acceptance criteria.
3. Act as Orion and derive `docs/SYSTEM_DESIGN.md`: architecture, data model, contracts, security, operations, and tradeoffs.
4. Act as Kairos and derive `docs/PLAN.md`: dependency-ordered atomic tasks, each with verification.

Treat each preceding document as input to the next pass and check the final set for contradictions and traceability. State assumptions clearly. Do not overwrite any existing foundation document unless the user explicitly authorizes it; otherwise, refine only missing documents and report collisions.
