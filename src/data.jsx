// Helpdesk Customer Journey, data model

const SEGMENTS = [
  { id: "prospect",   name: "Prospect",           desc: "Not yet a customer, info request", icon: "help_outline", color: "#8c81bf" },
  { id: "becoming",   name: "Becoming",           desc: "In application / onboarding",       icon: "how_to_reg",   color: "#6859A7" },
  { id: "certified",  name: "Certified company",  desc: "Existing member, part of the global GMP+ community", icon: "verified", color: "#38B769" },
  { id: "cb",         name: "Certification Body", desc: "Auditor, global network of CBs",   icon: "gavel",        color: "#2fa35d" },
  { id: "consultant", name: "Consultant / Partner", desc: "Advisor acting on behalf of member", icon: "diversity_3", color: "#EA8004" },
  { id: "regulator",  name: "Regulator / Authority", desc: "NVWA, FAVV, national authority", icon: "account_balance", color: "#4a3d84" },
  { id: "ews",        name: "Anonymous / EWS",    desc: "Whistleblower, Early Warning System", icon: "shield",     color: "#c84b4b" },
];

const URGENCIES = [
  { id: "critical", name: "Critical",       desc: "Business impact, act today",          sla: "< 4h first response", color: "var(--gmp-red)" },
  { id: "standard", name: "Standard",       desc: "Needs resolution within SLA",          sla: "< 3 days resolution", color: "var(--gmp-orange)" },
  { id: "info",     name: "Informational",  desc: "General question, no deadline",       sla: "Best effort",         color: "var(--gmp-green)" },
];

// Matrix: segment x urgency to typical cases
const MATRIX = {
  prospect: {
    critical: [],
    standard: [
      "How do I become GMP+ certified?",
      "Which scheme fits my activity, FSA or FRA?",
      "What does certification cost?",
    ],
    info: [
      "General scheme information",
      "Request brochure / contact sales",
      "Comparison with other feed schemes",
    ],
  },
  becoming: {
    critical: [
      "Audit scheduled this week, urgent scope clarification",
    ],
    standard: [
      "Application status / expected timeline",
      "Document upload fails in portal",
      "Which CB can audit my activity in country X?",
      "Scope code doesn't match my process",
    ],
    info: [
      "Onboarding roadmap & checklist",
      "Guidance on HACCP and supplier assessment (Academy, TS documents)",
    ],
  },
  certified: {
    critical: [
      "Login to portal not working",
      { text: "Certificate status shows 'suspended', why?", route: "CB" },
      { text: "EWS incident at my facility, what is the notification procedure?", route: "CB" },
    ],
    standard: [
      "Certificate expiring, renewal process",
      "Does a Country Note apply to my situation?",
      { text: "Request an individual derogation", route: "Scheme" },
      "Change of scope / additional activity",
      "Invoice question, payment reminder",
      { text: "Risk assessment methodology / FSP database question", route: "FSP" },
    ],
    info: [
      "Where do I find the latest scheme documents (R / TS / MI)?",
      "Training opportunities, Academy",
      "Upcoming scheme changes",
    ],
  },
  cb: {
    critical: [
      "Auditor portal down during audit",
      "Urgent accreditation / scope question",
    ],
    standard: [
      "Scheme rule interpretation (R / TS / MI)",
      "Upload audit result rejected by validation",
      "Change of Certification Body (CB switch) procedure",
      { text: "Nonconformity classification unclear", route: "Scheme" },
    ],
    info: [
      "Calendar of scheme updates",
      "CB portal release notes",
    ],
  },
  consultant: {
    critical: [],
    standard: [
      "Access on behalf of client, delegation",
      "Scope interpretation for client X",
      "Batch scope change for multiple clients",
    ],
    info: [
      "Training, consultant qualification",
      "Scheme documentation bundle",
    ],
  },
  regulator: {
    critical: [
      "Request for audit evidence, incident investigation",
    ],
    standard: [
      "Verify certificate status of company Y",
      { text: "Scheme equivalence / recognition question", route: "Scheme" },
    ],
    info: [
      "Annual statistics, published reports",
    ],
  },
  ews: {
    critical: [
      "Report contamination / feed safety risk",
      "Report integrity breach by certified company",
    ],
    standard: [],
    info: [
      "How does the EWS process work?",
    ],
  },
};

// Journey stages (12)
const STAGES = [
  { id: "trigger",    num: "01", name: "Trigger",         short: "Need arises", icon: "bolt" },
  { id: "channel",    num: "02", name: "Channel choice",  short: "Picks channel", icon: "hub" },
  { id: "intake",     num: "03", name: "First contact",   short: "Intake", icon: "call_received" },
  { id: "self",       num: "04", name: "Self-service",    short: "FAQ, docs", icon: "menu_book" },
  { id: "triage",     num: "05", name: "Triage",          short: "Classify & route", icon: "category" },
  { id: "handle",     num: "06", name: "Agent handling",  short: "1st line takes it", icon: "headset_mic" },
  { id: "escalate",   num: "07", name: "Escalation",      short: "Specialist / 2nd line", icon: "escalator_warning" },
  { id: "resolve",    num: "08", name: "Resolution",      short: "Answer given", icon: "task_alt" },
  { id: "followup",   num: "09", name: "Follow-up",       short: "Confirm & verify", icon: "forum" },
  { id: "feedback",   num: "10", name: "Feedback",        short: "CSAT", icon: "sentiment_satisfied" },
  { id: "capture",    num: "11", name: "Knowledge capture", short: "Into KB / FAQ", icon: "library_add" },
  { id: "close",      num: "12", name: "Close & archive", short: "Done", icon: "archive" },
];

// Lanes x stages. Each cell is an array of strings (or a single string).
const LANES = [
  {
    id: "actions", name: "Customer actions", icon: "person",
    cells: {
      trigger:  ["Runs into a question", "Notices issue / deadline"],
      channel:  ["Picks phone / mail / portal", "Searches GMP+ site"],
      intake:   ["Describes the problem", "Provides company ID"],
      self:     ["Opens FAQ", "Reads scheme doc"],
      triage:   ["Waits for routing", "Provides more context"],
      handle:   ["Answers agent's questions", "Shares attachments"],
      escalate: ["Explains again to specialist"],
      resolve:  ["Receives the answer", "Tests / applies it"],
      followup: ["Confirms it worked", "Asks follow-up"],
      feedback: ["Rates interaction (CSAT)"],
      capture:  [],
      close:    ["Receives closure email"],
    }
  },
  {
    id: "feel", name: "Thoughts & feelings", icon: "psychology",
    cells: {
      trigger:  { feel: "neu", emoji: "🤔", note: "\"Who can help me?\"" },
      channel:  { feel: "neu", emoji: "😐", note: "\"Which channel is fastest?\"" },
      intake:   { feel: "neu", emoji: "🙂", note: "\"Finally someone picks up\"" },
      self:     { feel: "neg", emoji: "😕", note: "\"Where is this in the docs?\"" },
      triage:   { feel: "neg", emoji: "😑", note: "\"Hope it's the right team\"" },
      handle:   { feel: "pos", emoji: "🙂", note: "\"They understand\"" },
      escalate: { feel: "neg", emoji: "😓", note: "\"Do I have to re-explain?\"" },
      resolve:  { feel: "pos", emoji: "😊", note: "\"Clear answer\"" },
      followup: { feel: "pos", emoji: "🙂", note: "\"They checked on me\"" },
      feedback: { feel: "pos", emoji: "👍", note: "\"Worth sharing feedback\"" },
      capture:  null,
      close:    { feel: "pos", emoji: "✅", note: "\"Taken care of\"" },
    }
  },
  {
    id: "channels", name: "Channels & touchpoints", icon: "share",
    cells: {
      trigger:  [],
      channel:  ["Phone", "Email, info@gmpplus.org", "Web form / portal"],
      intake:   ["Phone IVR", "Ticket created (email-to-ticket)", "Portal form"],
      self:     ["gmpplus.org FAQ", "Scheme library (R/TS/MI)", "Academy"],
      triage:   ["Ticket in queue", "Categorisation rules"],
      handle:   ["Email thread", "Phone callback"],
      escalate: ["Internal handoff", "Specialist call"],
      resolve:  ["Final email", "Portal message"],
      followup: ["3-day check-in email", "Optional call"],
      feedback: ["1-click CSAT (email)", "Portal survey"],
      capture:  ["FAQ editor", "KB category"],
      close:    ["Auto-close after 5d"],
    }
  },
  {
    id: "systems", name: "Systems used", icon: "memory",
    cells: {
      trigger:  [],
      channel:  ["Website CMS", "Phone system", "Mail server"],
      intake:   ["Ticket system (CRM)", "CRM lookup"],
      self:     ["CMS, FAQ", "Document portal"],
      triage:   ["CRM rules engine", "Routing protocol"],
      handle:   ["CRM, case view", "Knowledge base"],
      escalate: ["CRM handoff queue", "Teams, specialist chat"],
      resolve:  ["CRM, resolution note"],
      followup: ["CRM, reminder", "Mail merge"],
      feedback: ["CSAT tool", "CRM tag"],
      capture:  ["KB editor", "FAQ publish"],
      close:    ["CRM auto-close", "Archive"],
    }
  },
  {
    id: "helpdesk", name: "Helpdesk actions", icon: "support_agent",
    cells: {
      trigger:  [],
      channel:  ["Monitor queues", "Ensure coverage"],
      intake:   ["Greet, identify customer", "Capture details"],
      self:     ["Point to correct FAQ / doc"],
      triage:   ["Apply category + urgency", "Route to 1st line / 2nd line"],
      handle:   ["Research via KB", "Draft response", "Call back if needed"],
      escalate: ["Brief specialist", "Co-draft answer"],
      resolve:  ["Send clear, concise answer", "Log solution in case"],
      followup: ["3-day ageing check", "Proactive check-in"],
      feedback: ["Send CSAT", "Act on low scores"],
      capture:  ["Add to KB if recurring", "Tag VOC theme"],
      close:    ["Close case", "Archive files"],
    }
  },
  {
    id: "departments", name: "GMP+ departments", icon: "apartment",
    cells: {
      trigger:  [],
      channel:  [{dept: "Marketing"}, {dept: "IT"}],
      intake:   [{dept: "Helpdesk"}],
      self:     [{dept: "Marketing"}, {dept: "Scheme"}],
      triage:   [{dept: "Helpdesk"}],
      handle:   [{dept: "Helpdesk 1st line"}],
      escalate: [{dept: "Scheme"}, {dept: "IT"}, {dept: "Finance"}, {dept: "Legal"}, {dept: "Compliance"}],
      resolve:  [{dept: "Helpdesk"}],
      followup: [{dept: "Helpdesk"}],
      feedback: [{dept: "Helpdesk"}, {dept: "CX"}],
      capture:  [{dept: "Helpdesk"}, {dept: "Scheme"}],
      close:    [{dept: "Helpdesk"}],
    }
  },
  {
    id: "third", name: "Third parties", icon: "groups",
    cells: {
      trigger:  [],
      channel:  [],
      intake:   [],
      self:     [],
      triage:   [],
      handle:   [{third: "CB"}, {third: "Consultant"}],
      escalate: [{third: "CB"}, {third: "Auditor"}, {third: "Lab"}],
      resolve:  [],
      followup: [],
      feedback: [],
      capture:  [],
      close:    [],
    }
  },
  {
    id: "pains", name: "Pain points", icon: "error",
    cells: {
      trigger:  [],
      channel:  [{pain: "Unclear which channel fits best"}],
      intake:   [{pain: "Login issues recur, repeat contact"}],
      self:     [{pain: "FAQ outdated / hard to find"}],
      triage:   [{pain: "Manual routing, inconsistent categorisation"}],
      handle:   [{pain: "Knowledge scattered, answers differ per agent"}],
      escalate: [{pain: "Customer must re-explain, context lost"}],
      resolve:  [{pain: "Ageing > 3 days not always visible"}],
      followup: [{pain: "No systematic check-in on older cases"}],
      feedback: [{pain: "CSAT response rate low"}],
      capture:  [{pain: "Insights not fed back into FAQ"}],
      close:    [],
    }
  },
  {
    id: "mot", name: "Moment of truth", icon: "star",
    cells: {
      trigger:  [],
      channel:  [],
      intake:   [{mot: "Customer feels heard at first contact"}],
      self:     [],
      triage:   [{mot: "Routed correctly first time"}],
      handle:   [{mot: "Clear, consistent answer"}],
      escalate: [{mot: "Warm handoff, no re-explaining"}],
      resolve:  [{mot: "Resolution within 3 days (75% target)"}],
      followup: [{mot: "Proactive check-in on ageing"}],
      feedback: [],
      capture:  [],
      close:    [],
    }
  },
];

// Goals
const GOALS = [
  {
    n: 1,
    label: "Goal 1",
    title: "75% resolved within 3 days",
    strategy: "Process optimisation and knowledge standardisation: a uniform way of working, consistent routing and a structured knowledge base, so the team answers faster and more consistently.",
    measures: [
      "% cases resolved within 3 days (target: 75%)",
      "Average lead time (days)",
      "First response time (hours)",
      "Ageing cases > 3 days (%)",
    ],
    actions: [
      { tag: "Q1", text: "Baseline measurement of current lead times" },
      { tag: "Q1", text: "Set up categorisation and routing protocol" },
      { tag: "Q2", text: "Structure internal knowledge base per category" },
      { tag: "Q2", text: "Implement SLA monitoring dashboard" },
    ],
  },
  {
    n: 2,
    label: "Goal 2",
    title: "10% fewer cases through 1-3 improvements",
    strategy: "Proactive information provision driven by customer feedback (outside-in): identify recurring questions, address the root cause, and publish information before customers need to ask.",
    measures: [
      "Case volume trend (monthly, YoY)",
      "% repeated / recurring question types",
      "Self-service usage (FAQ / portal hits)",
      "Customer satisfaction (CSAT) per channel",
    ],
    actions: [
      { tag: "Q1", text: "Analyse top-10 recurring questions (VOC)" },
      { tag: "Q2", text: "Root cause analysis on top-3 question categories" },
      { tag: "Q3", text: "Publish proactive FAQ / self-service content" },
      { tag: "Q4", text: "Set up VOC feedback loop (periodic analysis)" },
    ],
  },
  {
    n: 3,
    label: "Goal 3",
    title: "10% of cases handled through automation",
    strategy: "Supported service delivery through intelligent automation: repetitive and standard questions handled automatically, freeing the team to focus on complex cases.",
    measures: [
      "% cases fully handled by automation (target: 10%)",
      "Accuracy / quality score of automated answers",
      "Escalation rate (automated to human)",
      "Customer satisfaction on automated interactions",
    ],
    actions: [
      { tag: "Q1", text: "Identify question types suitable for automation" },
      { tag: "Q2", text: "Make knowledge base automation-ready" },
      { tag: "Q3", text: "Set up and test chatbot / automation pilot" },
      { tag: "Q4", text: "Measurement framework for automation quality" },
    ],
  },
];

Object.assign(window, { SEGMENTS, URGENCIES, MATRIX, STAGES, LANES, GOALS });
