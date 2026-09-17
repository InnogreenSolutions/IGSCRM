import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = [
  { id: 'tj', name: 'TJ', role: 'Owner · Operations', initials: 'TJ', tone: 'indigo', availability: 'Available' },
  { id: 'max', name: 'Max', role: 'Field Advisor', initials: 'MX', tone: 'mint', availability: '3 visits today' },
  { id: 'shanairah', name: 'Shanairah', role: 'Sales Advisor', initials: 'SH', tone: 'cyan', availability: '2 follow-ups today' },
];

const seedTasks = [
  { id: 1, title: 'Prepare quote for Rinkee Ahmed', meta: 'Toronto Beaches · quote requested from field', person: 'tj', group: 'Now', type: 'Quote' },
  { id: 2, title: 'Call Alex Turner after the assessment', meta: 'Bobcaygeon · customer asked about financing', person: 'max', group: 'Today', type: 'Follow-up' },
  { id: 3, title: 'Send deposit payment link', meta: 'Lennox furnace · $950 deposit outstanding', person: 'shanairah', group: 'Today', type: 'Payment' },
  { id: 4, title: 'Review uploaded lead sheet', meta: '14 new leads · route and assign', person: 'tj', group: 'Waiting', type: 'Leads' },
];

const customers = [
  { id: 1, name: 'Rinkee Ahmed', location: 'Toronto Beaches', stage: 'Quote requested', owner: 'tj', equipment: 'Full home heat pump', next: 'Office to draft proposal' },
  { id: 2, name: 'Alex Turner', location: 'Bobcaygeon', stage: 'Appointment booked', owner: 'max', equipment: 'Electric baseboard', next: 'Visit 11:00 AM today' },
  { id: 3, name: 'Pali Singh', location: 'Brampton', stage: 'Planning', owner: 'tj', equipment: 'Heat pump + attic insulation', next: 'Awaiting retrofit scope' },
];

function Avatar({ personId, small = false }) {
  const person = people.find((item) => item.id === personId) || people[0];
  return <span className={`avatar ${person.tone} ${small ? 'small' : ''}`} title={person.name}>{person.initials}</span>;
}

function App() {
  const [active, setActive] = useState('Command Center');
  const [selected, setSelected] = useState(customers[0]);
  const [tasks, setTasks] = useState(seedTasks);
  const [showTask, setShowTask] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [message, setMessage] = useState('Your operating system is ready. Pick the next move.');

  const openWork = (customer) => {
    setSelected(customer);
    setActive('Workboard');
    setMessage(`${customer.name} is open in the workboard.`);
  };

  const addTask = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') || '').trim();
    if (!title) return;
    setTasks((current) => [{ id: Date.now(), title, meta: 'Created from My Day', person: form.get('person'), group: 'Now', type: 'Task' }, ...current]);
    setShowTask(false);
    setMessage('Task created and placed at the top of My Day.');
  };

  const saveVoice = () => {
    const note = voiceText.trim();
    if (!note) return;
    setTasks((current) => [{ id: Date.now(), title: 'Review field voice memo', meta: note, person: 'tj', group: 'Now', type: 'Voice memo' }, ...current]);
    setVoiceText('');
    setShowVoice(false);
    setMessage('Voice memo saved. A review task was added to TJ’s dashboard.');
  };

  const grouped = useMemo(() => ['Now', 'Today', 'Waiting'].map((group) => ({ group, items: tasks.filter((task) => task.group === group) })), [tasks]);
  const nav = ['Command Center', 'Customers', 'Leads', 'Calendar & Dispatch', 'Jobs', 'Contractors', 'Quotes & Price Book', 'Tasks & Projects', 'Documents Hub', 'Team & Access', 'Inbox'];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◈</span><div><strong>INNOGREEN</strong><small>OPERATING SYSTEM</small></div></div>
        <nav>{nav.map((item) => <button key={item} className={active === item ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(item); setMessage(`${item} is ready in the central workboard.`); }}><span className="nav-dot" />{item}</button>)}</nav>
        <div className="sidebar-bottom">
          <span className="eyebrow gold">OWNER ONLY</span>
          <strong>Finance & cash view</strong>
          <small>QuickBooks connection comes here.</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow mint">HOMEBASE</span><h1>{active === 'Command Center' ? 'Good evening, TJ.' : active}</h1><p>{message}</p></div>
          <div className="top-actions"><button className="ghost" onClick={() => setShowVoice(true)}>◉ Voice memo</button><button className="primary" onClick={() => setShowTask(true)}>+ Add task</button></div>
        </header>

        {active === 'Command Center' ? <>
          <section className="action-row">
            <button onClick={() => setActive('Leads')}><b>+ Assign lead</b><span>Import, route and send to an agent</span></button>
            <button onClick={() => setActive('Customers')}><b>⌕ Find a customer</b><span>Every email, job, document and payment</span></button>
            <button onClick={() => setShowVoice(true)}><b>◉ Drop a memo</b><span>Speak it. It becomes a usable note.</span></button>
            <button onClick={() => setActive('Documents Hub')}><b>▣ Documents hub</b><span>Forms agents can open, fill and submit</span></button>
          </section>

          <section className="metrics">
            <Metric label="Qualified leads" value="18" trend="3 since yesterday" tone="cyan" />
            <Metric label="Booked this week" value="12" trend="60% to campaign goal" tone="indigo" />
            <Metric label="Jobs in motion" value="7" trend="3 need attention" tone="mint" />
            <Metric label="Cash to collect" value="$18.4K" trend="Owner view · this week" tone="gold" />
          </section>

          <section className="grid two-one">
            <div className="panel"><PanelHead title="My Day" subtitle="The few things that actually need attention." action="View all" /><div className="task-groups">{grouped.map(({ group, items }) => <div className="task-group" key={group}><span className="eyebrow">{group}</span>{items.length ? items.map((task) => <Task key={task.id} task={task} onOpen={() => setMessage(`${task.title} is ready for action.`)} />) : <p className="empty">Clear.</p>}</div>)}</div></div>
            <div className="panel assistant"><span className="assistant-orb">✦</span><PanelHead title="Right-hand assistant" subtitle="Drafts, plans and turns loose thoughts into work." /><p className="assistant-copy">“Tell me what is on your mind. I will organize it, draft it and ask before I send or change anything.”</p><div className="assistant-prompt"><input placeholder="Ask it to write, plan or organize…" onKeyDown={(event) => { if (event.key === 'Enter' && event.currentTarget.value) { setMessage(`Draft started: ${event.currentTarget.value}`); event.currentTarget.value = ''; } }} /><span>↗</span></div><div className="assistant-suggestions"><button onClick={() => setMessage('Drafting follow-up email with today’s customer context.')}>Write follow-ups</button><button onClick={() => setMessage('Creating an office-ready quote brief.')}>Create quote brief</button><button onClick={() => setMessage('Turning notes into a clean SOP outline.')}>Turn notes into SOP</button></div></div>
          </section>

          <section className="grid two-one lower"><div className="panel"><PanelHead title="Lead and job flow" subtitle="Real work moving forward, not a decorative chart." /><div className="pipeline">{[['New leads',24,'cyan'],['Qualified',18,'indigo'],['Booked',12,'mint'],['Quote requested',6,'gold'],['Jobs running',7,'mint']].map(([label, amount, tone]) => <div className="pipeline-row" key={label}><span>{label}</span><div className="bar"><i className={tone} style={{ width: `${amount / 24 * 100}%` }} /></div><b>{amount}</b></div>)}</div></div><div className="panel"><PanelHead title="Team pulse" subtitle="Each person sees only their own work." />{people.map((person) => <button className="person-row" key={person.id} onClick={() => setMessage(`${person.name}: ${person.availability}`)}><Avatar personId={person.id}/><span><b>{person.name}</b><small>{person.role}</small></span><em>{person.availability}</em></button>)}</div></section>
        </> : <Workboard active={active} selected={selected} openWork={openWork} setSelected={setSelected} />}
      </main>

      {showTask && <Modal title="Create a task" close={() => setShowTask(false)}><form onSubmit={addTask}><label>What needs to happen?<input autoFocus name="title" placeholder="Example: Call Rinkee after quote review" /></label><label>Assign to<select name="person">{people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select></label><button className="primary wide" type="submit">Create task</button></form></Modal>}
      {showVoice && <Modal title="Drop a voice memo" close={() => setShowVoice(false)}><p className="modal-copy">In the live mobile app this records audio, transcribes it and connects it to the right customer or job. For this foundation, paste the spoken note below to test the workflow.</p><textarea autoFocus value={voiceText} onChange={(event) => setVoiceText(event.target.value)} placeholder="Example: Alex wants the financing options emailed Friday. Call after 6." /><button className="primary wide" onClick={saveVoice}>Save transcript and create review task</button></Modal>}
    </div>
  );
}

function Metric({ label, value, trend, tone }) { return <div className="metric"><span className={`metric-strip ${tone}`} /><span className="eyebrow">{label}</span><b>{value}</b><small>{trend}</small></div>; }
function PanelHead({ title, subtitle, action }) { return <div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="text-button">{action} →</button>}</div>; }
function Task({ task, onOpen }) { return <button className="task" onClick={onOpen}><span className="task-check">✓</span><span className="task-copy"><b>{task.title}</b><small>{task.meta}</small></span><Avatar personId={task.person} small /><span className="task-type">{task.type}</span></button>; }
function Modal({ title, close, children }) { return <div className="modal-backdrop" onMouseDown={close}><section className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><h2>{title}</h2>{children}</section></div>; }

function Workboard({ active, selected, openWork, setSelected }) {
  if (active === 'Customers' || active === 'Leads') return <section className="workboard"><PanelHead title={active} subtitle="One record, one truth. Click a customer to open the full workboard." /><div className="customer-list">{customers.map((customer) => <button key={customer.id} className="customer-row" onClick={() => openWork(customer)}><span className="customer-initial">{customer.name.split(' ').map((part) => part[0]).join('')}</span><span><b>{customer.name}</b><small>{customer.location} · {customer.equipment}</small></span><span className="status">{customer.stage}</span><Avatar personId={customer.owner} small /></button>)}</div></section>;
  if (active === 'Workboard') return <section className="workboard detail"><div className="work-title"><div><span className="eyebrow mint">CUSTOMER WORKBOARD</span><h2>{selected.name}</h2><p>{selected.location} · {selected.equipment}</p></div><div><button className="ghost">Call</button><button className="ghost">Email</button><button className="primary">Create job</button></div></div><div className="work-grid"><div className="panel"><PanelHead title="Next action" subtitle={selected.next} /><div className="checklist"><span>✓ Customer details confirmed</span><span>○ Quote preparation</span><span>○ Deposit request</span><span>○ Contractor assignment</span></div></div><div className="panel"><PanelHead title="Office actions" /><button className="wide ghost">Request quote from office</button><button className="wide ghost">Request deposit payment link</button><button className="wide ghost">Open documents</button></div></div></section>;
  if (active === 'Documents Hub') return <section className="workboard"><PanelHead title="Documents Hub" subtitle="Only approved documents. Agents can open, fill, submit or email them." /><div className="document-grid">{['Homeowner intake', 'Mandatory field checklist', 'Quote request brief', 'Installation closeout', 'EAP evidence checklist', 'Customer project scope'].map((name) => <button className="document" key={name}><span>▣</span><b>{name}</b><small>Open, fill & submit</small></button>)}</div></section>;
  if (active === 'Team & Access') return <section className="workboard"><PanelHead title="Team & access" subtitle="Private workspaces that keep every agent focused on their own customers and jobs." /><div className="team-access-grid">{people.map((person) => <article className="access-card" key={person.id}><Avatar personId={person.id} /><div><b>{person.name}</b><small>{person.role}</small><em>Role-ready profile</em></div><button className="ghost">Set access</button></article>)}</div><div className="integration-callout"><div><span className="eyebrow mint">SECURE SETUP NEXT</span><h2>Add email login and individual app workspaces</h2><p>When you are ready, add each person’s email and number. Financial data stays office-only.</p></div><button className="primary">Invite team member</button></div></section>;
  return <section className="workboard"><PanelHead title={active} subtitle="This central space becomes the active tool, not another dashboard to manage." /><div className="empty-board"><span>✦</span><h2>{active} is ready for its live connection.</h2><p>Use the left navigation to move through the system. Every area opens here.</p></div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
