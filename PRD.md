# Product Requirements Document: Ergon

**Identity:** Universal Skill & Persona Registry for Autonomous Coding Agents  
**Target Runners:** Claude Code, Antigravity (`agy`), Codex CLI, Cursor/Windsurf  
**Form Factor:** GitHub-hosted CLI package + installable plugin repository  
**Status:** Implementation Ready  
**Version:** 1.0.0  

---

## 1. Problem Statement

Modern coding agents (Claude Code, Codex, Antigravity) support custom workflows, slash commands, and persona rules, but configuration is fragmented and manual:
* Setting up multi-file personas (Product Manager, Backend Architect, QA Automation, AppSec) requires copying and pasting prompt markdown across every new project.
* Different agent runners expect files in different directories (`.claude/commands/`, `.codex/skills/`, `.agents/skills/`, `.cursor/rules/`, or project root instructions).
* There is no single package manager or central registry to install, update, or share curated, battle-tested agent workflows.

---

## 2. Product Objectives

* Provide a single CLI (`ergon`) to install curated skill bundles directly into any target repository.
* Map generic skill templates into runner-specific formats (Claude Code `.claude/commands/*.md`, Codex/Antigravity skills, Cursor `.cursorrules`).
* Support the core two-phase software delivery workflow:
  1. **Phase 1: Zero-Friction Foundation Drafting** (`/foundation` generating `MARKET.md`, `PRD.md`, `SYSTEM_DESIGN.md`, and `PLAN.md`).
  2. **Phase 2: Specialist Personas on Demand** (`/backend`, `/frontend`, `/qa`, `/sec`).

---

## 3. Core Feature Specifications

### 3.1 The Skill Registry Format

All skills live in the repository under a vendor-neutral template format:

```text
skills/
  foundation/
    market/                      # Cyra (Market Researcher)
      skill.yaml
      prompt.md
    prd/                         # Juno (Product Manager)
      skill.yaml
      prompt.md
    arch/                        # Orion (System Architect)
      skill.yaml
      prompt.md
    plan/                        # Kairos (Tech Lead & Planner)
      skill.yaml
      prompt.md
    pipeline/                    # Composite 4-pass /foundation bootstrapper
      skill.yaml
      prompt.md
  specialists/
    backend/                     # Kael (Backend Engineer)
      skill.yaml
      prompt.md
    frontend/                    # Iris (Frontend Developer)
      skill.yaml
      prompt.md
    qa/                          # Argus (QA & Test Specialist)
      skill.yaml
      prompt.md
    sec/                         # Aegis (Security Auditor)
      skill.yaml
      prompt.md
```

#### Manifest Example (`skills/foundation/market/skill.yaml`)
```yaml
id: market
name: Cyra - Market Researcher
persona: Cyra
version: 1.0.0
description: Analyzes market opportunity, competitors, and ICP into docs/MARKET.md
triggers:
  - market
  - cyra
targets:
  claude: ".claude/commands/market.md"
  codex: ".codex/skills/market/SKILL.md"
  agy: ".agents/skills/ergon-cyra/SKILL.md"
  cursor: ".cursor/rules/market.mdc"
```

---

### 3.2 The CLI Tool (`ergon`)

Distributed directly from GitHub with `npx --package github:EJDonato/Ergon ergon`; the unscoped npm package name `ergon` belongs to an unrelated project.

#### Command Set

```bash
# Auto-detects runner config and installs the default development bundle
npx --package github:EJDonato/Ergon ergon init

# Install foundation skills (full pipeline or individual personas)
npx --package github:EJDonato/Ergon ergon add foundation  # Full pipeline + all 4 personas
npx --package github:EJDonato/Ergon ergon add market      # Cyra (Market Researcher)
npx --package github:EJDonato/Ergon ergon add prd         # Juno (Product Manager)
npx --package github:EJDonato/Ergon ergon add arch        # Orion (System Architect)
npx --package github:EJDonato/Ergon ergon add plan        # Kairos (Tech Lead & Planner)

# Install specialist personas (bundle or individual)
npx --package github:EJDonato/Ergon ergon add specialists # All 4 specialists
npx --package github:EJDonato/Ergon ergon add backend     # Kael (Backend)
npx --package github:EJDonato/Ergon ergon add frontend    # Iris (Frontend)
npx --package github:EJDonato/Ergon ergon add qa          # Argus (QA Automation)
npx --package github:EJDonato/Ergon ergon add sec         # Aegis (Application Security)

# List available skills in the remote registry
npx --package github:EJDonato/Ergon ergon list

# Target a specific runner explicitly
npx --package github:EJDonato/Ergon ergon add market --runner claude
npx --package github:EJDonato/Ergon ergon add backend --runner codex
npx --package github:EJDonato/Ergon ergon add foundation --runner agy
```

#### Adapter & Path Matrix

The installer auto-detects existing repo configurations and transforms the template:

| Runner Target | Destination Path | Format Transformed |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/commands/<name>.md` | Frontmatter `description`, `$ARGUMENTS` interpolation |
| **Codex CLI** | `.codex/skills/<name>/SKILL.md` | OpenAI Codex skill layout & schema parameters |
| **Antigravity (`agy`)** | `.agents/skills/ergon-<persona>/SKILL.md` | Persona-namespaced Agent Skill exposed as `/ergon-<persona>` |
| **Cursor / Windsurf** | `.cursor/rules/<name>.mdc` | Markdown with rule application triggers |

---

## 4. Built-in Personas & Skill Specifications

All personas are designed with distinct specializations, triggers, and artifact outputs. They can be invoked individually or orchestrated in pipelines.

### 4.1 Foundation Suite (Specification & Architecture)

#### 4.1.1 Cyra (`/market`) — Market Researcher
* **Identity:** Observant, analytical market scout.
* **Scope:** Analyzes target demographics, user pain points, competitive moats, and monetization pathways.
* **Output:** Emits `./docs/MARKET.md`.
* **Constraints:** Focuses exclusively on market dynamics and strategic positioning; does not write technical architecture or code.

#### 4.1.2 Juno (`/prd`) — Product Manager
* **Identity:** Disciplined, user-centric product leader.
* **Scope:** Transforms concepts or `MARKET.md` into comprehensive product specs, core user stories, feature boundaries, and strict non-goals.
* **Output:** Emits `./docs/PRD.md`.
* **Constraints:** Derives requirements from identified user friction; establishes acceptance criteria for downstream engineering.

#### 4.1.3 Orion (`/arch`) — System Architect
* **Identity:** High-rigor structural engineer.
* **Scope:** Converts `PRD.md` into resilient technical architecture, database schemas, directory structure, tech stack choices, and API contracts.
* **Output:** Emits `./docs/SYSTEM_DESIGN.md`.
* **Constraints:** Must balance performance, maintainability, and delivery speed; enforces standard vendor-agnostic design patterns.

#### 4.1.4 Kairos (`/plan`) — Tech Lead & Task Planner
* **Identity:** Methodical, execution-oriented delivery coordinator.
* **Scope:** Breaks down `SYSTEM_DESIGN.md` into topologically sorted, atomic tasks with concrete acceptance tests and dependency graphs.
* **Output:** Emits `./docs/PLAN.md`.
* **Constraints:** Every task must be unit-testable or verifiable; avoids monolithic, ambiguous work items.

#### 4.1.5 Foundation Pipeline (`/foundation`) — 4-Pass Spec Bootstrapper
* **Goal:** Zero-friction project bootstrap executing the four foundation personas in automated sequence:
  1. **Cyra** → `./docs/MARKET.md`
  2. **Juno** → `./docs/PRD.md`
  3. **Orion** → `./docs/SYSTEM_DESIGN.md`
  4. **Kairos** → `./docs/PLAN.md`
* **Guarantees:** Will not overwrite existing docs unless called with `--force`.

---

### 4.2 Specialist Suite (Execution & Quality)

#### 4.2.1 Kael (`/backend`) — Senior Backend Engineer
* **Identity:** Pragmatic, contract-driven server engineer.
* **Scope:** Server runtimes, database schemas, ORM migrations, and API routes.
* **Constraints:** Reads `SYSTEM_DESIGN.md` contracts; strictly enforces request validation (e.g., Zod), type safety, error boundaries, and environment secret handling. Never touches UI.

#### 4.2.2 Iris (`/frontend`) — Senior Frontend Developer
* **Identity:** Design-conscious, UX/UI craftsman.
* **Scope:** Client components, pages/routes, responsive styling, state management, and interaction flows.
* **Constraints:** Inspects existing backend routes/types to avoid schema drift; ensures responsive layouts, accessible states (loading, empty, error), and clean component boundaries.

#### 4.2.3 Argus (`/qa`) — QA & Test Automation Specialist
* **Identity:** Relentless, skeptical bug hunter.
* **Scope:** Unit tests, integration test suites, and Playwright/Puppeteer E2E scripts.
* **Constraints:** Maps directly to acceptance criteria in `PRD.md` and `PLAN.md`; tests failure edge cases (unauthorized routes, empty states, boundary values). Cannot modify application source code to force tests to pass.

#### 4.2.4 Aegis (`/sec`) — Application Security Auditor
* **Identity:** Defensive, zero-trust security auditor.
* **Scope:** Read-only inspection of diffs, dependencies, and configuration.
* **Output:** Emits structured Markdown vulnerability audits covering injection flaws, broken authorization/IDOR, rate-limiting gaps, and credential leakage. Provides line-specific remediation diffs.

---

## 5. Non-Goals

* **No Custom Runtime Container/Sandbox:** `ergon` distributes prompt logic and skill assets; it relies on the target agent runner's native environment to execute commands.
* **No Remote Cloud Requirement:** The CLI works entirely over public Git URLs or local folders with zero SaaS sign-ins.
* **No Closed Formats:** Every installed skill is standard human-readable Markdown editable directly in the host repo.

---

## 6. Implementation Milestones

* **Milestone 1:** Create GitHub repository layout hosting the baseline templates (`foundation`, `backend`, `frontend`, `qa`, `sec`).
* **Milestone 2:** Implement the TypeScript CLI package (`ergon init` and `ergon add`) supporting Claude Code and Codex target directories.
* **Milestone 3:** Add Antigravity (`agy`) and Cursor/Windsurf adapter formats.
* **Milestone 4:** Add community repository support (`ergon add user/repo:skill-name`).
