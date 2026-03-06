# Code Quality Standards

These are the 5 core dimensions checked during every `/review`. For the full 20-dimension reference, see `review-dimensions.md`.

## 1. Correctness

The code must do what it claims to do.

**Check for:**
- Logic errors: off-by-one, wrong operator, inverted conditions
- Null/undefined handling: every nullable value has a guard
- Boundary conditions: empty collections, zero values, max integers, empty strings
- Race conditions: shared mutable state, concurrent access without synchronization
- Type mismatches: implicit coercions, unsafe casts, generic misuse
- Edge cases: what happens with unexpected but valid input?

**Rule:** If you can construct a valid input that produces a wrong output, the code is not correct.

## 2. Security

Security is not optional and is not a separate phase.

**Check for:**
- **Input validation**: All external input (HTTP params, form data, file uploads, headers) is validated and sanitized at the boundary — before it reaches business logic
- **Injection prevention**: SQL queries use parameterized statements. HTML output is escaped. Shell commands never interpolate user input. Regular expressions are safe from ReDoS
- **Authentication & authorization**: Every endpoint checks identity (authn) and permissions (authz). No endpoint is accidentally public
- **Secrets management**: No hardcoded secrets, API keys, passwords, or tokens in code or config files committed to git. Use environment variables or secret managers
- **Data exposure**: API responses do not leak internal IDs, stack traces, database schemas, or other users' data. Error messages are informative for users but not for attackers
- **Dependency safety**: No known vulnerabilities in dependencies (check with `npm audit`, `cargo audit`, etc.)

**Rule:** Assume all input is hostile. Validate at the boundary, sanitize before use, escape before output.

## 3. Error Handling

Every error path must be intentional, not accidental.

**Check for:**
- **No swallowed errors**: Every `catch` block either handles the error meaningfully, re-throws with context, or logs it. Empty catch blocks are never acceptable
- **Typed errors**: Use custom error types/classes, not generic `Error("something went wrong")`. Errors should be programmatically distinguishable
- **Error messages**: Include what happened, what was expected, and enough context to debug (but never include secrets or PII)
- **Graceful degradation**: When a non-critical dependency fails, the system degrades gracefully instead of crashing
- **Recovery strategy**: For transient failures (network timeouts, rate limits), implement retry with exponential backoff. For permanent failures, fail fast and report
- **Resource cleanup**: File handles, database connections, and network sockets are always closed in finally/defer/using blocks, even when errors occur

**Rule:** The error handling path is as important as the happy path. Test it equally.

## 4. Readability & Maintainability

Code is read far more often than it is written. Optimize for the reader.

**Check for:**
- **Naming**: Variables, functions, and classes have descriptive names that reveal intent. No single-letter names outside of trivial loops. No abbreviations that require domain knowledge to decode
- **Function length**: Functions do one thing. If a function exceeds ~30 lines, it likely does too many things. Extract sub-functions with descriptive names
- **Cognitive complexity**: Avoid deep nesting (>3 levels). Prefer early returns, guard clauses, and flat control flow
- **DRY without over-abstraction**: Eliminate true duplication (same logic, same reason to change). Do not force-abstract code that merely looks similar but changes for different reasons
- **Dead code**: Remove unused imports, unreachable branches, commented-out code, and TODO-marked code that will never be addressed
- **Consistency**: Follow the existing codebase's conventions for formatting, naming, file organization. When conventions conflict, follow the most local convention
- **Single Responsibility**: Each module, class, and function has one reason to change

**Rule:** If a new team member cannot understand a function within 30 seconds of reading it, it needs to be simplified or documented.

## 5. Performance

Performance problems are bugs, not features.

**Check for:**
- **Algorithmic complexity**: No accidental O(n^2) or worse. Nested loops over collections are suspect. Use appropriate data structures (sets for lookups, maps for key-value)
- **N+1 queries**: Database queries inside loops are almost always wrong. Use batch queries, joins, or eager loading
- **Unbounded growth**: Collections, caches, and buffers must have size limits. Infinite growth leads to OOM
- **Unnecessary work**: Avoid computing the same value multiple times. Use memoization for expensive pure functions. Avoid unnecessary re-renders in UI code
- **I/O efficiency**: Batch network calls. Use streaming for large files. Use connection pooling for databases. Set appropriate timeouts on all external calls
- **Memory allocation**: Avoid allocating in hot loops. Pre-allocate buffers when size is known. Be aware of garbage collection pressure in managed languages

**Rule:** Measure before optimizing, but recognize patterns that are always wrong (N+1 queries, unbounded collections, nested loops over large datasets).

## Language-Agnostic Principle

These rules apply regardless of programming language. However, each language has idiomatic ways to achieve them. Before reviewing:

1. Check `.dev-workflow/preferences.yml` for the project's language
2. Apply language-specific best practices (e.g., Go error handling conventions, Rust ownership patterns, TypeScript strict mode)
3. Follow the project's existing patterns first, even if they differ from general best practices — unless those patterns are actively harmful

## Severity Classification

Every review finding is tagged with a severity:

| Severity | Meaning | Action |
|----------|---------|--------|
| **Critical** | Security vulnerability, data loss risk, crash, correctness bug | Must fix before merge |
| **Warning** | Performance issue, missing error handling, maintainability concern | Should fix before merge |
| **Suggestion** | Could be better: naming, structure, minor optimization | Consider for this PR |
| **Nitpick** | Purely stylistic, formatting, comment wording | Optional, no block |
