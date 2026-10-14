# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Creating a pull request, opening a PR, preparing changes for review | branch-pr | `C:\Users\chito\.config\opencode\skills\branch-pr\SKILL.md` |
| Creating a GitHub issue, reporting a bug, requesting a feature | issue-creation | `C:\Users\chito\.config\opencode\skills\issue-creation\SKILL.md` |
| "judgment day", "review adversarial", "doble review", "juzgar" | judgment-day | `C:\Users\chito\.config\opencode\skills\judgment-day\SKILL.md` |
| Writing Go tests, teatest, adding test coverage | go-testing | `C:\Users\chito\.config\opencode\skills\go-testing\SKILL.md` |
| Creating a new agent skill, documenting patterns for AI | skill-creator | `C:\Users\chito\.config\opencode\skills\skill-creator\SKILL.md` |
| Editing opencode's own config (opencode.json, .opencode/, ~/.config/opencode/) | customize-opencode | built-in |

SDD workflow skills (`sdd-*`), `_shared`, and `skill-registry` are intentionally omitted — they are workflow, not coding/task skills.

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (`Closes/Fixes/Resolves #N`) — no exceptions, blank PRs are blocked
- Branch names: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Exactly one `type:*` label per PR, matching the checkbox in the PR template
- Commit messages MUST match conventional commits: `type(scope): description`
- No `Co-Authored-By` trailers
- Note: this repo has no `.github/` at root — the PR/issue template + check machinery does NOT exist here yet

### issue-creation
- Blank issues are disabled — always use a template (bug report / feature request)
- Issues auto-get `status:needs-review`; a maintainer must add `status:approved` before any PR
- Search for duplicates first: `gh issue list --search "keyword"`
- Questions go to Discussions, not issues
- Note: templates are not present in this repo — confirm with the user before relying on them

### judgment-day
- Launch TWO blind judge sub-agents in parallel via `delegate`; the orchestrator NEVER reviews code itself
- Both judges get the SAME target and identical criteria; neither knows about the other
- Wait for BOTH judges before synthesizing — never accept a partial verdict
- The Fix Agent is a separate delegation; never reuse a judge as the fixer
- After 2 fix iterations, ASK the user before escalating — never auto-continue
- Resolve skills FIRST (registry → compact rules) and inject the same block into both judges and the fixer

### go-testing
- Table-driven tests are the default pattern (not applicable to this project — Astro/TS)
- Bubbletea models tested via `teatest`; golden files for TUI output
- Marked as NOT APPLICABLE to ogpage (static Astro site, no Go code)

### skill-creator
- Follow the Agent Skills spec: frontmatter `name` + `description` with explicit `Trigger:` line
- Keep skills focused: one task, one skill; short imperative rules over prose
- Register new skills after creating them (skill-registry)
- Respect the 200-line guard — put reference material in `references/`, not the SKILL.md body

### customize-opencode
- Use ONLY for opencode's own config (opencode.json/.jsonc, `.opencode/`, `~/.config/opencode/`), never for app code
- Covers agents, subagents, skills, plugins, MCP servers, permission rules

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Agents.md | `D:\dockers\ogpage\Agents.md` | Standalone content/brand spec (Spanish). NOT an index — no referenced file paths. Single source of truth for all CV/brand data, audit-first workflow, `[PENDIENTE: ...]` markers, SEO/accessibility requirements |

No `CLAUDE.md`, `.cursorrules`, `GEMINI.md`, or `copilot-instructions.md` at project level.

Read `Agents.md` before ANY content, copy, SEO, or component-text change — it mandates an audit step and explicit user confirmation before editing.
