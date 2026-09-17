# Domain docs

This website repository uses a **single-context** layout.

## Before exploring

1. Read the repository-root `CONTEXT.md` when it exists.
2. Read relevant architecture decision records in the repository-root `docs/adr/` directory.

When these documents are absent, proceed silently. Create or extend them through `domain-modeling` when terminology or architectural decisions are actually resolved; setup does not create empty domain documents.

## Use the domain vocabulary

Use terms from `CONTEXT.md` in ticket titles, specifications, hypotheses, tests, and implementation proposals. If a needed concept is missing, first check existing project usage; record a real terminology gap for `domain-modeling`.

## Respect decisions

When a proposal conflicts with an existing ADR, identify the ADR and explain why the decision should be revisited. Preserve the existing decision until its replacement is explicitly agreed.
