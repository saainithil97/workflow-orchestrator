---
name: spike
description: Time-boxed investigation of a technical question. Define a hypothesis, build the minimum code to answer it, record the decision. Use when you need to test an assumption, not discuss it.
argument-hint: "[topic] [question]"
context: fork
agent: architect
---

# Spike

You are running a technical spike for: **$ARGUMENTS**

## Parse Arguments

`$ARGUMENTS` is expected as `<topic> <question-or-description>`. Examples:
- `websockets "can Socket.io handle 10k connections"`
- `crdts "Yjs vs Automerge for text editing"`
- `auth "OAuth2 PKCE flow in a CLI app"`

If only a topic is given with no question, ask: "What specific question are you trying to answer?"

The `<topic>` maps to `.learn/topics/<topic>/`. If that directory doesn't exist, create it with a minimal `state.yml`.

## Before You Start

1. Read `.dev-workflow/preferences.yml` for language, framework, package manager.
2. If `.learn/topics/<topic>/state.yml` exists, read it for context.
3. If `.learn/topics/<topic>/decisions.yml` exists, scan it — the question may already be answered.

## Process

### Step 1: Define the Spike

Agree on three things with the user:

1. **Hypothesis**: A falsifiable statement. "Socket.io's default reconnection handles intermittent disconnects within 5 seconds." Not "explore Socket.io reconnection."
2. **Scope**: What's the minimum code to answer this? "A server that drops connections randomly + a client that logs reconnection events."
3. **Timebox**: Suggest a timebox based on scope. "This is a 20-minute spike." Spikes default to 30 minutes. If it looks bigger, break it into smaller questions.

### Step 2: Build It

Create the spike directory: `.learn/topics/<topic>/spikes/<spike-name>/`

Where `<spike-name>` is a kebab-case slug of the question (e.g., `socket-io-reconnection`, `yjs-vs-automerge`).

Build the minimum code to test the hypothesis. Rules:

- **Disposable quality.** No tests, no error handling, no abstraction. This code exists to answer a question, then it's done.
- **Runnable.** The user must be able to execute it and see the result. Include a run command in the README.
- **Collaborative.** Build it together. You write the scaffold, the user writes the interesting parts. Or vice versa — follow their energy.
- **Narrate decisions, not code.** Don't explain what each line does. Explain WHY you're making this choice: "I'm using `ws` directly instead of Socket.io here because we want to see the raw reconnection behavior."

### Step 3: Observe the Result

Run the code. Look at the output together. Ask:

- "Does this answer the question?"
- "Anything surprising?"
- "Does this change what you'd want to build?"

### Step 4: Record the Decision

Create `.learn/topics/<topic>/spikes/<spike-name>/README.md`:

```markdown
# Spike: <question>

**Hypothesis**: <the falsifiable statement>
**Result**: <confirmed | refuted | partially confirmed>
**Time**: <actual time spent>

## What We Found

<2-5 sentences. What happened. What was surprising. What the implications are.>

## Decision

<One clear sentence. What we're going to do based on this.>

## Run

\`\`\`bash
<command to run the spike>
\`\`\`
```

Also append to `.learn/topics/<topic>/decisions.yml`:

```yaml
- id: D<next-number>
  date: <YYYY-MM-DD>
  question: "<the question>"
  answer: "<one-line answer>"
  result: confirmed | refuted | partial
  evidence: "spikes/<spike-name>"
```

### Step 5: Update State

Update `.learn/topics/<topic>/state.yml`:
- Add relevant items to `explored`
- Update `frontier` based on what this spike revealed
- Update `current_focus` if the spike changed direction

Append to `.learn/topics/<topic>/journal.md`:
```
## <YYYY-MM-DD> — Spike: <question>
result: <confirmed/refuted/partial>
finding: <one line>
decision: <one line>
opens: <new questions this raised, if any>
```

## If the Spike Exceeds Its Timebox

At the timebox mark, pause:

- "We're at the 30-minute mark. The question was [X]. Do we have enough to decide?"
- If yes: record and close.
- If no: "What's the minimum extra work to get an answer? Is it 10 more minutes or is this a deeper investigation?"
- If it's turning into a big thing, suggest breaking it: "This is actually two questions. Let's answer the first one now and spike the second one separately."

## If the Spike Raises More Questions

Good — that's the point. Add new questions to the `frontier` in `state.yml`. Don't chase them now unless the user wants to. Say: "This opens up [new question]. Want to spike that next, or is the current answer enough to move forward?"

## Boundaries

- Spikes are NOT prototypes. They answer questions. They don't build features.
- Spikes are NOT reusable. The code is disposable. The decision is the artifact.
- Spikes are time-boxed. Respect the timebox. If it's taking too long, the question is too big.

## Output

Spike code and README in `.learn/topics/<topic>/spikes/<spike-name>/`. Decision appended to `.learn/topics/<topic>/decisions.yml`. State and journal updated.
