import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = [
  { id: 'tj', name: 'TJ', role: 'Owner · Operations', initials: 'TJ', tone: 'indigo', availability: 'Available' },
  { id: 'max', name: 'Max', role: 'Field Advisor', initials: 'MX', tone: 'mint', availability: '3 visits today' },
  { id: 'hassan', name: 'Hassan', role: 'Field Sales Advisor', initials: 'HA', tone: 'gold', availability: 'Workspace ready' },
  { id: 'aun', name: 'Aun', role: 'Independent Sales Partner', initials: 'AU', tone: 'violet', availability: 'Learning hub ready' },
  { id: 'shanairah', name: 'Shanairah', role: 'Sales Advisor', initials: 'SH', tone: 'cyan', availability: '2 follow-ups today' },
];

const agentProfiles = {
  max: { id: 'max', name: 'Max', initials: 'MX', role: 'Field Advisor', mode: 'field' },
  hassan: { id: 'hassan', name: 'Hassan', initials: 'HA', role: 'Field Sales Advisor', mode: 'field' },
  aun: { id: 'aun', name: 'Aun', initials: 'AU', role: 'Independent Sales Partner', mode: 'partner' },
};

const seedTasks = [
  { id: 1, title: 'Priority customer follow-up', meta: 'Contact customer and record next action', person: 'tj', group: 'Now', type: 'High priority' },
  { id: 2, title: 'Write email to EnviroCentre about EAP', meta: 'Draft, review and send from the office dashboard', person: 'tj', group: 'Now', type: 'Email' },
  { id: 3, title: 'Finish company portfolio with licences attached', meta: 'Add TSSA, WSIB, insurance, HRAI and technician credentials', person: 'tj', group: 'Today', type: 'Project' },
  { id: 4, title: 'Organize heat pump project pictures', meta: 'Sort by customer, equipment and completed installation', person: 'tj', group: 'Today', type: 'Documents' },
  { id: 5, title: 'Submit Small Business Starter grant documents', meta: 'Confirm required documents before submission', person: 'tj', group: 'Today', type: 'Grant' },
  { id: 6, title: 'QuickBooks cleanup', meta: 'Scheduled office block · categorize receipts and reconcile activity', person: 'tj', group: 'Waiting', type: 'Finance' },
  { id: 7, title: 'Rent due reminder', meta: 'Recurring monthly business reminder', person: 'tj', group: 'Waiting', type: 'Payment' },
  { id: 8, title: 'Review upcoming payments', meta: 'Check deposits, supplier invoices and balances coming due', person: 'tj', group: 'Waiting', type: 'Finance' },
];

const seedCustomers = [
  { id: 1, name: 'Demo Customer One', location: 'Toronto', stage: 'Assessment Complete', owner: 'tj', equipment: 'Full home heat pump', next: 'Office to draft proposal', quoteRequested: true, value: null },
  { id: 2, name: 'Demo Customer Two', location: 'Kawartha Lakes', stage: 'Appointment Booked', owner: 'max', equipment: 'Electric baseboard', next: 'Confirm appointment', quoteRequested: false, value: null },
  { id: 3, name: 'Demo Customer Three', location: 'Brampton', stage: 'New Lead', owner: 'tj', equipment: 'Heat pump + attic insulation', next: 'Review retrofit scope', quoteRequested: false, value: null },
];

const pipelineStages = ['New Lead', 'Appointment Booked', 'Assessment Complete', 'Quote Sent', 'Follow-Up', 'Scheduled', 'Completed', 'Closed Won'];

const starterLinks = [
  'EAP Application',
  'OESP Application',
  'HRS+ Program Application',
  'Peterborough Grant Links',
  'Toronto HELP Loan',
  'Brampton Home Retrofit Loan',
];

const cockpitModules = [
  { name: 'HubSpot', purpose: 'One-way CRM sync', tone: 'indigo', status: 'Ready to connect' },
  { name: 'Gmail', purpose: 'Email and follow-ups', tone: 'cyan', status: 'Ready to connect' },
  { name: 'Google Drive', purpose: 'Customer files and templates', tone: 'mint', status: 'Ready to connect' },
  { name: 'Google Calendar', purpose: 'Appointments and reminders', tone: 'gold', status: 'Ready to connect' },
  { name: 'QuickBooks', purpose: 'Invoices and payment links', tone: 'mint', status: 'Planned connection' },
  { name: 'Financeit', purpose: 'Financing calculator and applications', tone: 'indigo', status: 'API setup required' },
  { name: 'Vista', purpose: 'Financing request workflow', tone: 'cyan', status: 'Pricing required' },
  { name: 'Innogreen Assistant', purpose: 'Draft, organize and delegate', tone: 'gold', status: 'Workspace module' },
];

function Avatar({ personId, small = false }) {
  const person = people.find((item) => item.id === personId) || people[0];
  return <span className={`avatar ${person.tone} ${small ? 'small' : ''}`} title={person.name}>{person.initials}</span>;
}

function App() {
  const [active, setActive] = useState('Command Center');
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('igs-customers') || 'null') || seedCustomers);
  const [selected, setSelected] = useState(customers[0]);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('igs-tasks') || 'null') || seedTasks);
  const [showTask, setShowTask] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [closeCustomer, setCloseCustomer] = useState(null);
  const [scheduleCustomer, setScheduleCustomer] = useState(null);
  const [voiceText, setVoiceText] = useState('');
  const [message, setMessage] = useState('Your operating system is ready. Pick the next move.');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia?.('(display-mode: standalone)').matches || false);

  useEffect(() => localStorage.setItem('igs-customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('igs-tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => {
    const captureInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const markInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', captureInstall);
    window.addEventListener('appinstalled', markInstalled);
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js');
    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstall);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const installDesktopApp = async () => {
    if (!installPrompt) {
      setMessage(installed ? 'Innogreen OS is already installed.' : 'Use Chrome or Edge and choose Install Innogreen OS from the browser menu.');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setMessage(choice.outcome === 'accepted' ? 'Innogreen OS is installing as a desktop app.' : 'Desktop installation was cancelled.');
    setInstallPrompt(null);
  };

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

  const updateCustomer = (id, patch) => {
    setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, ...patch } : customer));
    setSelected((current) => current?.id === id ? { ...current, ...patch } : current);
  };

  const moveCustomer = (customer, nextStage) => {
    if (nextStage === 'Closed Won') return setCloseCustomer(customer);
    if (nextStage === 'Scheduled') return setScheduleCustomer(customer);
    updateCustomer(customer.id, { stage: nextStage });
    setMessage(`${customer.name} moved to ${nextStage}.`);
  };

  const saveClosedSale = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    if (!amount) return;
    updateCustomer(closeCustomer.id, { stage: 'Closed Won', value: amount });
    setTasks((current) => [{ id: Date.now(), title: `Start job setup for ${closeCustomer.name}`, meta: `$${amount.toLocaleString()} sale logged · confirm deposit and installation plan`, person: 'tj', group: 'Now', type: 'New sale' }, ...current]);
    setCloseCustomer(null);
    setMessage(`Closed sale logged for $${amount.toLocaleString()}. Job setup task created.`);
  };

  const saveSchedule = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const contractor = String(form.get('contractor') || 'Not selected');
    const equipment = String(form.get('equipment') || 'Not ordered');
    updateCustomer(scheduleCustomer.id, { stage: 'Scheduled', contractor, equipmentStatus: equipment });
    setTasks((current) => [
      { id: Date.now(), title: `Confirm contractor for ${scheduleCustomer.name}`, meta: contractor, person: 'tj', group: 'Now', type: 'Contractor' },
      { id: Date.now() + 1, title: `Order equipment for ${scheduleCustomer.name}`, meta: equipment, person: 'tj', group: 'Now', type: 'Equipment' },
      ...current,
    ]);
    setScheduleCustomer(null);
    setMessage(`${scheduleCustomer.name} scheduled. Contractor and equipment tasks created.`);
  };

  const grouped = useMemo(() => ['Now', 'Today', 'Waiting'].map((group) => ({ group, items: tasks.filter((task) => task.group === group) })), [tasks]);
  const nav = ['Command Center', 'Cockpit & Integrations', 'Customers', 'Leads', 'Calendar & Dispatch', 'Jobs', 'Contractors', 'Price Reference', 'Tasks & Projects', 'Documents & Templates', 'Useful Links', 'Team & Access', 'Inbox'];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◈</span><div><strong>INNOGREEN</strong><small>OPERATING SYSTEM</small></div></div>
        <nav>{nav.map((item) => <button key={item} className={active === item ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(item); setMessage(`${item} is ready in the central workboard.`); }}><span className="nav-dot" />{item}</button>)}</nav>
        <div className="sidebar-bottom">
          <a className="quote-launcher" href="https://www.innogreensolutions.com/quotations" target="_blank" rel="noreferrer"><span>＋</span><div><strong>Quotation Maker</strong><small>Open Innogreen quotations</small></div></a>
          <span className="eyebrow gold">OWNER ONLY</span>
          <strong>Finance & cash view</strong>
          <small>QuickBooks connection comes here.</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow mint">HOMEBASE</span><h1>{active === 'Command Center' ? 'Good evening, TJ.' : active}</h1><p>{message}</p></div>
          <div className="top-actions"><button className="ghost" onClick={installDesktopApp}>{installed ? '✓ Desktop app' : '⇩ Install app'}</button><button className="ghost" onClick={() => setShowVoice(true)}>◉ Voice memo</button><button className="primary" onClick={() => setShowTask(true)}>+ Add task</button></div>
        </header>

        {active === 'Command Center' ? <>
          <section className="action-row">
            <button onClick={() => setActive('Leads')}><b>+ Assign lead</b><span>Import, route and send to an agent</span></button>
            <button onClick={() => setActive('Customers')}><b>⌕ Find a customer</b><span>Every email, job, document and payment</span></button>
            <button onClick={() => setShowVoice(true)}><b>◉ Drop a memo</b><span>Speak it. It becomes a usable note.</span></button>
            <button onClick={() => setActive('Documents & Templates')}><b>▣ Documents hub</b><span>Forms agents can open, fill and submit</span></button>
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
        </> : <Workboard active={active} selected={selected} openWork={openWork} setSelected={setSelected} customers={customers} tasks={tasks} moveCustomer={moveCustomer} updateCustomer={updateCustomer} />}
      </main>

      {showTask && <Modal title="Create a task" close={() => setShowTask(false)}><form onSubmit={addTask}><label>What needs to happen?<input autoFocus name="title" placeholder="Example: Call Rinkee after quote review" /></label><label>Assign to<select name="person">{people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select></label><button className="primary wide" type="submit">Create task</button></form></Modal>}
      {showVoice && <Modal title="Drop a voice memo" close={() => setShowVoice(false)}><p className="modal-copy">In the live mobile app this records audio, transcribes it and connects it to the right customer or job. For this foundation, paste the spoken note below to test the workflow.</p><textarea autoFocus value={voiceText} onChange={(event) => setVoiceText(event.target.value)} placeholder="Example: Alex wants the financing options emailed Friday. Call after 6." /><button className="primary wide" onClick={saveVoice}>Save transcript and create review task</button></Modal>}
      {closeCustomer && <Modal title={`Close ${closeCustomer.name} as won`} close={() => setCloseCustomer(null)}><form onSubmit={saveClosedSale}><p className="modal-copy">Enter the final contract amount. The dashboard will log the sale and create the first job setup task.</p><label>Final dollar amount<input autoFocus name="amount" type="number" min="1" step="0.01" placeholder="Example: 6497.50" /></label><button className="primary wide" type="submit">Log sale and create job</button></form></Modal>}
      {scheduleCustomer && <Modal title={`Schedule ${scheduleCustomer.name}`} close={() => setScheduleCustomer(null)}><form onSubmit={saveSchedule}><p className="modal-copy">Scheduling automatically starts the contractor and equipment workflow.</p><label>Contractor<select name="contractor"><option>Find contractor</option><option>High Efficiency Cooling & Heating</option><option>Internal installation team</option></select></label><label>Equipment status<select name="equipment"><option>Equipment needs ordering</option><option>Quote requested from supplier</option><option>Equipment ordered</option><option>Pickup confirmed</option></select></label><button className="primary wide" type="submit">Schedule and create tasks</button></form></Modal>}
    </div>
  );
}

function Metric({ label, value, trend, tone }) { return <div className="metric"><span className={`metric-strip ${tone}`} /><span className="eyebrow">{label}</span><b>{value}</b><small>{trend}</small></div>; }
function PanelHead({ title, subtitle, action }) { return <div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="text-button">{action} →</button>}</div>; }
function Task({ task, onOpen }) { return <button className="task" onClick={onOpen}><span className="task-check">✓</span><span className="task-copy"><b>{task.title}</b><small>{task.meta}</small></span><Avatar personId={task.person} small /><span className="task-type">{task.type}</span></button>; }
function Modal({ title, close, children }) { return <div className="modal-backdrop" onMouseDown={close}><section className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><h2>{title}</h2>{children}</section></div>; }

function Workboard({ active, selected, openWork, setSelected, customers, tasks, moveCustomer, updateCustomer }) {
  if (active === 'Cockpit & Integrations') return <section className="workboard"><PanelHead title="Cockpit & Integrations" subtitle="Choose the systems that belong in your operating cockpit. Connections stay owner-controlled." /><div className="cockpit-grid">{cockpitModules.map((module) => <article className="cockpit-module" key={module.name}><span className={`module-light ${module.tone}`} /><div><h2>{module.name}</h2><p>{module.purpose}</p></div><small>{module.status}</small><button className="ghost">Configure</button></article>)}</div><div className="integration-callout"><div><span className="eyebrow mint">MODULAR BY DESIGN</span><h2>Add tools without rebuilding the dashboard</h2><p>Each connector gets its own permission scope, health status and owner-controlled access. Agent roles receive only the actions you approve.</p></div><button className="primary">+ Add integration</button></div></section>;
  if (active === 'Customers') return <section className="workboard pipeline-board"><PanelHead title="Customer pipeline" subtitle="Move customer cards from left to right. Quote requested stays a simple checkbox." /><div className="kanban">{pipelineStages.map((stage, stageIndex) => <div className="kanban-column" key={stage}><div className="kanban-heading"><span>{stage}</span><b>{customers.filter((customer) => customer.stage === stage).length}</b></div>{customers.filter((customer) => customer.stage === stage).map((customer) => <article className="customer-card" key={customer.id}><button className="customer-card-main" onClick={() => openWork(customer)}><span className="customer-initial">{customer.name.split(' ').map((part) => part[0]).join('')}</span><span><b>{customer.name}</b><small>{customer.location}</small><small>{customer.equipment}</small></span></button><label className="quote-check"><input type="checkbox" checked={customer.quoteRequested} onChange={(event) => updateCustomer(customer.id, { quoteRequested: event.target.checked })} /> Quote requested</label>{customer.value && <strong className="sale-value">${customer.value.toLocaleString()}</strong>}<div className="card-moves">{stageIndex > 0 && <button onClick={() => moveCustomer(customer, pipelineStages[stageIndex - 1])}>←</button>}{stageIndex < pipelineStages.length - 1 && <button onClick={() => moveCustomer(customer, pipelineStages[stageIndex + 1])}>Move forward →</button>}</div></article>)}</div>)}</div></section>;
  if (active === 'Leads') return <section className="workboard"><PanelHead title="Leads" subtitle="New opportunities waiting to be assigned or opened as a customer." /><div className="customer-list">{customers.filter((customer) => customer.stage === 'New Lead').map((customer) => <button key={customer.id} className="customer-row" onClick={() => openWork(customer)}><span className="customer-initial">{customer.name.split(' ').map((part) => part[0]).join('')}</span><span><b>{customer.name}</b><small>{customer.location} · {customer.equipment}</small></span><span className="status">{customer.stage}</span><Avatar personId={customer.owner} small /></button>)}</div></section>;
  if (active === 'Workboard') return <section className="workboard detail"><div className="work-title"><div><span className="eyebrow mint">CUSTOMER WORKBOARD</span><h2>{selected.name}</h2><p>{selected.location} · {selected.equipment}</p></div><div><button className="ghost">Call</button><button className="ghost">Email</button><button className="primary">Create job</button></div></div><div className="work-grid"><div className="panel"><PanelHead title="Next action" subtitle={selected.next} /><div className="checklist"><span>✓ Customer details confirmed</span><span>○ Quote preparation</span><span>○ Deposit request</span><span>○ Contractor assignment</span></div></div><div className="panel"><PanelHead title="Office actions" /><button className="wide ghost">Request quote from office</button><button className="wide ghost">Request deposit payment link</button><button className="wide ghost">Open documents</button></div></div></section>;
  if (active === 'Tasks & Projects') return <section className="workboard"><PanelHead title="TJ’s Work Hub" subtitle="Your personal operating queue for tasks, reminders and scheduled office work." /><div className="task-center"><div><span className="eyebrow gold">HIGH PRIORITY</span>{tasks.filter((task) => task.group === 'Now').map((task) => <Task key={task.id} task={task} onOpen={() => {}} />)}</div><div><span className="eyebrow mint">TODAY</span>{tasks.filter((task) => task.group === 'Today').map((task) => <Task key={task.id} task={task} onOpen={() => {}} />)}</div><div><span className="eyebrow">SCHEDULED & RECURRING</span>{tasks.filter((task) => task.group === 'Waiting').map((task) => <Task key={task.id} task={task} onOpen={() => {}} />)}</div></div></section>;
  if (active === 'Documents & Templates') return <section className="workboard"><PanelHead title="Documents & Templates" subtitle="Approved business tools that agents can open, fill, submit or email without changing the master." /><div className="document-section"><span className="eyebrow mint">COMMUNICATION</span><div className="document-grid">{['Customer follow-up email templates', 'Quote cover emails', 'Appointment confirmations'].map((name) => <button className="document" key={name}><span>✉</span><b>{name}</b><small>Open template library</small></button>)}</div></div><div className="document-section"><span className="eyebrow mint">PROGRAM QUESTIONNAIRES</span><div className="document-grid">{['EAP homeowner questionnaire', 'OESP application checklist', 'HRS+ qualification questionnaire'].map((name) => <button className="document" key={name}><span>✓</span><b>{name}</b><small>Fill for customer</small></button>)}</div></div><div className="document-section"><span className="eyebrow mint">SOPS & FIELD DOCUMENTS</span><div className="document-grid">{['Sales visit SOP', 'Installation preparation SOP', 'Mandatory field checklist'].map((name) => <button className="document" key={name}><span>▣</span><b>{name}</b><small>Approved version</small></button>)}</div></div></section>;
  if (active === 'Price Reference') return <section className="workboard"><PanelHead title="Price Reference" subtitle="Owner-only reference pricing. These are not fixed customer prices or agent-visible margins." /><div className="integration-callout"><div><span className="eyebrow gold">REFERENCE ONLY</span><h2>Your current sheet represents roughly a 20% base return</h2><p>Actual quotations may be higher based on project conditions, labour, risk, financing, materials and required margin. Nothing here automatically prices a customer job.</p></div><button className="primary">Add reference item</button></div><div className="empty-board compact"><span>＋</span><h2>No reference items added yet.</h2><p>Open this section when you are ready to review the current sheet and build the editable reference.</p></div></section>;
  if (active === 'Useful Links') return <section className="workboard"><PanelHead title="Useful Links" subtitle="Fast access for the office and agents. You can rename every link and add the final URLs later." /><div className="links-grid">{starterLinks.map((name) => <article className="useful-link" key={name}><span>↗</span><div><b>{name}</b><small>URL not added yet</small></div><button className="ghost">Add URL</button></article>)}</div></section>;
  if (active === 'Team & Access') return <section className="workboard"><PanelHead title="Team & access" subtitle="Private workspaces that keep every agent focused on their own customers and jobs." /><div className="team-access-grid">{people.map((person) => <article className="access-card" key={person.id}><Avatar personId={person.id} /><div><b>{person.name}</b><small>{person.role}</small><em>{agentProfiles[person.id] ? 'Mobile workspace ready to preview' : 'Role-ready profile'}</em></div>{agentProfiles[person.id] ? <a className="ghost app-preview-link" href={`/agent/${person.id}?preview=1`} target="_blank" rel="noreferrer">Preview app</a> : <button className="ghost">Set access</button>}</article>)}</div><div className="integration-callout"><div><span className="eyebrow mint">SECURE ACTIVATION</span><h2>Add each person’s email before sending their private login link</h2><p>The mobile workspaces are built. Production sign-in and cross-device syncing require the authentication backend to be connected first. Financial data remains office-only.</p></div><button className="primary">Invite team member</button></div></section>;
  return <section className="workboard"><PanelHead title={active} subtitle="This central space becomes the active tool, not another dashboard to manage." /><div className="empty-board"><span>✦</span><h2>{active} is ready for its live connection.</h2><p>Use the left navigation to move through the system. Every area opens here.</p></div></section>;
}

function AgentPortal({ profile, preview }) {
  const isPartner = profile.mode === 'partner';
  const tabs = isPartner ? ['Home', 'My Leads', 'Learning', 'Research', 'Coaching'] : ['Home', 'My Leads', 'Tasks', 'Office', 'Library'];
  const [active, setActive] = useState('Home');
  const [showLead, setShowLead] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestType, setRequestType] = useState(isPartner ? 'Coaching request' : 'Office request');
  const storageKey = `igs-agent-leads-${profile.id}`;
  const [leads, setLeads] = useState(() => JSON.parse(localStorage.getItem(storageKey) || 'null') || []);
  const [updates, setUpdates] = useState([]);
  const [toast, setToast] = useState(preview ? 'Owner preview mode. No private account has been activated.' : '');

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(leads)), [leads, storageKey]);

  const createLead = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lead = { id: Date.now(), name: form.get('name'), city: form.get('city'), project: form.get('project'), phone: form.get('phone'), stage: 'New' };
    setLeads((current) => [lead, ...current]);
    setShowLead(false);
    setToast(`${lead.name} was added to your private lead list and queued for Homebase sync.`);
  };

  const createRequest = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const note = String(form.get('note') || '').trim();
    if (!note) return;
    setUpdates((current) => [{ id: Date.now(), type: requestType, note, status: 'Sent to office' }, ...current]);
    setShowRequest(false);
    setToast(`${requestType} was added to your shared workspace.`);
  };

  if (!preview) return <AgentLogin profile={profile} />;

  return <div className="agent-shell">
    <header className="agent-header"><div><span className="agent-logo">◈</span><span><b>INNOGREEN</b><small>PRIVATE AGENT WORKSPACE</small></span></div><span className="agent-avatar">{profile.initials}</span></header>
    <main className="agent-main">
      <section className="agent-welcome"><div><span className="eyebrow mint">{isPartner ? 'INDEPENDENT SALES PARTNER' : 'FIELD SALES'}</span><h1>Welcome, {profile.name}.</h1><p>{isPartner ? 'Learn the play, build your pipeline and keep every conversation moving.' : 'Your customers, tasks and office requests are in one place.'}</p></div><button className="agent-voice" onClick={() => { setRequestType('Voice update'); setShowRequest(true); }}>◉ Voice update</button></section>
      {toast && <button className="agent-toast" onClick={() => setToast('')}>{toast}<span>×</span></button>}
      {active === 'Home' && <AgentHome profile={profile} isPartner={isPartner} leads={leads} setActive={setActive} openLead={() => setShowLead(true)} openRequest={(type) => { setRequestType(type); setShowRequest(true); }} updates={updates} />}
      {active === 'My Leads' && <section className="agent-page"><AgentPageHead title="My leads" copy="Only leads assigned to you or created by you appear here." action="+ Add lead" onAction={() => setShowLead(true)} />{leads.length ? <div className="mobile-card-list">{leads.map((lead) => <article className="mobile-lead-card" key={lead.id}><div><b>{lead.name}</b><small>{lead.city} · {lead.project}</small></div><span>{lead.stage}</span><div className="mobile-card-actions"><a href={`tel:${lead.phone}`}>Call</a><button onClick={() => setToast(`${lead.name} opened for an update.`)}>Update</button><button onClick={() => { setRequestType(`Price request for ${lead.name}`); setShowRequest(true); }}>Request price</button></div></article>)}</div> : <EmptyAgentState icon="＋" title="No leads yet" copy="Add your first lead. It stays private to you and the office." action="Add lead" onAction={() => setShowLead(true)} />}</section>}
      {active === 'Learning' && <LearningHub />}
      {active === 'Research' && <ResearchHub updates={updates} openRequest={() => { setRequestType('Research note'); setShowRequest(true); }} />}
      {active === 'Coaching' && <CoachingHub openRequest={() => { setRequestType('Coaching request'); setShowRequest(true); }} />}
      {active === 'Tasks' && <FieldTasks profile={profile} />}
      {active === 'Office' && <OfficeRequests updates={updates} openRequest={(type) => { setRequestType(type); setShowRequest(true); }} />}
      {active === 'Library' && <AgentLibrary />}
    </main>
    <nav className="agent-bottom-nav">{tabs.map((tab) => <button className={active === tab ? 'active' : ''} key={tab} onClick={() => setActive(tab)}><span>{tab === 'Home' ? '⌂' : tab === 'My Leads' ? '◎' : tab === 'Learning' || tab === 'Library' ? '▣' : tab === 'Tasks' ? '✓' : tab === 'Research' ? '◇' : '↗'}</span>{tab.replace('My ', '')}</button>)}</nav>
    {showLead && <Modal title="Add my lead" close={() => setShowLead(false)}><form onSubmit={createLead}><label>Customer name<input autoFocus required name="name" /></label><label>Phone<input required name="phone" type="tel" /></label><label>City or area<input required name="city" /></label><label>Project<select name="project"><option>Heat pump</option><option>Furnace</option><option>Air conditioner</option><option>Hot water</option><option>Commercial HVAC</option><option>Energy program</option><option>Other</option></select></label><button className="primary wide">Add to my pipeline</button></form></Modal>}
    {showRequest && <Modal title={requestType} close={() => setShowRequest(false)}><form onSubmit={createRequest}><p className="modal-copy">This will be visible to the office with your name, time and current status.</p><label>Details<textarea autoFocus required name="note" placeholder="Speak or type what you need, what happened and the next step." /></label><button className="primary wide">Send to shared workspace</button></form></Modal>}
  </div>;
}

function AgentLogin({ profile }) {
  return <div className="agent-login"><section><div className="login-mark">◈</div><span className="eyebrow mint">INNOGREEN PRIVATE ACCESS</span><h1>{profile.name}’s workspace</h1><p>Your customers, training, requests and notes are private between you and the office.</p><form onSubmit={(event) => event.preventDefault()}><label>Email address<input type="email" autoComplete="username" placeholder="Your invited email" /></label><label>Password<input type="password" autoComplete="current-password" placeholder="Your password" /></label><button className="primary wide" type="button" disabled>Secure sign-in activates with account setup</button></form><small>Private system. Access is restricted by role and requires an invitation from the owner.</small></section></div>;
}

function AgentHome({ profile, isPartner, leads, setActive, openLead, openRequest, updates }) {
  return <>
    <section className="agent-kpis"><article><span>My leads</span><b>{leads.length}</b><small>Private pipeline</small></article><article><span>{isPartner ? 'Lessons' : 'Open tasks'}</span><b>{isPartner ? '6' : '4'}</b><small>{isPartner ? '2 new this week' : '2 due today'}</small></article><article><span>Office replies</span><b>{updates.filter((item) => item.status === 'Sent to office').length}</b><small>Waiting for review</small></article></section>
    <section className="agent-quick-grid"><button onClick={openLead}><span>＋</span><b>Add my lead</b><small>Create and track it privately</small></button>{isPartner ? <><button onClick={() => setActive('Learning')}><span>▣</span><b>Continue training</b><small>Programs, phone closes and commercial plays</small></button><button onClick={() => setActive('Research')}><span>◇</span><b>Share research</b><small>Build knowledge with TJ</small></button><button onClick={() => openRequest('Coaching request')}><span>↗</span><b>Request time</b><small>Ask TJ for coaching or deal help</small></button></> : <><button onClick={() => openRequest('Office request')}><span>↗</span><b>Request office</b><small>Quotes, documents and customer support</small></button><button onClick={() => openRequest('Price request')}><span>$</span><b>Request price</b><small>Send scope and equipment details</small></button><button onClick={() => openRequest('Idea share')}><span>◇</span><b>Share an idea</b><small>Send it to the owner dashboard</small></button></>}</section>
    {isPartner ? <section className="agent-feature-grid"><article className="learning-feature"><span className="eyebrow mint">NEXT LESSON</span><h2>Closing Ontario energy-program leads by phone</h2><p>Qualify the situation, identify the customer’s real motivation and earn the next conversation.</p><button onClick={() => setActive('Learning')}>Open learning path →</button></article><article className="commercial-play"><span className="eyebrow gold">COMMERCIAL PLAY</span><h2>Turn equipment problems into a business case</h2><p>Lead with operating cost, downtime, incentives and a clear decision path.</p><button onClick={() => setActive('Learning')}>Review commercial close →</button></article></section> : <section className="agent-day"><AgentPageHead title="Today" copy="The next actions that keep your customers moving." /><div className="agent-task"><span>1</span><div><b>Review assigned appointments</b><small>Confirm time, route and customer notes</small></div></div><div className="agent-task"><span>2</span><div><b>Complete customer updates</b><small>Voice note after every visit or call</small></div></div><div className="agent-task"><span>3</span><div><b>Send office requests</b><small>Quotes, prices and documents before leaving the file</small></div></div></section>}
  </>;
}

function AgentPageHead({ title, copy, action, onAction }) { return <div className="agent-page-head"><div><h2>{title}</h2><p>{copy}</p></div>{action && <button onClick={onAction}>{action}</button>}</div>; }
function EmptyAgentState({ icon, title, copy, action, onAction }) { return <div className="agent-empty"><span>{icon}</span><h2>{title}</h2><p>{copy}</p><button className="primary" onClick={onAction}>{action}</button></div>; }
function LearningHub() { return <section className="agent-page"><AgentPageHead title="Sales learning hub" copy="Practical plays you can use on a live call, organized by outcome." /><div className="learning-list">{[['Start here','Innogreen offer, customer promise and how we work'],['Programs & rebates','EAP, OESP, HRS+, municipal loans and qualification language'],['Phone closing','Open, discover, explain value, handle objections and secure next steps'],['Commercial clients','Decision makers, operating cost, incentives, scopes and proposal strategy'],['Follow-up system','What to send, when to call and how to keep momentum'],['Call review','Upload notes, request feedback and improve the next conversation']].map(([tag,title], index) => <button key={title}><span>{String(index + 1).padStart(2,'0')}</span><div><small>{tag}</small><b>{title}</b></div><em>Open →</em></button>)}</div></section>; }
function ResearchHub({ updates, openRequest }) { return <section className="agent-page"><AgentPageHead title="Shared research" copy="Capture programs, competitors, customer insights and useful market information with TJ." action="+ Share finding" onAction={openRequest} /><div className="research-board"><article><span className="eyebrow mint">PROGRAM WATCH</span><h2>Ontario incentives and local financing</h2><p>Track updates that affect customer eligibility, savings or urgency.</p></article><article><span className="eyebrow gold">FIELD INTELLIGENCE</span><h2>Objections and winning language</h2><p>Save what customers are asking and what successfully moved the call forward.</p></article>{updates.filter((item) => item.type === 'Research note').map((item) => <article key={item.id}><span className="eyebrow">SHARED BY AUN</span><h2>{item.note}</h2><p>{item.status}</p></article>)}</div></section>; }
function CoachingHub({ openRequest }) { return <section className="agent-page"><AgentPageHead title="Coaching with TJ" copy="Bring a live opportunity, call challenge or commercial strategy question." action="Request time" onAction={openRequest} /><div className="coaching-card"><span>30</span><div><h2>Deal clinic</h2><p>Request a focused 30-minute session. Include the customer, opportunity, blocker and outcome you want.</p></div></div><div className="coaching-card"><span>☎</span><div><h2>Call review</h2><p>Share your call notes or transcript and ask for direct feedback on the next close.</p></div></div></section>; }
function FieldTasks({ profile }) { return <section className="agent-page"><AgentPageHead title={`${profile.name}’s tasks`} copy="A short list of actions, ordered by what matters next." />{[['Now','Confirm today’s customer times'],['Today','Update every lead you contacted'],['Today','Submit voice note after the last appointment'],['Waiting','Office response on pricing request']].map(([group,title], index) => <div className="agent-task" key={title}><span>{index + 1}</span><div><small>{group}</small><b>{title}</b></div><button>Done</button></div>)}</section>; }
function OfficeRequests({ updates, openRequest }) { return <section className="agent-page"><AgentPageHead title="Office requests" copy="Ask once, attach the customer context and track the response." /><div className="office-action-grid">{['Request quote','Request price','Request document','Request customer follow-up','Share idea','Report urgent issue'].map((type) => <button key={type} onClick={() => openRequest(type)}><span>↗</span>{type}</button>)}</div><div className="request-list">{updates.length ? updates.map((item) => <article key={item.id}><div><b>{item.type}</b><small>{item.note}</small></div><span>{item.status}</span></article>) : <p>No requests sent yet.</p>}</div></section>; }
function AgentLibrary() { return <section className="agent-page"><AgentPageHead title="Agent library" copy="Approved documents, questionnaires, SOPs and useful links." /><div className="library-groups"><article><span>▣</span><h2>Customer forms</h2><p>Intake, field checklist and quote request brief.</p></article><article><span>✓</span><h2>Program questionnaires</h2><p>EAP, OESP and HRS+ qualification guides.</p></article><article><span>◎</span><h2>Sales guides</h2><p>Visit flow, objection handling and follow-up.</p></article><article><span>↗</span><h2>Useful links</h2><p>Program applications, grants and financing portals.</p></article></div></section>; }

function OwnerLogin() {
  return <div className="agent-login"><section><div className="login-mark">◈</div><span className="eyebrow mint">INNOGREEN SECURE WORKSPACE</span><h1>Homebase is private.</h1><p>Customer records, pricing, files, tasks and financial information are available only after verified sign-in.</p><form onSubmit={(event) => event.preventDefault()}><label>Email address<input type="email" autoComplete="username" placeholder="Your invited email" /></label><label>Password<input type="password" autoComplete="current-password" placeholder="Your password" /></label><button className="primary wide" type="button" disabled>Secure sign-in activates with account setup</button></form><small>Private system. Access is logged and restricted by role. Contact the owner if you need an invitation.</small></section></div>;
}

const routeMatch = window.location.pathname.match(/^\/agent\/(max|hassan|aun)\/?$/);
const routeProfile = routeMatch ? agentProfiles[routeMatch[1]] : null;
const localPreview = import.meta.env.DEV;
createRoot(document.getElementById('root')).render(
  routeProfile
    ? <AgentPortal profile={routeProfile} preview={localPreview} />
    : localPreview
      ? <App />
      : <OwnerLogin />
);
