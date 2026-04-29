const { useState: uS, useEffect: uE, useMemo: uM } = React;

const MatrixView = ({ segFilter, urgFilter, onCaseClick }) => {
  return (
    <div className="matrix-wrap">
      <div className="matrix-head">
        <div className="cell">Customer segment</div>
        {URGENCIES.map(u => (
          <div key={u.id} className={`cell u-${u.id}`}>
            <span>{u.name}</span>
            <span className="u-tag">{u.sla}</span>
          </div>
        ))}
      </div>
      {SEGMENTS.map(seg => {
        const segDim = segFilter !== "all" && segFilter !== seg.id;
        return (
          <div className="matrix-row" key={seg.id} style={{ opacity: segDim ? 0.35 : 1 }}>
            <div className="seg-cell">
              <span className="seg-ic" style={{ color: seg.color, borderColor: seg.color + "33" }}>
                <MIcon name={seg.icon} size={20}/>
              </span>
              <div>
                <div className="seg-name">{seg.name}</div>
                <div className="seg-desc">{seg.desc}</div>
              </div>
            </div>
            {URGENCIES.map(u => {
              const cases = MATRIX[seg.id]?.[u.id] || [];
              const urgDim = urgFilter !== "all" && urgFilter !== u.id;
              return (
                <div className="case-cell" key={u.id}>
                  {cases.length === 0 && <div style={{fontSize: 11, color: "var(--text-faint)", fontStyle: "italic", padding: "4px 6px"}}>typically none</div>}
                  {cases.map((c, i) => {
                    const obj = typeof c === "string" ? { text: c } : c;
                    return (
                      <div key={i} className={`case-chip ${u.id} ${urgDim ? "dimmed" : ""}`} onClick={() => onCaseClick && onCaseClick({seg, u, c: obj.text})}>
                        <span className="dot"></span>
                        <span className="case-text">{obj.text}</span>
                        {obj.route && <span className="case-route" title={`Typically routed to ${obj.route}`}>{obj.route}</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const StagesView = ({ activeStage, onStageClick, setSegFilter }) => {
  return (
    <div className="stages-wrap">
      <div className="stages-header-bar">
        <div className="cell head-lane" style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em"}}>Journey stage</div>
        {STAGES.map(s => (
          <div key={s.id} className={`cell ${activeStage === s.id ? "active" : ""}`} onClick={() => onStageClick(s.id)} style={{cursor: "pointer"}}>
            <span className="stage-num">{s.num}</span>
            <span className="stage-lbl">{s.name}</span>
          </div>
        ))}
      </div>
      {LANES.map(lane => (
        <div className="lane-row" key={lane.id}>
          <div className="lane-cell lane-label">
            <span className="ic"><MIcon name={lane.icon} size={14}/></span>
            <span>{lane.name}</span>
          </div>
          {STAGES.map(s => {
            const v = lane.cells[s.id];
            const isActive = activeStage === s.id;
            const cls = `lane-cell ${!v || (Array.isArray(v) && v.length === 0) ? "empty" : ""} ${isActive ? "focus-col" : ""}`;
            return (
              <div className={cls} key={s.id}>
                {renderLaneCell(lane.id, v, setSegFilter)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

function renderLaneCell(laneId, v, setSegFilter) {
  if (!v || (Array.isArray(v) && v.length === 0)) return null;

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

  if (laneId === "feel") {
    if (!v) return null;
    return (
      <div style={{display:"flex", gap: 8, alignItems: "flex-start"}}>
        <span className={`feel ${v.feel}`}>{v.emoji}</span>
        <span className="thought" style={{fontSize: 11.5}}>{v.note}</span>
      </div>
    );
  }
  if (laneId === "actions") {
    return v.map((x, i) => <div key={i} style={{marginBottom: 3}}>{x}</div>);
  }
  if (laneId === "channels") {
    return v.map((x, i) => {
      const warn = typeof x === "string" && x.indexOf("to be rerouted") !== -1;
      return <span key={i} className={`ch-tag${warn ? " warn" : ""}`}>{x}</span>;
    });
  }
  if (laneId === "systems") {
    return v.map((x, i) => <span key={i} className="sys-tag">{x}</span>);
  }
  if (laneId === "helpdesk") {
    return v.map((x, i) => <div key={i} style={{marginBottom: 3, color: 'var(--gmp-purple)'}}>{x}</div>);
  }
  if (laneId === "departments") {
    return v.map((x, i) => <span key={i} className="dept">{x.dept}</span>);
  }
  if (laneId === "third") {
    return v.map((x, i) => <span key={i} className="third">{x.third}</span>);
  }
  if (laneId === "pains") {
    return v.map((x, i) => <div key={i} className="pain" style={{fontSize: 11.5}}>{x.pain}</div>);
  }
  if (laneId === "mot") {
    return v.map((x, i) => <div key={i} className="mot" style={{fontSize: 11.5}}>{x.mot}</div>);
  }
  return null;
}

const StageDetail = ({ stageId, onClose }) => {
  const s = STAGES.find(x => x.id === stageId);
  if (!s) return null;
  const laneBy = id => LANES.find(l => l.id === id)?.cells[stageId];
  const hd = laneBy("helpdesk") || [];
  const pains = laneBy("pains") || [];
  const mot = laneBy("mot") || [];
  return (
    <div className="stage-detail">
      <div>
        <div className="stage-num-big">{s.num}</div>
        <div className="big-stage">{s.name}</div>
        <div className="stage-desc">{s.short}</div>
        <button onClick={onClose} className="chip" style={{alignSelf: "flex-start"}}><MIcon name="close" size={14}/>Close detail</button>
      </div>
      <div className="det-col">
        <h4>Helpdesk actions</h4>
        <ul className="compact">{hd.map((x,i)=><li key={i}>{x}</li>)}</ul>
        {mot.length > 0 && (<>
          <h4 style={{marginTop:16, color: "var(--gmp-orange)"}}>Moment of truth</h4>
          <ul className="compact">{mot.map((x,i)=><li key={i}>{x.mot}</li>)}</ul>
        </>)}
      </div>
      <div className="det-col">
        <h4 style={{color: "var(--gmp-red)"}}>Pain points</h4>
        <ul className="compact">{pains.length ? pains.map((x,i)=><li key={i}>{x.pain}</li>) : <li style={{color:"var(--text-faint)"}}>None identified</li>}</ul>
        <h4 style={{marginTop:16}}>Tools / systems</h4>
        <ul className="compact">{(laneBy("systems")||[]).map((x,i)=><li key={i}>{x}</li>)}</ul>
      </div>
    </div>
  );
};

const GoalsSection = () => (
  <div className="goals-strategy">
    {GOALS.map(g => (
      <div className="goal-card" key={g.n} data-g={g.n}>
        <div className="goal-header">
          <span className="num">{g.n}</span>
          <div>
            <div className="goal-label">{g.label}</div>
            <h3>{g.title}</h3>
          </div>
        </div>
        <p className="goal-strategy">{g.strategy}</p>
        <div>
          <h5>Dashboard measures</h5>
          <ul className="measure-list">{g.measures.map((m,i)=><li key={i}>{m}</li>)}</ul>
        </div>
        <div>
          <h5>Actions 2026</h5>
          <ul className="action-list">{g.actions.map((a,i)=><li key={i}><span className="tag">{a.tag}</span><span>{a.text}</span></li>)}</ul>
        </div>
      </div>
    ))}
  </div>
);

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

const App = () => {
  const DEF = /*EDITMODE-BEGIN*/{"mode":"interactive","density":1}/*EDITMODE-END*/;
  const [tweaks, setTweaks] = uS(() => {
    try { return { ...DEF, ...JSON.parse(localStorage.getItem("hd-tweaks")||"{}") }; }
    catch { return DEF; }
  });
  const [editMode, setEditMode] = uS(false);
  const [segFilter, setSegFilter] = uS("all");
  const [urgFilter, setUrgFilter] = uS("all");
  const [activeStage, setActiveStage] = uS(null);

  uE(() => {
    document.body.dataset.mode = tweaks.mode;
    document.documentElement.style.setProperty("--density", tweaks.density);
    localStorage.setItem("hd-tweaks", JSON.stringify(tweaks));
  }, [tweaks]);

  uE(() => {
    const h = e => {
      if (e.data?.type === "__activate_edit_mode") setEditMode(true);
      if (e.data?.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", h);
    window.parent.postMessage({type:"__edit_mode_available"},"*");
    return () => window.removeEventListener("message", h);
  }, []);

  const setTweak = patch => {
    const next = {...tweaks, ...patch};
    setTweaks(next);
    window.parent.postMessage({type:"__edit_mode_set_keys", edits: patch}, "*");
  };

  return (
    <div>
      <div className="page-top">
        <div className="brand-mark">
          <span className="brand-logo"><img src="assets/gmp-logo-landscape.png" alt="GMP+ International" height="36" style={{height: 36, width: "auto"}}/></span>
          <div className="brand-text">
            <strong>Customer Journey</strong>
            <div className="sub">Helpdesk Strategy 2026</div>
          </div>
        </div>
        <div className="spacer"/>
        <div className="view-toggle">
          <button className={tweaks.mode==="interactive"?"active":""} onClick={()=>setTweak({mode:"interactive"})}>
            <MIcon name="tune" size={14}/> Interactive
          </button>
          <button className={tweaks.mode==="poster"?"active":""} onClick={()=>setTweak({mode:"poster"})}>
            <MIcon name="print" size={14}/> Poster
          </button>
        </div>
        <button className="action-btn" onClick={()=>window.print()}>
          <MIcon name="download" size={14}/> Print / PDF
        </button>
      </div>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="eyebrow"><MIcon name="headset_mic" size={14}/> Helpdesk Strategy 2026</span>
            <h1>One journey for every caller: <strong>prospect, member, auditor and regulator.</strong></h1>
            <p className="sub">Tailored to the GMP+ Helpdesk (one coordinator, two first line and one second line agent). Mapped across seven customer segments and three urgency bands, with our three 2026 goals woven into the flow.</p>
            <div className="meta">
              <div className="item"><div className="k">Owner</div><div className="v">Rick van Dijk</div></div>
              <div className="item"><div className="k">Contributors</div><div className="v">Joris de Gooier, Martin van den Bedum, Gosia Lesko, Agnes van der Zanden, Wenxin Guo</div></div>
              <div className="item"><div className="k">Audience</div><div className="v">Helpdesk team, internal only</div></div>
              <div className="item"><div className="k">Version</div><div className="v">v1.0, April 2026</div></div>
            </div>
          </div>
          <div className="goal-tiles">
            {GOALS.map(g => (
              <div className="goal-tile" key={g.n} data-g={g.n}>
                <span className="g-num">{g.n}</span>
                <div className="g-body">
                  <div className="g-title">{g.title}</div>
                  <div className="g-target">{g.strategy.split(":")[0]}.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="main">
        <div className="prereq">
          <span className="ic"><MIcon name="flag" size={20}/></span>
          <div className="body">
            <h4>Prerequisite: &gt; 3 FTE on the Helpdesk</h4>
            <p>Without sufficient capacity, the improvement goals below are not realistically achievable. <strong>Recruitment and onboarding must precede strategy execution.</strong></p>
          </div>
        </div>

        <div className="section-label">Part 1</div>
        <h2 className="section-title">Who contacts us, and how urgent is it?</h2>
        <p className="section-sub">The matrix below shows the typical questions the Helpdesk receives, grouped by customer segment (rows) and urgency band (columns). Use it to brief new team members and to feed root-cause analysis for recurring questions.</p>

        {tweaks.mode === "interactive" && (
          <div className="filter-bar">
            <div className="filter-group">
              <span className="label">Segment</span>
              <button className={`chip ${segFilter==="all"?"active":""}`} onClick={()=>setSegFilter("all")}>All</button>
              {SEGMENTS.map(s => (
                <button key={s.id} className={`chip ${segFilter===s.id?"active":""}`} onClick={()=>setSegFilter(s.id)}>
                  <MIcon name={s.icon} size={13}/> {s.name}
                </button>
              ))}
            </div>
            <div className="filter-group" style={{marginLeft: "auto"}}>
              <span className="label">Urgency</span>
              <button className={`chip ${urgFilter==="all"?"active":""}`} onClick={()=>setUrgFilter("all")}>All</button>
              {URGENCIES.map(u => (
                <button key={u.id} className={`chip ${u.id} ${urgFilter===u.id?"active":""}`} onClick={()=>setUrgFilter(u.id)}>{u.name}</button>
              ))}
            </div>
          </div>
        )}

        <MatrixView segFilter={segFilter} urgFilter={urgFilter}/>

        <div className="section-label">Part 2</div>
        <h2 className="section-title">Stage by stage: the 12 step Helpdesk journey</h2>
        <p className="section-sub">From the moment the need arises to knowledge capture and close. {tweaks.mode === "interactive" && "Click any stage header to focus the column and see helpdesk actions, pain points and moments of truth."}</p>

        {tweaks.mode === "interactive" && activeStage && (
          <StageDetail stageId={activeStage} onClose={()=>setActiveStage(null)}/>
        )}

      </main>

      <div className="stages-section-wide">
        <StagesView activeStage={activeStage} onStageClick={id => setActiveStage(activeStage === id ? null : id)} setSegFilter={setSegFilter}/>
      </div>

      <main className="main" style={{paddingTop: 0}}>

        <div className="section-label">From the meeting</div>
        <h2 className="section-title">28 April 2026: decisions and open questions</h2>
        <p className="section-sub">Captured live from the helpdesk improvement meeting. Decisions are scheduled to be implemented; open questions return to the next meeting.</p>
        <MeetingOutcomes/>

        <div className="legend-row">
          <span className="l-label">Legend</span>
          <span className="l-item"><span className="l-sw" style={{background:"var(--gmp-purple-50)"}}></span>Lane label</span>
          <span className="l-item"><span className="l-sw" style={{background:"var(--gmp-green-50)"}}></span>Channel tag</span>
          <span className="l-item"><span className="l-sw" style={{background:"var(--gmp-purple-50)"}}></span>System tag</span>
          <span className="l-item"><span className="l-sw" style={{background:"var(--gmp-orange-50)"}}></span>Moment of truth</span>
          <span className="l-item"><span className="l-sw" style={{background:"var(--gmp-red-100)"}}></span>Pain point</span>
        </div>

        <div className="section-label">Part 3</div>
        <h2 className="section-title">Three goals for 2026</h2>
        <p className="section-sub">Each goal pairs a strategy with dashboard measures and quarterly actions. Together they move the Helpdesk from reactive to proactive to automated, in that order.</p>
        <div className="placeholder-row">
          <ChannelMonitoringPlaceholder/>
          <AIInitiativesPlaceholder/>
        </div>
        <GoalsSection/>
      </main>

      {editMode && (
        <div className="tweaks open">
          <div className="tweaks-header">Tweaks <button onClick={()=>setEditMode(false)} className="chip"><MIcon name="close" size={12}/></button></div>
          <div className="tweaks-body">
            <div className="tweak-row">
              <div className="lbl">View mode</div>
              <div className="segmented">
                <button className={tweaks.mode==="interactive"?"active":""} onClick={()=>setTweak({mode:"interactive"})}>Interactive</button>
                <button className={tweaks.mode==="poster"?"active":""} onClick={()=>setTweak({mode:"poster"})}>Poster</button>
              </div>
            </div>
            <div className="tweak-row">
              <div className="lbl">Density {tweaks.density.toFixed(2)}x</div>
              <input type="range" min="0.85" max="1.15" step="0.05" value={tweaks.density} onChange={e=>setTweak({density: parseFloat(e.target.value)})}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
