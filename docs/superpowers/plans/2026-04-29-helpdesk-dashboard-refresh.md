# Helpdesk dashboard refresh implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the structural changes from the 28 April 2026 helpdesk meeting to the dashboard (Option A in the spec): rename two segments, add a "Segments active" lane, expand channels / departments / 3rd parties, refresh pain points and feelings on the self-service stage, add a "From the 28 April meeting" decisions/open-questions band, and add two placeholder panels for channel monitoring and AI initiatives.

**Architecture:** All edits live in three files: `src/data.jsx` (data additions and renames), `src/app.jsx` (one new lane renderer branch and three new components), and `styles.css` (new pill, disc, warn, outcome-card and placeholder-card classes). No build step. The page continues to load via Babel-standalone in `index.html`. Verification is by opening `index.html` in a browser and visually confirming the DOM matches the spec.

**Tech Stack:** React 18 (UMD), Babel-standalone, plain CSS. Material Symbols icons via the existing `MIcon` component (`src/micons.jsx`).

**Spec:** `docs/superpowers/specs/2026-04-29-helpdesk-dashboard-refresh-design.md`

**Brand rules in force:** GMP+ purple `#6859A7`, green `#38B769`, orange `#EA8004`, light purple `#E8E5F0`, light green `#E5F5EC`, body text `#333333`. Segoe UI everywhere. No new emoji glyphs in any deliverable text (the existing `feel` lane emoji are preserved as legacy data only).

---

## File structure (after this plan)

- `src/data.jsx` — gains a `segActive` lane object, `MEETING_OUTCOMES` constant, `AI_INITIATIVES` constant, two segment-name renames, channel/department/3rd-party/pain/feel updates. Same single-file responsibility (the data model).
- `src/app.jsx` — gains three new components (`MeetingOutcomes`, `ChannelMonitoringPlaceholder`, `AIInitiativesPlaceholder`), a `segActive` branch in `renderLaneCell`, and a prop chain to pass `setSegFilter` into the stages renderer.
- `styles.css` — gains classes `.ch-tag.warn`, `.seg-disc`, `.seg-disc-row`, `.status-pill`, `.status-pill.decision`, `.status-pill.open_question`, `.status-pill.to_be_defined`, `.status-pill.exploring`, `.outcome-band`, `.outcome-card`, `.outcome-card.decisions`, `.outcome-card.open`, `.placeholder-row`, `.placeholder-card`, `.placeholder-bar`, `.placeholder-ribbon`, `.ai-list`.

No file splitting. Existing files stay focused; we are adding to each one's existing responsibility.

---

## Task 1: Rename Prospect and Becoming labels

**Files:**
- Modify: `src/data.jsx` lines 4-5

- [ ] **Step 1: Open `src/data.jsx` and locate the SEGMENTS array (lines 3-11).**

- [ ] **Step 2: Change the `name` field for the first two entries.** Replace:

```js
  { id: "prospect",   name: "Prospect",           desc: "Not yet a customer, info request", icon: "help_outline", color: "#8c81bf" },
  { id: "becoming",   name: "Becoming",           desc: "In application / onboarding",       icon: "how_to_reg",   color: "#6859A7" },
```

with:

```js
  { id: "prospect",   name: "Exploring",          desc: "Not yet a customer, info request", icon: "help_outline", color: "#8c81bf" },
  { id: "becoming",   name: "Onboarding",         desc: "In application / onboarding",       icon: "how_to_reg",   color: "#6859A7" },
```

`id` values stay unchanged so MATRIX keys still resolve.

- [ ] **Step 3: Verify in browser.** Open `index.html`. The matrix Part 1 should show segment rows labelled "Exploring" and "Onboarding" (not "Prospect" / "Becoming"). The chip filters at the top of the matrix should also show the new names.

- [ ] **Step 4: Commit.**

```bash
git add src/data.jsx
git commit -m "Rename Prospect/Becoming segments to Exploring/Onboarding"
```

---

## Task 2: Add channel/department/3rd-party additions

**Files:**
- Modify: `src/data.jsx` (the `channels`, `departments`, `third` lanes inside `LANES`)

- [ ] **Step 1: Update `channels.trigger` and `channels.channel`.** In the `channels` lane, change:

```js
      trigger:  [],
      channel:  ["Phone", "Email, info@gmpplus.org", "Web form / portal"],
```

to:

```js
      trigger:  ["GMP+ colleague / expert (direct email, to be rerouted)"],
      channel:  ["Phone", "Email, info@gmpplus.org", "Web form / portal", "GMP+ colleague / expert (direct email, to be rerouted)"],
```

- [ ] **Step 2: Update `departments.channel`.** Change:

```js
      channel:  [{dept: "Marketing"}, {dept: "IT"}],
```

to:

```js
      channel:  [{dept: "Helpdesk"}, {dept: "Marketing"}, {dept: "IT"}],
```

- [ ] **Step 3: Update `third.channel` and `third.intake`.** In the `third` lane, change:

```js
      channel:  [],
      intake:   [],
```

to:

```js
      channel:  [{third: "Consultant"}],
      intake:   [{third: "Consultant"}],
```

- [ ] **Step 4: Verify in browser.** Open `index.html`, scroll to the Stages view (Part 2). On stage **01 Trigger**, the Channels lane should show the new "GMP+ colleague / expert (direct email, to be rerouted)" chip. On **02 Channel choice**, the Channels lane should also show that chip; Departments should now read "Helpdesk Marketing IT" in that order; 3rd parties should show "Consultant". On **03 First contact**, 3rd parties should show "Consultant".

- [ ] **Step 5: Commit.**

```bash
git add src/data.jsx
git commit -m "Add expert-direct-email channel, Helpdesk dept, Consultant third party"
```

---

## Task 3: Add the warning style for the rerouted-channel chip

**Files:**
- Modify: `styles.css` (add new rule, append at end)
- Modify: `src/app.jsx` lines 103-105 (the `channels` branch in `renderLaneCell`)

- [ ] **Step 1: Append the warn style to `styles.css`.**

```css
.ch-tag.warn {
  border-color: #EA8004;
  color: #EA8004;
  background: #FFF4E5;
}
```

- [ ] **Step 2: Update the `channels` branch of `renderLaneCell` in `src/app.jsx`.** Replace:

```js
  if (laneId === "channels") {
    return v.map((x, i) => <span key={i} className="ch-tag">{x}</span>);
  }
```

with:

```js
  if (laneId === "channels") {
    return v.map((x, i) => {
      const warn = typeof x === "string" && x.indexOf("to be rerouted") !== -1;
      return <span key={i} className={`ch-tag${warn ? " warn" : ""}`}>{x}</span>;
    });
  }
```

- [ ] **Step 3: Verify in browser.** Reload `index.html`. The "GMP+ colleague / expert (direct email, to be rerouted)" chips on stages 01 and 02 should now have an orange border and orange text. All other channel chips look unchanged.

- [ ] **Step 4: Commit.**

```bash
git add styles.css src/app.jsx
git commit -m "Style rerouted-channel chip with orange warn border"
```

---

## Task 4: Update self-service pain point and feeling

**Files:**
- Modify: `src/data.jsx` (the `pains.self` cell and the `feel.self` cell inside `LANES`)

- [ ] **Step 1: Update `pains.self`.** Change:

```js
      self:     [{pain: "FAQ outdated / hard to find"}],
```

to:

```js
      self:     [
        {pain: "FAQ outdated / hard to find"},
        {pain: "Customers struggle to understand what the scheme requirements actually mean for them"},
      ],
```

- [ ] **Step 2: Update `feel.self`.** Change:

```js
      self:     { feel: "neg", emoji: "😕", note: "\"Where is this in the docs?\"" },
```

to:

```js
      self:     { feel: "neg", emoji: "😕", note: "\"Where is this in the docs? How do I understand what it means?\"" },
```

The existing emoji is retained as legacy UI data only; no new emoji glyphs are introduced in this plan.

- [ ] **Step 3: Verify in browser.** Reload. On stage **04 Self-service**, the Pain points lane should show two bullets (FAQ outdated; Customers struggle to understand requirements). The Thoughts & feelings lane should show the combined question text.

- [ ] **Step 4: Commit.**

```bash
git add src/data.jsx
git commit -m "Add requirements-comprehension pain point and feeling on self-service stage"
```

---

## Task 5: Add the segActive lane data

**Files:**
- Modify: `src/data.jsx` (insert into `LANES` between the `actions` and `feel` lane objects)

- [ ] **Step 1: Insert the segActive lane object directly after the `actions` lane.** The `actions` lane block ends with `}` followed by a comma (line ~169). Insert immediately after it:

```js
  {
    id: "segActive", name: "Segments active", icon: "groups",
    cells: {
      trigger:  ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      channel:  ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      intake:   ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      self:     ["prospect", "becoming", "certified", "cb", "consultant"],
      triage:   ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      handle:   ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      escalate: ["becoming", "certified", "cb", "consultant", "regulator", "ews"],
      resolve:  ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
      followup: ["becoming", "certified", "cb", "consultant"],
      feedback: ["becoming", "certified", "cb", "consultant"],
      capture:  [],
      close:    ["prospect", "becoming", "certified", "cb", "consultant", "regulator", "ews"],
    }
  },
```

- [ ] **Step 2: Verify in browser.** Reload. A new lane row labelled "Segments active" should appear directly under "Customer actions". The cells render the raw segment ids as plain strings (because the renderer branch does not exist yet). This is expected and will be styled in Task 6.

- [ ] **Step 3: Commit.**

```bash
git add src/data.jsx
git commit -m "Add segActive lane data with default per-stage segment mapping"
```

---

## Task 6: Render segActive as colored discs and wire click to filter

**Files:**
- Modify: `src/app.jsx` (`renderLaneCell` signature and body, `StagesView` props, `App` props)
- Modify: `styles.css` (append new disc and disc-row classes)

- [ ] **Step 1: Append the disc styles to `styles.css`.**

```css
.seg-disc-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.seg-disc {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid;
  background: #fff;
  cursor: pointer;
  line-height: 0;
}
.seg-disc:hover {
  transform: scale(1.15);
}
```

- [ ] **Step 2: Update `renderLaneCell` to accept and use `setSegFilter`.** In `src/app.jsx`, change the signature line:

```js
function renderLaneCell(laneId, v) {
```

to:

```js
function renderLaneCell(laneId, v, setSegFilter) {
```

Then, immediately above the `if (laneId === "feel")` branch (around line 91, after the early-return null check), insert:

```js
  if (laneId === "segActive") {
    return (
      <div className="seg-disc-row">
        {v.map((segId, i) => {
          const seg = SEGMENTS.find(s => s.id === segId);
          if (!seg) return null;
          return (
            <span
              key={i}
              className="seg-disc"
              style={{ color: seg.color, borderColor: seg.color }}
              title={seg.name}
              onClick={() => setSegFilter && setSegFilter(seg.id)}
            >
              <MIcon name={seg.icon} size={12}/>
            </span>
          );
        })}
      </div>
    );
  }
```

- [ ] **Step 3: Pass `setSegFilter` through `StagesView`.** Change the `StagesView` definition signature from:

```js
const StagesView = ({ activeStage, onStageClick }) => {
```

to:

```js
const StagesView = ({ activeStage, onStageClick, setSegFilter }) => {
```

Inside the `LANES.map` block of `StagesView`, change the call:

```js
                {renderLaneCell(lane.id, v)}
```

to:

```js
                {renderLaneCell(lane.id, v, setSegFilter)}
```

- [ ] **Step 4: Pass `setSegFilter` from `App` into `StagesView`.** Change the existing usage:

```jsx
        <StagesView activeStage={activeStage} onStageClick={id => setActiveStage(activeStage === id ? null : id)}/>
```

to:

```jsx
        <StagesView activeStage={activeStage} onStageClick={id => setActiveStage(activeStage === id ? null : id)} setSegFilter={setSegFilter}/>
```

- [ ] **Step 5: Verify in browser.** Reload. The "Segments active" lane should now show small colored discs (one per active segment) instead of raw text. Hovering shows the segment name. Clicking a disc on stage 01 should set the matrix filter at the top of the page (you should see the matrix dim all rows except the one you clicked). Stage **11 Knowledge capture** should show no discs (its array is empty).

- [ ] **Step 6: Commit.**

```bash
git add src/app.jsx styles.css
git commit -m "Render segActive lane as clickable colored segment discs"
```

---

## Task 7: Add MEETING_OUTCOMES and AI_INITIATIVES data

**Files:**
- Modify: `src/data.jsx` (add new constants near the bottom; expose on window)

- [ ] **Step 1: Insert above the final `Object.assign(window, ...)` line:**

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

const AI_INITIATIVES = [
  { status: "exploring", text: "Auto-reply drafting assistance" },
  { status: "exploring", text: "FAQ / self-service stress-testing with AI" },
  { status: "exploring", text: "Phone-call pre-message and triage automation" },
];
```

- [ ] **Step 2: Update the existing `Object.assign` line to expose the new constants.** Change:

```js
Object.assign(window, { SEGMENTS, URGENCIES, MATRIX, STAGES, LANES, GOALS });
```

to:

```js
Object.assign(window, { SEGMENTS, URGENCIES, MATRIX, STAGES, LANES, GOALS, MEETING_OUTCOMES, AI_INITIATIVES });
```

- [ ] **Step 3: Verify in browser console.** Reload. Open DevTools console and type `window.MEETING_OUTCOMES`. It should print the object with `decisions` (4 items) and `open` (5 items). Type `window.AI_INITIATIVES` and confirm it prints an array of 3 items.

- [ ] **Step 4: Commit.**

```bash
git add src/data.jsx
git commit -m "Add MEETING_OUTCOMES and AI_INITIATIVES data constants"
```

---

## Task 8: Add status-pill and outcome-card styles

**Files:**
- Modify: `styles.css` (append at end)

- [ ] **Step 1: Append the following CSS:**

```css
.status-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-right: 8px;
  vertical-align: middle;
}
.status-pill.decision {
  background: #E5F5EC;
  color: #38B769;
}
.status-pill.open_question {
  background: #FFF4E5;
  color: #EA8004;
}
.status-pill.to_be_defined {
  background: #EEEEEE;
  color: #666666;
}
.status-pill.exploring {
  background: #E8E5F0;
  color: #6859A7;
}

.outcome-band {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0 8px;
}
.outcome-card {
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 16px 18px;
  background: #FFFFFF;
}
.outcome-card.decisions { border-left: 4px solid #38B769; }
.outcome-card.open { border-left: 4px solid #EA8004; }
.outcome-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #6859A7;
  display: flex;
  align-items: center;
  gap: 8px;
}
.outcome-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.outcome-card li {
  font-size: 12px;
  line-height: 1.4;
  padding: 6px 0;
  border-top: 1px dashed #EEEEEE;
}
.outcome-card li:first-child { border-top: 0; }
```

- [ ] **Step 2: Verify.** Reload `index.html`. Nothing visual should change yet (no consumer renders these classes). Open DevTools, run `getComputedStyle(document.body).fontFamily` to confirm Segoe UI is still active. This is a sanity-only step before Task 9 wires the renderer.

- [ ] **Step 3: Commit.**

```bash
git add styles.css
git commit -m "Add status-pill and outcome-card styles"
```

---

## Task 9: Add the MeetingOutcomes component and mount it between Part 2 and Part 3

**Files:**
- Modify: `src/app.jsx` (new component definition + JSX insertion in `App`)

- [ ] **Step 1: Add the `MeetingOutcomes` component definition above `const App = () => {` (near line 184).**

```jsx
const MeetingOutcomes = () => {
  const { decisions, open } = MEETING_OUTCOMES;
  return (
    <div className="outcome-band">
      <div className="outcome-card decisions">
        <h3><MIcon name="check_circle" size={18}/> Decisions taken (28 April 2026)</h3>
        <ul>
          {decisions.map((d, i) => (
            <li key={i}><span className={`status-pill ${d.status}`}>{d.status.replace("_"," ")}</span>{d.text}</li>
          ))}
        </ul>
      </div>
      <div className="outcome-card open">
        <h3><MIcon name="help" size={18}/> Open questions</h3>
        <ul>
          {open.map((d, i) => (
            <li key={i}><span className={`status-pill ${d.status}`}>{d.status.replace("_"," ")}</span>{d.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Mount `<MeetingOutcomes/>` between the stages section and Part 3.** In the `App` JSX, locate the line:

```jsx
      <main className="main" style={{paddingTop: 0}}>
```

(it appears after `</div>` closing `stages-section-wide`). Immediately after that opening `<main>` tag, insert:

```jsx
        <div className="section-label">From the meeting</div>
        <h2 className="section-title">28 April 2026: decisions and open questions</h2>
        <p className="section-sub">Captured live from the helpdesk improvement meeting. Decisions are scheduled to be implemented; open questions return to the next meeting.</p>
        <MeetingOutcomes/>

```

This places the band before the existing legend row and Part 3 heading.

- [ ] **Step 3: Verify in browser.** Reload. Below the stages grid, a new section "From the meeting" appears with two side-by-side cards. Left card has 4 green-bordered "DECISION" rows. Right card has 5 rows: 4 with orange "OPEN QUESTION" pills and 1 with a grey "TO BE DEFINED" pill ("Customer segment terminology not final").

- [ ] **Step 4: Commit.**

```bash
git add src/app.jsx
git commit -m "Add MeetingOutcomes band between stages and Part 3"
```

---

## Task 10: Add placeholder-card styles

**Files:**
- Modify: `styles.css` (append at end)

- [ ] **Step 1: Append:**

```css
.placeholder-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0 24px;
}
.placeholder-card {
  position: relative;
  border: 1px dashed #B0A8D0;
  border-radius: 8px;
  padding: 16px 18px;
  background: #FAFAFC;
}
.placeholder-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #6859A7;
}
.placeholder-ribbon {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: #E8E5F0;
  color: #6859A7;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.placeholder-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
}
.placeholder-bar .lbl {
  font-size: 11px;
  color: #666666;
  width: 60px;
}
.placeholder-bar .bar {
  flex: 1;
  height: 14px;
  border: 1px dashed #B0A8D0;
  border-radius: 4px;
  background: repeating-linear-gradient(
    45deg,
    #F4F2F8,
    #F4F2F8 6px,
    #FFFFFF 6px,
    #FFFFFF 12px
  );
}
.ai-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ai-list li {
  font-size: 12px;
  padding: 6px 0;
  border-top: 1px dashed #EEEEEE;
}
.ai-list li:first-child { border-top: 0; }
```

- [ ] **Step 2: Verify.** Reload. Nothing visual changes yet. Sanity check via DevTools that `.placeholder-card` is recognised: in console run `document.querySelector(".placeholder-card")`, expect `null` (no consumers yet, that is fine).

- [ ] **Step 3: Commit.**

```bash
git add styles.css
git commit -m "Add placeholder-card and AI-list styles"
```

---

## Task 11: Add ChannelMonitoringPlaceholder and AIInitiativesPlaceholder components and mount them above Goals

**Files:**
- Modify: `src/app.jsx` (two new components + JSX insertion in `App`)

- [ ] **Step 1: Add both components above `const App = () => {`.**

```jsx
const ChannelMonitoringPlaceholder = () => (
  <div className="placeholder-card">
    <span className="placeholder-ribbon">Coming soon</span>
    <h3><MIcon name="bar_chart" size={18}/> Cases by channel (forms, email, phone)</h3>
    <div className="placeholder-bar"><span className="lbl">Forms</span><span className="bar"></span></div>
    <div className="placeholder-bar"><span className="lbl">Email</span><span className="bar"></span></div>
    <div className="placeholder-bar"><span className="lbl">Phone</span><span className="bar"></span></div>
    <p style={{fontSize: 11, color: "#666", margin: "10px 0 0"}}>Wiring up CRM data in a follow-up pass once labels are stable.</p>
  </div>
);

const AIInitiativesPlaceholder = () => (
  <div className="placeholder-card">
    <h3><MIcon name="auto_awesome" size={18}/> AI explorations</h3>
    <ul className="ai-list">
      {AI_INITIATIVES.map((a, i) => (
        <li key={i}><span className={`status-pill ${a.status}`}>{a.status}</span>{a.text}</li>
      ))}
    </ul>
  </div>
);
```

- [ ] **Step 2: Mount the placeholder row above the existing Part 3 Goals section.** In the `App` JSX, locate:

```jsx
        <div className="section-label">Part 3</div>
        <h2 className="section-title">Three goals for 2026</h2>
        <p className="section-sub">Each goal pairs a strategy with dashboard measures and quarterly actions. Together they move the Helpdesk from reactive to proactive to automated, in that order.</p>
        <GoalsSection/>
```

Insert the placeholder row directly before `<GoalsSection/>`:

```jsx
        <div className="placeholder-row">
          <ChannelMonitoringPlaceholder/>
          <AIInitiativesPlaceholder/>
        </div>
        <GoalsSection/>
```

- [ ] **Step 3: Verify in browser.** Reload. Above the three Goal cards, two side-by-side dashed-border cards now appear. The left card has a purple "COMING SOON" ribbon and three labelled placeholder bars (Forms / Email / Phone). The right card lists three AI initiatives, each with a purple "EXPLORING" pill.

- [ ] **Step 4: Commit.**

```bash
git add src/app.jsx
git commit -m "Add ChannelMonitoring and AIInitiatives placeholder cards above Goals"
```

---

## Task 12: Final visual review and end-to-end commit

- [ ] **Step 1: Reload `index.html` and walk the page top to bottom.** Confirm the following, in order:
  - Hero unchanged.
  - Part 1 matrix shows segment rows "Exploring" and "Onboarding" (renamed).
  - Part 1 segment chip filters show the renamed labels.
  - Part 2 stages view shows a new "Segments active" lane between "Customer actions" and "Thoughts & feelings", with colored discs.
  - Stage 01 Trigger has 7 segment discs and a "GMP+ colleague / expert (direct email, to be rerouted)" chip with orange border.
  - Stage 02 Channel choice: departments read "Helpdesk Marketing IT", 3rd parties read "Consultant", channel chips include the rerouted-expert chip with orange border.
  - Stage 03 First contact shows "Consultant" under 3rd parties.
  - Stage 04 Self-service: Pain points lane shows two bullets including "Customers struggle to understand what the scheme requirements actually mean for them". Thoughts & feelings shows the combined question.
  - Below the stages grid: "From the meeting" band with two cards (Decisions taken / Open questions) and status pills.
  - Above the Goals grid: two dashed-border placeholder cards (channel intake monitoring / AI explorations).
  - Print/PDF button still works (visual smoke test only — open the print dialog and cancel).

- [ ] **Step 2: If any visual issue, fix in place and amend.** Otherwise, no further changes.

- [ ] **Step 3: Confirm git log.** Run `git log --oneline` and verify Tasks 1-11 each produced exactly one commit (no co-author trailer).

---

## Verification summary

- No new tests added: this project has no test framework. Verification is browser-based and described in each task.
- No new dependencies, no build step.
- No emoji glyphs added in any text. The existing `feel` lane emoji are preserved as legacy UI data only.
- All new colors use the GMP+ palette (`#6859A7`, `#38B769`, `#EA8004`, `#E8E5F0`, `#E5F5EC`).
- All new headings render in Segoe UI through inheritance from `body`.

---

## Out of scope (deferred to later passes)

- Wiring real intake counts from `files/Helpdesk performance 2025.xlsx`, `files/Helpdesk performance 2026.xlsx`, `files/All Cases - S&S Monthly Report 20_3_2026 17-34-26.xlsx` into the Channel intake monitoring card (B-scope).
- Refactoring `src/data.jsx` into a single editable config block for segment / stage / lane labels (C-scope).
- Final segment / stage labels: revisit after the next helpdesk meeting once decisions land.
