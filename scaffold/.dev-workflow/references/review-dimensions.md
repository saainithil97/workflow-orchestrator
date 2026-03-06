# Review Dimensions — Full Reference

This file contains all 20 review dimensions organized into 3 tiers. The `/review` command uses only Tier 1 (5 core dimensions) by default. The `/review-extended` command uses all 20. Individual dimensions can be enabled by adding them to `.dev-workflow/preferences.yml` under `review_dimensions`.

## Tier 1 — Core (Always Checked)

These 5 dimensions are checked on every review. See `code-quality.md` for detailed rules.

### 1. Correctness
Logic errors, off-by-one, null handling, boundary conditions, race conditions, type mismatches, edge cases.

### 2. Security
Input validation, injection prevention, authn/authz, secrets management, data exposure, dependency vulnerabilities.

### 3. Error Handling
No swallowed errors, typed errors, meaningful messages, graceful degradation, retry strategies, resource cleanup.

### 4. Readability & Maintainability
Naming, function length, cognitive complexity, DRY, dead code, consistency, single responsibility.

### 5. Performance
Algorithmic complexity, N+1 queries, unbounded growth, unnecessary work, I/O efficiency, memory allocation.

---

## Tier 2 — Context-Dependent (Checked When Applicable)

These dimensions are activated based on which files changed. The review agent auto-detects applicability.

### 6. API Design
**When**: New or modified API endpoints, public interfaces, SDKs.

Check for:
- Consistent naming conventions (RESTful resources, not verbs)
- Correct HTTP methods and status codes
- Backward compatibility (no unannounced breaking changes)
- Versioning strategy applied
- Idempotency for unsafe operations
- Pagination for list endpoints
- Rate limiting headers
- Content negotiation

### 7. Concurrency
**When**: Multi-threaded code, async operations, shared mutable state, database transactions.

Check for:
- Thread safety of shared data structures
- Deadlock potential (lock ordering)
- Race conditions (check-then-act, read-modify-write)
- Proper use of atomic operations
- Correct async/await patterns (no fire-and-forget without error handling)
- Transaction isolation levels appropriate for the operation

### 8. Scalability
**When**: Data-heavy features, high-traffic paths, database changes.

Check for:
- Horizontal scaling readiness (no local state assumptions)
- Database query efficiency (indexes, explain plans)
- Caching strategy (what to cache, TTL, invalidation)
- Pagination and cursor-based iteration
- Connection pooling configuration
- Queue-based processing for heavy operations
- Sharding considerations for large datasets

### 9. Observability
**When**: Any new code path (checked against observability.md rules).

Check for:
- OpenTelemetry spans on critical operations
- Structured log statements at boundaries
- Metrics for new business events
- Trace context propagation across service boundaries
- Dashboard definitions for new metrics
- Alert rules for new failure modes
- Corresponding runbooks for new alerts

### 10. Accessibility
**When**: Frontend/UI code changes.

Check for:
- WCAG 2.1 AA compliance
- Semantic HTML elements
- Keyboard navigation support
- Screen reader compatibility (ARIA labels, roles)
- Color contrast ratios (4.5:1 for text, 3:1 for large text)
- Focus management for dynamic content
- Alt text for images
- Form labels and error messages

### 11. Internationalization (i18n)
**When**: User-facing strings, date/time/number formatting.

Check for:
- Externalized strings (no hardcoded user-facing text in code)
- Locale-aware formatting (dates, numbers, currency)
- Pluralization rules
- RTL layout support
- String concatenation avoided (use template/interpolation)
- Character encoding (UTF-8 everywhere)

### 12. Data Integrity
**When**: Database changes, state mutations, data migrations.

Check for:
- Transactions around multi-step mutations
- Idempotency of write operations
- Migration safety (reversible, backward-compatible)
- Referential integrity constraints
- Data validation at system boundaries
- Audit logging for sensitive data changes
- Soft delete vs hard delete consistency

---

## Tier 3 — Specialized (Periodic Deep Reviews)

These dimensions are for periodic audits or when specifically requested.

### 13. Dependency Hygiene
Check for:
- Necessity of each new dependency (can standard library do it?)
- License compatibility (MIT, Apache-2.0 are safe; GPL may not be)
- Maintenance status (last commit, open issues, bus factor)
- Known vulnerabilities (`npm audit`, `cargo audit`, `pip audit`)
- Bundle size impact (for frontend)
- Version pinning strategy (exact vs range)
- Duplicate dependencies

### 14. Idiomatic Code
Check for language-specific conventions:
- **TypeScript**: strict mode, proper type narrowing, no `any`, discriminated unions
- **Go**: error handling with `if err != nil`, context propagation, goroutine lifecycle
- **Python**: type hints, context managers, generators for large datasets, PEP 8
- **Rust**: ownership/borrowing, `Result<T, E>` over panics, trait implementations
- **Java**: Optional over null, records for DTOs, sealed interfaces, proper generics

### 15. Configuration Management
Check for:
- Sensible defaults for all config values
- Environment-specific configuration separation
- No secrets in config files (use env vars or secret managers)
- Validation at startup (fail fast on invalid config)
- Documentation of all config options
- Feature flags for gradual rollouts

### 16. Backward Compatibility
Check for:
- Breaking changes to public APIs (method signatures, response shapes, error codes)
- Database schema changes that break existing queries
- Configuration format changes that break existing deployments
- Deprecation notices before removal
- Semantic versioning compliance
- Migration path documentation

### 17. Resource Management
Check for:
- File handles closed in finally/defer/using blocks
- Database connections returned to pool
- HTTP clients reused (not created per request)
- Memory leak prevention (event listener cleanup, subscription disposal)
- Timeout enforcement on all external calls
- Circuit breaker patterns for unreliable dependencies
- Graceful shutdown handling

### 18. Testing Quality
Check for:
- Tests cover behavior, not implementation details
- Tests are deterministic (no flakiness)
- Tests are independent (no ordering dependency)
- Assertions are specific (exact values, not just truthiness)
- Error paths are tested, not just happy paths
- Mocking is minimal and appropriate
- Test data is realistic but not production data

### 19. Documentation Quality
Check for:
- Public APIs have doc comments
- Complex logic has explanatory comments (why, not what)
- README is accurate and complete
- API spec matches implementation
- Runbooks exist for new operational scenarios
- Migration guides exist for breaking changes

### 20. Compliance & Audit
Check for:
- PII handling follows data protection requirements
- Audit logging for sensitive operations
- Data retention policies enforced
- Access control follows principle of least privilege
- Encryption at rest and in transit for sensitive data
- GDPR/CCPA/HIPAA compliance (as applicable)

---

## Configuring Review Dimensions

In `.dev-workflow/preferences.yml`:

```yaml
review_dimensions:
  # Tier 1 (always on — cannot be disabled)
  # correctness, security, error-handling, readability, performance

  # Tier 2 (enable/disable per project)
  api-design: true
  concurrency: false
  scalability: true
  observability: true
  accessibility: true
  i18n: false
  data-integrity: true

  # Tier 3 (enable for periodic deep reviews)
  dependency-hygiene: false
  idiomatic-code: false
  configuration: false
  backward-compatibility: false
  resource-management: false
  testing-quality: false
  documentation-quality: false
  compliance: false
```

If no preferences are set, `/review` runs Tier 1 only. `/review-extended` runs all applicable dimensions regardless of preferences.
