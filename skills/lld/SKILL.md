---
name: lld
description: Create a Low-Level Design with an ordered task checklist, function signatures, data models, test strategies, and observability specifications. Each task is an atomic, testable unit of work. Use after HLD is approved.
argument-hint: "[feature-name]"
context: fork
agent: architect
---

# Low-Level Design

You are creating an LLD for feature: **$ARGUMENTS**

## Before You Start

Follow `@rules/preamble.md`.

## Gate Check

Read `docs/hld/$ARGUMENTS.md` and verify:
- `status` is `approved` or `complete`
- `completion.percentage` is `100`
- `completion.blockers` is empty

If ANY condition fails: print what is missing, refuse to proceed, and suggest running `/hld $ARGUMENTS` first.

## Process

### Step 1: Read Prerequisite Documents

Read and internalize:
- `docs/requirements/$ARGUMENTS.md` — the what and why
- `docs/hld/$ARGUMENTS.md` — the how at a high level

### Step 2: Explore Implementation Surface

For each component identified in the HLD:
- Find the relevant source files
- Understand the existing code structure, patterns, and conventions
- Identify where new code will be added
- Identify where existing code will be modified

### Step 3: Define Interfaces

For each new or modified component, define:
- **Function signatures**: name, parameters (with types), return type, errors thrown
- **Data models**: fields, types, validation rules, database schema
- **API contracts**: request/response shapes with exact field names and types
- **Event schemas**: if using message queues, define event shapes

Use the project's language and type system. Check `.dev-workflow/preferences.yml` for the language.

### Step 4: Define Observability Specifications

For each component, specify:
- **Spans**: name, attributes, parent span, when to create
- **Log events**: level, message template, context fields, when to emit
- **Metrics**: name, type, labels, when to increment/observe
- **Dashboard panels**: which metrics to visualize, what chart type

### Step 5: Break Into Tasks

Decompose the implementation into atomic tasks. Each task MUST be:
- **Testable**: You can write a test for it in isolation
- **Small**: Completable in a single TDD cycle (typically 15-60 minutes of work)
- **Ordered**: Dependencies are respected (task N depends only on tasks < N)
- **Complete**: Includes both the implementation code AND its test(s)

For EACH task, specify:

```markdown
### Task N: <Description>
- **Status**: pending
- **Files**: `path/to/file.ts`, `path/to/file.test.ts`
- **Depends on**: None | Task M, Task K
- **Test approach**: <What tests to write, what cases to cover>
- **Observability**: <What spans/logs/metrics this task adds>
- **Acceptance**: <What "done" looks like — specific, verifiable criteria>
- **Details**:
  - Step-by-step implementation notes
  - Key function signatures to implement
  - Edge cases to handle
```

Also include each task in the frontmatter:

```yaml
tasks:
  - id: N
    description: "<description>"
    files: ["<paths>"]
    depends_on: []
    status: pending
    tests_passing: false
    reviewed: false
```

### Step 6: Define Test Strategy

Specify the testing approach:
- **Unit tests**: What to test, what to mock, coverage targets
- **Integration tests**: What interactions to test, what infrastructure needed
- **E2E tests**: What user flows to test (for `/staging` phase)

### Step 7: Create Dependency Graph

Show task dependencies as an ASCII graph:

```
Task 1 (Data model)
  └─> Task 2 (Repository layer)
       ├─> Task 3 (Service layer)
       │    └─> Task 5 (API handler)
       └─> Task 4 (Event publisher)
            └─> Task 5 (API handler)
                 └─> Task 6 (Integration tests)
```

### Step 8: Present and Confirm

Present the LLD to the developer. Ask:
1. Does the task breakdown make sense?
2. Are the function signatures what you expect?
3. Is the test strategy sufficient?
4. Are there any tasks missing?
5. Is the observability spec complete?
6. Do you approve this LLD?

### Step 9: Finalize

Once approved:
1. Set `status: approved` in frontmatter
2. Set all checklist items to `done: true`
3. Set `completion.percentage: 100`
4. Save to `docs/lld/$ARGUMENTS.md`
5. Create `docs/observability/$ARGUMENTS.md` with the full observability spec

## Output

The completed LLD at `docs/lld/$ARGUMENTS.md` and observability spec at `docs/observability/$ARGUMENTS.md`.
