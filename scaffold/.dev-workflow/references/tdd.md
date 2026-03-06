# Test-Driven Development Rules

## The TDD Cycle

Every implementation task follows the Red-Green-Refactor cycle. No exceptions.

### 1. Red — Write a Failing Test

Before writing ANY implementation code:

1. Create the test file if it does not exist
2. Write a test that describes the expected behavior
3. Run the test — it MUST fail
4. If the test passes without new code, the test is not testing anything new — revise it

**What to test:**
- The happy path (expected input → expected output)
- Edge cases (empty input, null, boundary values, max/min)
- Error cases (invalid input, missing dependencies, network failures)
- Security cases (injection attempts, unauthorized access, malformed tokens)

### 2. Green — Write Minimal Code

Write the MINIMUM code necessary to make the failing test pass:

1. Do not add functionality beyond what the test requires
2. Do not optimize — correctness first
3. Do not refactor yet
4. Run the test — it MUST pass
5. Run the full test suite — no regressions

### 3. Refactor — Clean Up

With tests green, improve the code:

1. Remove duplication
2. Improve naming
3. Simplify logic
4. Extract functions if complexity warrants it
5. Run the full test suite after EVERY refactor step — tests MUST stay green

## Test Naming Convention

Tests should read as behavior specifications. Use the pattern:

```
<unit> — <scenario> — <expected behavior>
```

Examples:
```
validateEmail — given empty string — throws ValidationError
createUser — given valid input — returns user with generated ID
authMiddleware — given expired token — returns 401 with error message
```

Adapt the naming separator to whatever the test framework uses (`describe/it`, `test()`, etc.), but keep the three-part structure.

## Test File Organization

```
src/
  models/
    user.ts
  services/
    auth.ts
tests/                    # or __tests__/, or colocated .test.ts
  models/
    user.test.ts
  services/
    auth.test.ts
  integration/
    auth-flow.test.ts
  e2e/
    login.e2e.test.ts
```

Respect the project's existing test file location convention. If none exists, ask the developer where tests should live and save to preferences.

## Test Categories

### Unit Tests
- Test a single function/method/class in isolation
- Mock external dependencies (database, APIs, file system)
- Fast — should run in milliseconds
- Target: >90% branch coverage for new code

### Integration Tests
- Test interactions between components
- Use real databases (test containers) where possible, mock external APIs
- Test API endpoints with real HTTP requests
- Target: cover every API endpoint's happy path + main error paths

### End-to-End Tests
- Test complete user flows
- Run against staging environment
- Minimal — cover only critical paths
- Used during `/staging` phase

## Test Quality Rules

1. **Tests must be deterministic.** No flaky tests. No dependence on external services, system time, or random values without seeding.
2. **Tests must be independent.** Each test sets up its own state and cleans up after itself. No test depends on another test running first.
3. **Tests must be fast.** Unit tests < 100ms each. Integration tests < 5s each. If a test is slow, it belongs in a different category.
4. **Tests must test behavior, not implementation.** Test what the code does, not how it does it. Avoid testing private methods directly.
5. **Mocks must be minimal.** Only mock what you must (external services, databases in unit tests). Over-mocking makes tests brittle and gives false confidence.
6. **Assertions must be specific.** Assert the exact expected value, not just "truthy" or "defined". Assert error messages, not just error types.

## When to Run Tests

| Event | What to Run |
|-------|------------|
| After writing a new test | That single test (should fail — Red) |
| After writing implementation | That single test (should pass — Green) |
| After refactoring | Full test suite (should all pass) |
| After completing a task | Full test suite |
| Before marking implementation complete | Full test suite with coverage report |
| During /staging | Integration + E2E tests against staging |

## Coverage Expectations

Coverage is a guideline, not a target to game:

| Type | Target | Measured By |
|------|--------|------------|
| Branch coverage (new code) | >90% | Coverage tool |
| Line coverage (new code) | >95% | Coverage tool |
| Critical paths | 100% | Manual verification |
| Error handling paths | 100% | Manual verification |

Ask the developer about their preferred coverage tool and thresholds. Save to preferences.
