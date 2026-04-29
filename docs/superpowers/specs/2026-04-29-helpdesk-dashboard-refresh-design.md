# Helpdesk dashboard refresh - 2026-04-29

## Context

Source documents (in `files/`):
- `Notes- Actions meeting 28-4.docx` - verbatim action items from the 28 April 2026 meeting.
- `helpdesk-improvements-ai-2026-04-28.md` - synthesized decisions, open questions, and implementation guidance.

Scope chosen: **Option A, structural only**. Make the lane / segment / channel / department / 3rd-party additions, surface meeting decisions and open questions, and add placeholder panels for channel monitoring and AI initiatives. No real CRM data is wired in this pass. Deferred to later passes:
- **B**: parse the three xlsx files in `files/` and populate the channel-breakdown panel with real intake counts.
- **C**: refactor `src/data.jsx` so segment / stage / lane labels live in a single editable config block.

All edits live in `src/data.jsx`, `src/app.jsx`, and `styles.css`. No build step (Babel-standalone).

## Section 1, new "Segments active" lane in the Stages view

Add a new lane between `actions` (Customer actions) and `feel` (Thoughts & feelings).

- **Lane id:** `segActive`
- **Lane name:** "Segments active"
- **Lane icon:** `groups`
- **Cell value:** array of segment ids (subset of `SEGMENTS`).
- **Renderer:** in `renderLaneCell`, branch on `laneId === "segActive"`. Render each segment as a small colored disc (16px) using the segment's `icon` and `color` from `SEGMENTS`. `title` attribute is the segment name. `onClick` sets the matrix segment filter (`setSegFilter(segId)`, requires lifting the click handler into the StagesView prop chain or dispatching via a window-level event; prefer the prop chain).

Default mapping per stage:

| Stage | Segments active |
|---|---|
| trigger | prospect, becoming, certified, cb, consultant, regulator, ews |
| channel | all 7 |
| intake | all 7 |
| self | prospect, becoming, certified, cb, consultant |
| triage | all 7 |
| handle | all 7 |
| escalate | becoming, certified, cb, consultant, regulator, ews |
| resolve | all 7 |
| followup | becoming, certified, cb, consultant |
| feedback | becoming, certified, cb, consultant |
| capture | (empty, internal stage) |
| close | all 7 |

## Section 2, segment label rename

Apply Option A:

- `prospect` becomes name `"Exploring"`, desc unchanged ("Not yet a customer, info request")
- `becoming` becomes name `"Onboarding"`, desc unchanged ("In application / onboarding")

`id` values stay `prospect` and `becoming` to avoid touching the MATRIX keys and lane references. Only the displayed `name` field changes.

## Section 3, channel / department / 3rd-party additions

In `LANES`:

- **`channels` lane:**
  - `trigger`: append `"GMP+ colleague / expert (direct email, to be rerouted)"`.
  - `channel`: append `"GMP+ colleague / expert (direct email, to be rerouted)"`.
  - Renderer: when a channel string contains `"to be rerouted"`, render with a warning class (`ch-tag warn`, orange border).
- **`departments` lane:**
  - `channel` cell: ensure all three are present in this order: `[{dept: "Helpdesk"}, {dept: "Marketing"}, {dept: "IT"}]`.
- **`third` lane:**
  - `channel`: `[{third: "Consultant"}]`
  - `intake`: `[{third: "Consultant"}]`

## Section 4, pain points and thoughts and feelings additions

In `LANES`:

- **`pains.self`:** append `{pain: "Customers struggle to understand what the scheme requirements actually mean for them"}`.
- **`feel.self`:** change `note` to `'"Where is this in the docs? How do I understand what it means?"'`. Keep `feel: "neg"` and `emoji: "(no emoji in deliverables; render via existing emoji field already present in feel cells, retained as legacy data)"`.

Implementation note: the `feel` lane already uses emoji glyphs as part of its existing data model. Those are visual UI affordances inside an internal-only dashboard, not deliverable text. Leave the existing emoji rendering untouched and do not introduce new emoji entries.

## Section 5, "From the 28 April meeting" band (Part 2.5)

New section between the stages section and Part 3 (Goals). Two cards side by side.

Data lives in a new `MEETING_OUTCOMES` constant in `src/data.jsx`:

```js
const MEETING_OUTCOMES = {
  decisions: [
    { status: "decision", text: "Auto-reply for emails: confirms receipt and 3-working-day response message." },
    { status: "decision", text: "Phone IVR opening message: urgent only, with instructions before the queue." },
    { status: "decision", text: "Direct emails to GMP+ experts will be rerouted via Helpdesk alias." },
    { status: "decision", text: "Start monitoring case volume per channel (forms, email)." },
  ],
  open: [
    { status: "open_question", text: "Stage grouping not finalized." },
    { status: "to_be_defined", text: "Customer segment terminology not final." },
    { status: "open_question", text: "Phone-handling improvements still under discussion." },
    { status: "open_question", text: "AI / FAQ self-service improvements still under discussion." },
    { status: "open_question", text: "Scheme document accessibility unresolved." },
  ],
};
```

Renderer: a new `MeetingOutcomes` component in `src/app.jsx`. Left card "Decisions taken" with a check icon (Material Icon `check_circle`, GMP+ green `#38B769`); right card "Open questions" with a question icon (Material Icon `help`, GMP+ orange `#EA8004`). Each item gets a status pill:
- `decision`: green background `#E5F5EC`, green text `#38B769`
- `open_question`: light orange background, orange text `#EA8004`
- `to_be_defined`: light grey background, grey text

## Section 6, two placeholder panels at the top of Part 3

Above the Goals grid, add a row of two cards:

- **Channel intake monitoring**, header "Cases by channel (forms, email, phone)". A "Coming soon, wiring up CRM data" ribbon. Three labelled grey placeholder bars (Forms / Email / Phone), each with a faint dashed outline and no value. This panel is the data hook for the deferred B-scope.
- **AI initiatives**, header "AI explorations". List of three items, each with an `Exploring` pill:
  - "Auto-reply drafting assistance"
  - "FAQ / self-service stress-testing with AI"
  - "Phone-call pre-message and triage automation"

Data lives in a new `AI_INITIATIVES` constant in `src/data.jsx`:

```js
const AI_INITIATIVES = [
  { status: "exploring", text: "Auto-reply drafting assistance" },
  { status: "exploring", text: "FAQ / self-service stress-testing with AI" },
  { status: "exploring", text: "Phone-call pre-message and triage automation" },
];
```

Renderers: new `ChannelMonitoringPlaceholder` and `AIInitiativesPlaceholder` components in `src/app.jsx`.

## Section 7, implementation surface

Files touched:

- **`src/data.jsx`**
  - Rename `prospect.name` and `becoming.name`.
  - Add `MEETING_OUTCOMES` and `AI_INITIATIVES` constants; expose on `window`.
  - Insert `segActive` lane object into `LANES` (after the `actions` lane).
  - Update `channels.trigger`, `channels.channel`, `departments.channel`, `third.channel`, `third.intake`, `pains.self`, `feel.self`.

- **`src/app.jsx`**
  - Extend `renderLaneCell` with the `segActive` branch.
  - Wire segment-disc clicks to `setSegFilter` (pass `setSegFilter` from `App` down through `StagesView` to `renderLaneCell`).
  - Add `MeetingOutcomes`, `ChannelMonitoringPlaceholder`, `AIInitiativesPlaceholder` components.
  - Insert `<MeetingOutcomes/>` between the `stages-section-wide` block and the existing Part 3 heading.
  - Insert the two placeholder panels above `<GoalsSection/>`.

- **`styles.css`**
  - `.ch-tag.warn`, orange border for the rerouted-channel chip (uses GMP+ orange `#EA8004`).
  - `.seg-disc`, circular icon for the new lane.
  - `.status-pill.decision` (GMP+ green `#38B769` on light green `#E5F5EC`).
  - `.status-pill.open_question` (GMP+ orange `#EA8004` on light orange).
  - `.status-pill.to_be_defined` (grey on light grey).
  - `.status-pill.exploring` (GMP+ purple `#6859A7` on light purple `#E8E5F0`).
  - `.outcome-card`, `.placeholder-card`, `.placeholder-bar`, `.placeholder-ribbon`.

No new dependencies. No build step. The page continues to load via Babel-standalone in `index.html`.

## Brand and style constraints

This dashboard is a GMP+ deliverable, so:
- Brand colors: purple `#6859A7` (primary), green `#38B769` (secondary), orange `#EA8004` (tertiary, used sparingly for warnings and open questions).
- Typography: Segoe UI throughout, with Arial/sans-serif as fallback. Already enforced in `styles.css`.
- No em-dashes, en-dashes, smart quotes, ellipsis glyphs, or non-breaking spaces in any new strings added to `data.jsx`. Use ASCII hyphens, straight quotes, three ASCII dots.
- No emojis in any new strings. The existing `feel` lane emojis predate this rule and are kept as legacy UI affordances.
- Headings use sentence case.

## Out of scope (deferred)

- Wiring real intake counts from the xlsx files (B-scope).
- Refactor of `data.jsx` into a single editable config block (C-scope).
- Final segment / stage labels, re-open after the next meeting.
- FAQ accessibility, phone-handling changes, and AI feature decisions, tracked as open questions in Section 5.
