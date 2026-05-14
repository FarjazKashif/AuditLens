### `.agents/skills/repo-research/SKILL.md`

```md
---
name: repo-research
description: Analyze a repository's structure, technologies, and patterns to create or update a project context document.
---

# Repo Research Skill

## Purpose
Analyze the repository in phases and produce a project context document that helps Antigravity understand the codebase.

## Method
1. Surface scan: directory tree only.
2. Configuration scan: package files, build files, environment files.
3. Entry point scan: main scripts, executables, and primary modules.
4. Deep dive: only the most relevant implementation files.
5. Write the findings into `.agents/rules/project-context.md`.

## Rules
- Be incremental.
- Stop and write findings after each phase.
- Do not guess hidden architecture.
- Do not read more than needed.
- Prefer concise, high-signal summaries.

## Output
- repository map
- stack summary
- module map
- key data structures
- notable risks or gaps
```