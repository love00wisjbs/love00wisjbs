# Portable Skill Audit Plan

User delegates capability gaps and implementation choices; no additional design approval needed. This is a repository maintenance tool, not a claim to modify the model or host-installed plugins.

Goal: replace ad hoc inventory/link commands with one repeatable read-only cross-platform check.
Approach: Node built-ins, no packages, audit only a caller-selected directory. Do not install tools, scan account directories or change skills. No LLM/API/network dependencies. Do not present a heuristic metadata check as complete YAML/schema validation.

Files: tools/audit-skills.cjs (API + CLI), tests/audit-skills.test.cjs (temporary fixtures), docs/capability-maintenance.md (usage and limits), README.md (entry).

Interface: auditSkills(root) returns {schemaVersion:1,root,skills,issues}. Each skill reports path, name, whitespaceWords, bytes and sha256. Issues include severity, code, path, message. CLI writes JSON, exits 1 for error issues, 0 for warnings only, 2 for invocation/root errors. Skip symlinks and generated/dependency folders; missing local Markdown targets are errors. Do not fetch external URLs. Links that resolve outside the chosen root produce warnings without probing them.

Tasks:
- Write fixture tests for ordinary skill, missing local target, duplicate names/content, long body, unsupported metadata, root errors, symlink skipping, outside-root links and CLI exit status.
- Run tests expecting missing implementation, implement minimal read-only scanner, run full suite.
- Document heuristic limits and results, independent review, publish to existing repo with expected-head lease; verify remote files.

Acceptance: real current package yields one skill without error issues; fixtures detect missing links and duplicates; no input file changes; Windows uses the same Node command without shell-specific paths.
