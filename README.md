# Ergon

Ergon installs a curated set of portable AI-agent skills into Claude Code, Codex CLI, Antigravity, Cursor, and Windsurf projects. The built-in registry works offline and every generated file is ordinary, editable Markdown.

## Quick start

```bash
npx ergon init --runner codex
npx ergon add foundation --runner claude
npx ergon add backend --runner cursor
npx ergon list
```

When `--runner` is omitted, Ergon detects existing `.claude`, `.codex`, `.agy`, and `.cursor` configuration. If no marker is found in an interactive terminal, it asks which runners to configure. In CI or another non-interactive shell, pass `--runner` explicitly.

Existing files are preserved by default. Pass `--force` to replace generated skill files:

```bash
npx ergon add market --runner codex --force
```

## Included skills

| Skill | Persona | Purpose |
| --- | --- | --- |
| `market` | Cyra | Market, audience, competitors, and positioning |
| `prd` | Juno | Scoped product requirements and acceptance criteria |
| `arch` | Orion | Architecture, schemas, contracts, and tradeoffs |
| `plan` | Kairos | Dependency-aware implementation tasks |
| `foundation` | Cyra → Juno → Orion → Kairos | Complete four-pass project foundation |
| `backend` | Kael | Server, persistence, validation, and integrations |
| `frontend` | Iris | Responsive and accessible product interfaces |
| `qa` | Argus | Unit, integration, and end-to-end quality coverage |
| `sec` | Aegis | Read-only application security audits |

`ergon add foundation` installs the four individual foundation personas and the composite pipeline. `ergon add specialists` installs all four implementation specialists. `ergon init` installs all nine skills.

## Runner outputs

| Runner | Generated path |
| --- | --- |
| Claude Code | `.claude/commands/<skill>.md` |
| Codex CLI | `.codex/skills/<skill>/SKILL.md` |
| Antigravity | `.agy/skills/<skill>.md` |
| Cursor / Windsurf | `.cursor/rules/<skill>.mdc` |

## Commands

```text
ergon init [--runner <runner>] [--force]
ergon add <skill-or-bundle> [--runner <runner>] [--force]
ergon list
ergon --help
```

Supported runner IDs are `claude`, `codex`, `agy`, and `cursor`.

## Development

The published CLI supports Node.js 18 or later. Developing and running the current test toolchain requires Node.js 20 or later.

```bash
npm install
npm run typecheck
npm test
npm run build
node bin/ergon.js list
```

Canonical skills live in `skills/` as a `skill.yaml` manifest plus `prompt.md`. The CLI validates manifests, transforms prompts through runner adapters, and uses collision-safe atomic writes. It performs no telemetry or network access for bundled skills.

## License

MIT
