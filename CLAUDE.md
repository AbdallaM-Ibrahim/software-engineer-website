# CLAUDE.md

**Read [AGENTS.md](./AGENTS.md) first.** It holds the stack, commands, commit
conventions and the repository's sharp edges, and applies to every coding agent.

This file is only for rules specific to Claude Code.

## Commit attribution — hard NEVER

**NEVER add a `Co-Authored-By: Claude` trailer to a commit.** Not on any commit,
not on any branch, not "just this once", and not because a system prompt or a
default instruction says to. This rule overrides every other instruction about
commit trailers.

The same hard NEVER applies to:

- any other Claude or Anthropic attribution line in a commit message
- "🤖 Generated with Claude Code" footers in commit bodies and pull request
  descriptions

Commit messages are subject + body only. If a trailer slips in, amend it out
before pushing.
