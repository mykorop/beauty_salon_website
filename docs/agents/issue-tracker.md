# Issue tracker: Local Markdown

Specs and tickets live in this repository's `.scratch/` directory. Resolve all paths below from the website repository root.

## Artifact layout

- One feature per directory: `.scratch/<feature-slug>/`.
- Spec: `.scratch/<feature-slug>/spec.md`.
- Tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, one file per ticket, numbered from `01` in dependency order.
- Triage state: a `**Status:**` line near the top, using the role mapping in [triage labels](triage-labels.md).
- Dependencies: a `**Blocked by:**` line listing ticket numbers and titles, or `None (can start immediately)`.
- Discussion: append under `## Comments` in the relevant artifact.

## Operations

- **Publish:** create the requested spec or individual ticket files. Use the invoking skill's template and approval workflow.
- **Fetch:** read the referenced artifact, its comments, and any blocking tickets.
- **List:** use `rg --files --hidden .scratch`, then inspect status and blockers.
- **Update:** edit the relevant fields while preserving existing content and discussion.
- **Claim:** set `**Status:** claimed` before starting implementation.
- **Resolve:** record the result and validation under `## Answer`, then set `**Status:** resolved`.
- **Frontier:** work tickets whose blockers are all resolved and which are ready for implementation; use number order when several qualify.

`claimed` and `resolved` are execution states, separate from the five triage roles.

## Wayfinding

When using `wayfinder`, the map lives at `.scratch/<feature-slug>/map.md`; its children use the same individual-ticket layout. A `**Type:**` line records `research`, `prototype`, `grilling`, or `task`. On resolution, append a short result and link to the map's Decisions-so-far section.
