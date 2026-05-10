# Repository Instructions

## Backend Implementation Workflow

- Always use Test-Driven Development (TDD) when implementing features or fixes.
- Follow a vertical red-green-refactor loop: write one failing behavior test, implement the smallest code to pass it, then refactor while tests are green.
- Tests should verify observable behavior through public service/API interfaces, not private implementation details.
- Do not create broad testing plans up front unless explicitly requested; define the next behavior test at the start of each implementation slice.
- Follow OOP principles.
- Read /docs for more context if needed (especially in frontend)

## Frontend Implementation Workflow

- Use the `frontend-implementation` skill when building or modifying frontend screens, translating design references into React/Vite/Tailwind UI, or integrating frontend flows with backend APIs.
- Read `docs/frontend/frontend-stack.md` first for the current stack, testing split, API conventions, and auth/session rules.
- For visual implementation, inspect the relevant current docs: `docs/frontend/DESIGN.md`, `docs/frontend/per-page-plan/`, `docs/frontend/per-component-plan/`, and `docs/frontend/html-reference/`.
- Implement frontend work in two phases: first design implementation with deterministic fixtures and Playwright screenshot tests; then backend integration with the `tdd` skill.
- The design phase is screenshot-driven and should not use the backend `tdd` skill. Verify meaningful UI work across desktop `1440 x 900` and mobile `390 x 844` viewports when a runnable frontend exists.
- During backend integration, replace fixtures with API calls through TDD while preserving the implemented design unless backend behavior requires a missing visible state.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo with domain language in root `CONTEXT.md` and ADRs under `docs/adr/` when present. See `docs/agents/domain.md`.

### Frontend implementation

Frontend implementation uses the repo-local `frontend-implementation` skill in `.agents/skills/frontend-implementation/SKILL.md`.
