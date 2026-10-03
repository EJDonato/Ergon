# Ergon

Ergon is an installable agent plugin and CLI containing a curated set of portable software-development skills. Install the whole team as a managed plugin in Codex, Claude Code, or Antigravity, or use the CLI when you intentionally want project-local files for Cursor, Windsurf, and other runners. Everything works without telemetry.

## Install as a plugin

The GitHub repository is a marketplace, so agents can install Ergon straight from `EJDonato/Ergon`.

### Codex

```bash
codex plugin marketplace add EJDonato/Ergon
codex plugin add ergon@ergon-marketplace
```

Start a new Codex chat, then ask for a workflow naturally or invoke one of the installed skills, such as `$ergon:foundation`, `$ergon:backend`, or `$ergon:sec`.

### Claude Code

```bash
claude plugin marketplace add EJDonato/Ergon
claude plugin install ergon@ergon-marketplace
```

Start a new Claude Code session. Skills are available as `/ergon:foundation`, `/ergon:backend`, `/ergon:sec`, and the other names listed below.

For local development, either host can load the checked-out repository directly through its local plugin workflow; Claude Code also supports `claude --plugin-dir .`.

### Antigravity

Ergon includes a native Antigravity plugin bundle at `.agents/plugins/ergon`. After downloading or cloning this repository, install that bundle globally:

```bash
agy plugin install /absolute/path/to/Ergon/.agents/plugins/ergon
```

In Antigravity, you can instead open `/plugin`, choose **Install from local directory**, and select the same folder. The plugin manager stages and manages the bundle globally rather than generating skills in the current project.

Start a new Antigravity session. The plugin provides `/ergon-cyra`, `/ergon-juno`, `/ergon-orion`, `/ergon-kairos`, `/ergon-kael`, `/ergon-iris`, `/ergon-argus`, `/ergon-aegis`, and `/ergon-foundation`.

Direct installation from Antigravity's Discover marketplace requires the plugin to be accepted into Google's curated marketplace. The repository bundle is ready for that submission; until it is listed, use **Install from local directory**.

## Install with the CLI

```bash
npx --yes --package github:EJDonato/Ergon ergon init --runner codex
npx --yes --package github:EJDonato/Ergon ergon add foundation --runner claude
npx --yes --package github:EJDonato/Ergon ergon add backend --runner cursor
npx --yes --package github:EJDonato/Ergon ergon list
```

The unscoped npm name `ergon` belongs to an unrelated package. The explicit GitHub package source above guarantees that `npx` runs this repository from any project directory.

When `--runner` is omitted, Ergon detects existing `.claude`, `.codex`, Antigravity `.agents/skills` or `.agents/workflows`, and `.cursor` configuration. If no marker is found in an interactive terminal, it asks which runners to configure. In CI or another non-interactive shell, pass `--runner` explicitly.

Existing files are preserved by default. Pass `--force` to replace generated skill files:

```bash
npx --yes --package github:EJDonato/Ergon ergon add market --runner codex --force
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
| Antigravity | Managed `ergon` plugin with `skills/ergon-<persona>/SKILL.md` |
| Cursor / Windsurf | `.cursor/rules/<skill>.mdc` |

## Commands

```text
ergon init [--runner <runner>] [--force]
ergon add <skill-or-bundle> [--runner <runner>] [--force]
ergon list
ergon --help
```

Supported runner IDs are `claude`, `codex`, `agy`, and `cursor`.

## Plugin layout

The repository root is a portable Agent Plugins package. `plugin.json` is the portable manifest, `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` provide host compatibility, and `skills/<name>/SKILL.md` contains the portable skills. The Codex and Claude marketplace catalogs are committed under `.agents/plugins/` and `.claude-plugin/`. Antigravity's strict native bundle lives at `.agents/plugins/ergon/` with its own manifest and persona-named skills.

The nested `skills/foundation/*` and `skills/specialists/*` files remain the canonical registry consumed by the npm CLI. Tests keep the plugin skill bodies synchronized with those source prompts.

## Development

The CLI supports Node.js 18 or later. Developing and running the current test toolchain requires Node.js 20 or later.

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
