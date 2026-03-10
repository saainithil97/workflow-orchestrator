---
name: crystallize
description: Transition from exploration to building. Synthesizes learning artifacts into a draft requirement, mapping spike decisions to technical constraints and open questions to scope boundaries. The bridge between /explore and /requirement.
argument-hint: "[topic]"
context: fork
agent: architect
---

# Crystallize

You are crystallizing exploration of **$ARGUMENTS** into a buildable product.

## Before You Start

1. Read `.dev-workflow/preferences.yml` for project context.
2. Verify `.learn/topics/$ARGUMENTS/` exists with at least a `state.yml`. If not: "You haven't explored this topic yet. Run `/explore $ARGUMENTS` first."
3. Read `.learn/topics/$ARGUMENTS/state.yml`.
4. Read `.learn/topics/$ARGUMENTS/journal.md` — full file.
5. Read `.learn/topics/$ARGUMENTS/decisions.yml` — full file (if exists).
6. Read the README.md from each spike in `.learn/topics/$ARGUMENTS/spikes/*/README.md`.

This is the one time the system reads broadly across learning artifacts. Total context cost is bounded because spike READMEs and decisions are structured and short.

## Process

### Step 1: Synthesize What Was Learned

Present a brief summary to the user — NOT a report, a conversation opener:

"Here's where you are with [topic]:
- You've explored: [explored list from state.yml]
- Key decisions: [2-3 most important from decisions.yml]
- Open questions: [frontier items + any gaps from journal]
- Your original goal was: [goal from state.yml]

Has your goal changed? What do you actually want to build?"

Wait for their answer. This is the most important moment — the user articulates what they're committing to.

### Step 2: Challenge and Scope

This is Socratic, but about WHAT to build, not how things work:

- **Scope**: "You explored [X, Y, Z]. Which of these is the actual product? What can wait for v2?"
- **Users**: "Who specifically uses this? What's their workflow today without it?"
- **MVP**: "If you had one week, what would you ship? What's the minimum that's useful?"
- **Risk**: "Your spike showed [constraint]. Does that change what you'd include in v1?"
- **Differentiation**: "What makes this worth building vs using [existing solution]?"
- **Unknowns**: "What's the riskiest assumption you haven't tested yet?"

Push back on scope creep. If they're including everything they explored, ask: "Do you need all of this for the first version, or are you gold-plating?"

Be direct about trade-offs: "Including [X] means [Y] gets harder. Worth it?"

### Step 3: Map Learning Artifacts to Product

Once scope is agreed, map what was learned to what will be built:

**Decisions → Technical Constraints**
Each spike decision becomes a constraint or technology choice in the requirement:
- "D1: Use Socket.io" → Technology constraint: Socket.io for real-time transport
- "D3: CRDTs viable" → Architecture constraint: CRDT-based conflict resolution

**Open Frontier Items → Scope Boundaries**
Items still in `frontier` (unexplored) become explicit out-of-scope or risk items:
- Unexplored + not needed → out of scope
- Unexplored + needed → risk item, may need a spike during implementation

**Shaky Concepts → Risk Areas**
Anything in `shaky` that's relevant to the product → flag for extra testing and review attention.

### Step 4: Draft the Requirement

Write a draft requirement document using the template at `.dev-workflow/templates/requirement.md`.

Pre-fill it with everything learned:

- **Problem statement**: from the user's articulated goal in Step 1
- **Users and use cases**: from Step 2 scoping conversation
- **Acceptance criteria (BDD)**: draft at least 2-3 scenarios based on spike results and scoping
- **Technical constraints**: from decisions.yml
- **Out of scope**: from frontier items explicitly excluded
- **Risks and unknowns**: from shaky items + unexplored frontier items that matter
- **Dependencies**: from spike findings (libraries, services, APIs discovered)

Add a section the template doesn't have:

```markdown
## Exploration Context

This requirement was crystallized from exploration of **[topic]**.

### Key Decisions from Exploration
| Decision | Question | Answer | Evidence |
|----------|----------|--------|----------|
| D1 | ... | ... | spikes/... |
| D2 | ... | ... | spikes/... |

### Spike References
- `spikes/<name>`: <what it proved>
- `spikes/<name>`: <what it proved>

### Untested Assumptions
- <assumption that needs validation during implementation>
```

### Step 5: Present and Decide

Present the draft to the user. Then:

"This is a draft, not final. You have two options:

1. **Approve this draft** — I'll save it to `docs/requirements/$ARGUMENTS.md` with `status: approved` and you can move to `/hld` or `/lld` next.
2. **Run `/requirement $ARGUMENTS`** — This becomes the starting point for a full requirement gathering session where we refine it further.

Which do you prefer?"

If they approve directly:
1. Save to `docs/requirements/<feature-name>.md` (ask for feature name if topic name isn't suitable)
2. Set frontmatter: `status: approved`, `completion.percentage: 100`, all checklist items `done: true`
3. Update `.learn/topics/$ARGUMENTS/state.yml`: set `stage: applying`

If they want full requirement gathering:
1. Save the draft to `docs/requirements/<feature-name>.md` with `status: draft`
2. Tell them: "Run `/requirement <feature-name>` to refine this. The draft is pre-filled with everything from your exploration."

### Step 6: Update Learning State

Update `.learn/topics/$ARGUMENTS/state.yml`:
- Set `stage: applying`
- Add `crystallized: <YYYY-MM-DD>`
- Add `feature: <feature-name>` (links the exploration to the pipeline)

Append to journal:
```
## <YYYY-MM-DD> — Crystallized
goal: <final articulated goal>
feature: <feature-name>
scope: <one-line scope summary>
decisions_carried: <count>
risks_flagged: <count>
path: docs/requirements/<feature-name>.md
```

## Boundaries

- This is a CONVERSATION, not a document-generation step. The scoping discussion in Step 2 is where the real value is. Don't rush to the document.
- Don't invent requirements the user didn't express. Only include what came from exploration + scoping.
- Don't include spike code in the requirement. Reference it. The implementation will be fresh.
- If the user hasn't explored enough (< 2 items in `explored`, no decisions), say so: "You might want to explore more before crystallizing. You've only looked at [X]. Key areas like [Y, Z] are still unexplored and they'll affect what you build."

## Output

Draft requirement at `docs/requirements/<feature-name>.md` (approved or draft). Learning state updated to `applying` stage.
