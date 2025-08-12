import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Archive,
  User,
  CheckCircle2,
  X,
  Bell,
  UserCircle2,
  MessageSquare,
  MessagesSquare,
  Mail as MailIcon,
  Send,
  Clock,
  Wand2,
  Link as LinkIcon,
  Settings,
  FileText,
  Check,
} from "lucide-react";

/***********************************
 * Growth • V1 — Plataforma de Leads
 * Navegação: Dashboard, Leads, Landing Pages, Campanhas (Mensagens), Templates, Integrações, Estúdio IA (futuro)
 * Visual: minimal, claro, Cariri azul #4169E1
 ***********************************/

// =============================
// THEME — CaririCode (de olho) • minimal e claro
const BRAND = {
  50: "#F5F8FF",
  100: "#E9EFFF",
  200: "#DCE6FF",
  500: "#4169E1",
  600: "#3657C9",
  700: "#2B46A8",
};

function BrandStyles() {
  return (
    <style>{`
      :root {
        --brand-50: ${BRAND[50]};
        --brand-100: ${BRAND[100]};
        --brand-200: ${BRAND[200]};
        --brand-500: ${BRAND[500]};
        --brand-600: ${BRAND[600]};
        --brand-700: ${BRAND[700]};
        --radius: 14px;
        --stroke: 1px;
        --line: #E6EAF2;        /* cinza claro padrão */
        --line-strong: #D9DFEA; /* separadores principais */
      }
      .bg-brand-50{background:var(--brand-50)}
      .bg-brand-500{background:var(--brand-500)}
      .bg-brand-600{background:var(--brand-600)}
      .text-brand-600{color:var(--brand-600)}
      .text-brand-500{color:var(--brand-500)}
      .rounded-px{border-radius:var(--radius)}
      .stroke-15{border-width:var(--stroke)}
      .shadow-soft{box-shadow:0 1px 1px rgba(16,24,40,.04), 0 6px 18px rgba(16,24,40,.05)}
      .border{border-color:var(--line)!important; border-width:var(--stroke)!important}
      .border-b{border-bottom-color:var(--line)!important; border-bottom-width:var(--stroke)!important}
      .border-t{border-top-color:var(--line)!important; border-top-width:var(--stroke)!important}
      .border-l{border-left-color:var(--line)!important; border-left-width:var(--stroke)!important}
      .border-r{border-right-color:var(--line)!important; border-right-width:var(--stroke)!important}
      .section-divider{border-color:var(--line-strong)!important}
    `}</style>
  );
}

// =============================
// Tipos básicos
 type LeadStatus = "Novo" | "Em andamento" | "Arquivado";
 type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  owner: string;
  lastActivity: string;
};

// Mock de dados
const MOCK_LEADS: Lead[] = [
  { id: 1, name: "Anael Jonas", email: "anaeljonas@outlook.com", phone: "(88) 99814-7102", status: "Novo", source: "Capturador 123", owner: "Lu Vieira", lastActivity: "há 1h" },
  { id: 2, name: "Bruna Carvalho", email: "bruna@empresa.com", phone: "(11) 93311-0000", status: "Em andamento", source: "Landing Page", owner: "Diego", lastActivity: "há 3d" },
  { id: 3, name: "Carlos Lima", email: "carlos.lima@dominio.com", phone: "(21) 98877-3322", status: "Arquivado", source: "Capturador 123", owner: "Melissa", lastActivity: "há 12d" },
  { id: 4, name: "Daniela Souza", email: "danis@dominio.com", phone: "(31) 98444-1122", status: "Em andamento", source: "Indicação", owner: "Lu Vieira", lastActivity: "há 2d" },
  { id: 5, name: "Eduardo Nunes", email: "edu@exemplo.com", phone: "(19) 99777-5544", status: "Novo", source: "Capturador 123", owner: "Diego", lastActivity: "há 6h" },
];

/******************** COMPONENTES ********************/
function StatusChip({ status }: { status: LeadStatus }) {
  const styles =
    status === "Novo"
      ? "bg-brand-50 text-brand-600"
      : status === "Em andamento"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-zinc-100 text-zinc-700";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${styles}`}>
      {status === "Novo" && <User className="w-3.5 h-3.5" />}
      {status === "Em andamento" && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === "Arquivado" && <Archive className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left font-medium text-zinc-700 p-3 whitespace-nowrap ${className}`}>{children}</th>;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-brand-500 text-white grid place-items-center text-xs font-semibold">
      {initials}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block text-sm">
      <span className="text-zinc-700 mb-1 block">{label}</span>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-px stroke-15 border bg-white focus:outline-none focus:ring-2 focus:ring-brand-50"
        >
          {options.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-px border bg-white p-4 shadow-soft">
      <div className="text-sm text-zinc-600">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-zinc-500 mt-1">{hint}</div>}
    </div>
  );
}

/******************** PÁGINAS ********************/
function PageDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Leads totais" value="2.387" hint="+12% vs mês anterior" />
        <Stat title="Conversão LP" value="4,8%" hint="Landing Pages • 30 dias" />
        <Stat title="Taxa de resposta" value="32%" hint="Mensagens enviadas" />
        <Stat title="Ativos hoje" value="143" hint="com atividade nas últimas 24h" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-px border bg-white p-4 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Atividade recente</h3>
            <button className="text-sm text-brand-500 hover:underline">Ver tudo</button>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-brand-500 mt-2"/><span><b>Bruna Carvalho</b> respondeu uma mensagem • há 2h</span></li>
            <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-zinc-400 mt-2"/><span>Novo lead capturado via <b>Landing Page A/B</b> • há 4h</span></li>
            <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2"/><span>Campanha <b>Boas-vindas WA</b> concluída • Taxa resp. 38%</span></li>
          </ul>
        </div>
        <div className="rounded-px border bg-white p-4 shadow-soft">
          <h3 className="font-semibold mb-3">Ações rápidas</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <QuickAction icon={<Plus className="w-4 h-4"/>} label="Novo lead"/>
            <QuickAction icon={<FileText className="w-4 h-4"/>} label="Nova landing"/>
            <QuickAction icon={<MessagesSquare className="w-4 h-4"/>} label="Nova campanha"/>
            <QuickAction icon={<Wand2 className="w-4 h-4"/>} label="Gerar conteúdo" disabled/>
          </div>
          <p className="text-xs text-zinc-500 mt-3">* Estúdio IA e envio em massa serão habilitados em versões futuras.</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({icon,label,disabled}:{icon:React.ReactNode,label:string,disabled?:boolean}){
  return (
    <button disabled={disabled} className={`flex items-center gap-2 rounded-px border p-2 ${disabled?"opacity-50 cursor-not-allowed":"hover:bg-zinc-50"}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function PageLeads() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<LeadStatus | "Todos">("Todos");
  const [selected, setSelected] = useState<number[]>([]);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ owner: "Todos", source: "Todos", status: "Todos", period: "Últimos 30 dias" });

  // stickies dinâmicos
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState({ page: 0, filters: 0, tabs: 0, stack: 0 });

  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => {
      const page = pageHeaderRef.current?.getBoundingClientRect().height || 0;
      const filtersH = filtersRef.current?.getBoundingClientRect().height || 0;
      const tabsH = tabsRef.current?.getBoundingClientRect().height || 0;
      const stack = page + filtersH + tabsH;
      setHeights({ page, filters: filtersH, tabs: tabsH, stack });
    });
    [pageHeaderRef, filtersRef, tabsRef].forEach((r) => {
      if (r.current) ro.observe(r.current as HTMLElement);
    });
    return () => ro.disconnect();
  }, []);

  const leads = useMemo(() => {
    return MOCK_LEADS.filter((l) =>
      (tab === "Todos" || l.status === tab) &&
      (filters.owner === "Todos" || l.owner === filters.owner) &&
      (filters.source === "Todos" || l.source === filters.source) &&
      (filters.status === "Todos" || l.status === (filters.status as LeadStatus)) &&
      (l.name.toLowerCase().includes(query.toLowerCase()) || l.email.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, tab, filters]);

  const allOwners = Array.from(new Set(MOCK_LEADS.map((l) => l.owner)));
  const allSources = Array.from(new Set(MOCK_LEADS.map((l) => l.source)));

  const toggleSelectAll = (checked: boolean) => setSelected(checked ? leads.map((l) => l.id) : []);
  const toggleRow = (id: number) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="min-h-screen">
      {/* Header da página */}
      <header ref={pageHeaderRef} className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b section-divider">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600">
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 border">2.387 no total</span>
              <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 border">+12% vs mês anterior</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-px stroke-15 border text-zinc-700 hover:bg-zinc-50">
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-px bg-brand-500 text-white hover:bg-brand-600 shadow-soft">
              <Plus className="w-4 h-4" /> Novo lead
            </button>
          </div>
        </div>
      </header>

      {/* Barra de filtros */}
      <div ref={filtersRef} className="sticky z-20 bg-white border-b section-divider" style={{ top: heights.page }}>
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou e-mail (atalho: /)" className="w-full pl-9 pr-3 py-2.5 rounded-px stroke-15 border focus:outline-none focus:ring-2 focus:ring-brand-50" />
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select label="Owner" value={filters.owner} onChange={(v) => setFilters((f) => ({ ...f, owner: v }))} options={["Todos", ...allOwners]} />
            <Select label="Origem" value={filters.source} onChange={(v) => setFilters((f) => ({ ...f, source: v }))} options={["Todos", ...allSources]} />
            <Select label="Status" value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} options={["Todos", "Novo", "Em andamento", "Arquivado"]} />
            <Select label="Período" value={filters.period} onChange={(v) => setFilters((f) => ({ ...f, period: v }))} options={["Hoje", "Últimos 7 dias", "Últimos 30 dias", "Este mês"]} />
          </div>
        </div>
      </div>

      {/* Abas */}
      <div ref={tabsRef} className="sticky z-10 bg-white border-b section-divider" style={{ top: heights.page + heights.filters }}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8 overflow-x-auto py-2">
            {([
              { key: "Todos", count: MOCK_LEADS.length },
              { key: "Novo", count: MOCK_LEADS.filter((l) => l.status === "Novo").length },
              { key: "Em andamento", count: MOCK_LEADS.filter((l) => l.status === "Em andamento").length },
              { key: "Arquivado", count: MOCK_LEADS.filter((l) => l.status === "Arquivado").length },
            ] as { key: LeadStatus | "Todos"; count: number }[]).map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap stroke-15 ${tab === t.key ? "bg-brand-50 text-brand-600" : "bg-white hover:bg-zinc-50"}`}>
                {t.key} <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border">{t.count}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tabela */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative overflow-hidden rounded-px stroke-15 border bg-white shadow-soft">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky bg-white border-b z-10" style={{ top: 0 }}>
                <tr>
                  <th className="w-10 p-3 text-left">
                    <input type="checkbox" checked={selected.length === leads.length && leads.length > 0} onChange={(e) => toggleSelectAll(e.target.checked)} />
                  </th>
                  <Th>Nome</Th>
                  <Th>E-mail</Th>
                  <Th>Telefone</Th>
                  <Th className="text-center">Status</Th>
                  <Th>Origem</Th>
                  <Th>Owner</Th>
                  <Th>Última atividade</Th>
                  <th className="w-10 p-3" />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <tr key={lead.id} className={`border-b hover:bg-zinc-50 ${idx % 2 === 0 ? "bg-white" : "bg-zinc-50/40"}`}>
                    <td className="p-3"><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleRow(lead.id)} /></td>
                    <td className="p-3">
                      <button onClick={() => setDrawerLead(lead)} className="flex items-center gap-3">
                        <Avatar name={lead.name} />
                        <div className="text-left">
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-zinc-500">#{lead.id}</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-3"><a className="hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a></td>
                    <td className="p-3"><a className="hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                    <td className="p-3 text-center"><StatusChip status={lead.status} /></td>
                    <td className="p-3">{lead.source}</td>
                    <td className="p-3">{lead.owner}</td>
                    <td className="p-3 text-zinc-600">{lead.lastActivity}</td>
                    <td className="p-3 relative">
                      <button className="p-2 rounded-lg hover:bg-zinc-50" onClick={() => setMenuOpenId((v) => (v === lead.id ? null : lead.id))}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpenId === lead.id && <RowMenu onClose={() => setMenuOpenId(null)} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <LeadDrawer lead={drawerLead} onClose={() => setDrawerLead(null)} />
    </div>
  );
}

function PageLanding() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Landing Pages</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-px bg-brand-500 text-white hover:bg-brand-600 shadow-soft"><Plus className="w-4 h-4"/> Nova landing</button>
      </div>
      <div className="rounded-px border bg-white p-4 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i)=> (
            <div key={i} className="rounded-px border p-4">
              <div className="flex items-center justify-between mb-2"><div className="font-medium">LP {i}</div><span className="text-xs text-zinc-500">ativo</span></div>
              <div className="text-sm text-zinc-600 flex items-center gap-2"><LinkIcon className="w-4 h-4"/>https://cariricode.growth/lp-{i}</div>
              <div className="mt-3 flex gap-2 text-sm">
                <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50">Editar</button>
                <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50">Duplicar</button>
                <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50">Ver</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageCampaigns() {
  const [step,setStep]=useState(1);
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campanhas (Mensagens)</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-px border hover:bg-zinc-50"><Settings className="w-4 h-4"/> Configurar</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-px bg-brand-500 text-white hover:bg-brand-600 shadow-soft"><Plus className="w-4 h-4"/> Nova campanha</button>
        </div>
      </div>

      {/* Wizard */}
      <div className="rounded-px border bg-white p-4 shadow-soft">
        <div className="flex items-center gap-3 text-sm">
          {[1,2,3,4].map((n)=> (
            <div key={n} className={`flex items-center gap-2 ${step===n?"text-brand-500":"text-zinc-500"}`}>
              <div className={`w-6 h-6 rounded-full grid place-items-center border ${step===n?"bg-brand-50 border-brand-200":"bg-white"}`}>{n}</div>
              <span>{["Segmento","Mensagem","Agendamento","Revisar"][n-1]}</span>
              {n<4 && <div className="w-10 h-px bg-[var(--line)] mx-1"/>}
            </div>
          ))}
        </div>

        <div className="mt-4">
          {step===1 && <CampaignStepSegment/>}
          {step===2 && <CampaignStepMessage/>}
          {step===3 && <CampaignStepSchedule/>}
          {step===4 && <CampaignStepReview/>}
        </div>

        <div className="mt-4 flex justify-between">
          <button disabled={step===1} onClick={()=>setStep(s=>Math.max(1,s-1))} className="px-3 py-2 rounded-px border hover:bg-zinc-50 disabled:opacity-50">Voltar</button>
          <button onClick={()=>setStep(s=>Math.min(4,s+1))} className="px-4 py-2 rounded-px bg-brand-500 text-white hover:bg-brand-600">{step===4?"Concluir (futuro)":"Avançar"}</button>
        </div>
      </div>

      <p className="text-sm text-zinc-500">Envio em massa por WhatsApp e Gmail será habilitado após integrar as contas na seção Integrações.</p>
    </div>
  );
}

function CampaignStepSegment(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2">Alvo</h4>
        <label className="text-sm block mb-2">Lista</label>
        <select className="w-full rounded-px border p-2">
          <option>Todos os leads</option>
          <option>Novos (últimos 7 dias)</option>
          <option>Sem contato (14+ dias)</option>
        </select>
        <div className="mt-3 text-xs text-zinc-500">Você poderá salvar este segmento.</div>
      </div>
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2">Canais</h4>
        <label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox" defaultChecked/> WhatsApp</label>
        <label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox"/> Gmail</label>
        <div className="text-xs text-zinc-500">* Somente para contas integradas.</div>
      </div>
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2">UTM / Tracking</h4>
        <input className="w-full rounded-px border p-2 mb-2" placeholder="utm_campaign"/>
        <input className="w-full rounded-px border p-2" placeholder="utm_content"/>
      </div>
    </div>
  );
}

function CampaignStepMessage(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> WhatsApp</h4>
        <textarea className="w-full rounded-px border p-2 h-40" placeholder="Escreva sua mensagem de WhatsApp..."/>
        <div className="mt-2 flex gap-2 text-sm">
          <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50"><Wand2 className="w-4 h-4"/> Sugerir (IA) *</button>
          <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50"><FileText className="w-4 h-4"/> Inserir variável</button>
        </div>
      </div>
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2"><MailIcon className="w-4 h-4"/> Gmail</h4>
        <input className="w-full rounded-px border p-2 mb-2" placeholder="Assunto"/>
        <textarea className="w-full rounded-px border p-2 h-32" placeholder="Escreva o corpo do e-mail..."/>
      </div>
      <p className="text-xs text-zinc-500 md:col-span-2">* Estúdio IA será liberado futuramente.</p>
    </div>
  );
}

function CampaignStepSchedule(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4"/> Agendamento</h4>
        <label className="text-sm block mb-1">Data</label>
        <input type="date" className="w-full rounded-px border p-2 mb-2"/>
        <label className="text-sm block mb-1">Hora</label>
        <input type="time" className="w-full rounded-px border p-2"/>
      </div>
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2">Velocidade</h4>
        <select className="w-full rounded-px border p-2 mb-2">
          <option>Balanceado</option>
          <option>Lento (seguro)</option>
          <option>Rápido</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Pausar se taxa de bounce subir</label>
      </div>
      <div className="rounded-px border p-4">
        <h4 className="font-semibold mb-2">Testes</h4>
        <label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox"/> Enviar teste para meu número/e-mail</label>
        <button className="px-3 py-1.5 rounded-px border hover:bg-zinc-50"><Send className="w-4 h-4"/> Enviar teste</button>
      </div>
    </div>
  );
}

function CampaignStepReview(){
  return (
    <div className="rounded-px border p-4">
      <h4 className="font-semibold mb-3">Resumo</h4>
      <ul className="text-sm space-y-2">
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600"/> Alvo: Todos os leads</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600"/> Canais: WhatsApp + Gmail</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600"/> Agendamento configurado</li>
      </ul>
      <div className="mt-3 text-xs text-zinc-500">Envio ainda não habilitado nesta versão.</div>
    </div>
  );
}

function PageTemplates(){
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-px bg-brand-500 text-white hover:bg-brand-600 shadow-soft"><Plus className="w-4 h-4"/> Novo template</button>
      </div>
      <div className="rounded-px border bg-white p-4 shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="border-b"><tr><Th>Nome</Th><Th>Canal</Th><Th>Última edição</Th></tr></thead>
          <tbody>
            {[
              {n:"Boas-vindas",c:"WhatsApp",d:"há 3d"},
              {n:"Onboarding",c:"Gmail",d:"há 8d"},
              {n:"Chamada de oferta",c:"WhatsApp",d:"há 16d"},
            ].map((t,i)=> (
              <tr key={i} className="border-b hover:bg-zinc-50"><td className="p-3">{t.n}</td><td className="p-3">{t.c}</td><td className="p-3">{t.d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PageIntegrations(){
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Integrações</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-px border bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2"><h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4"/> WhatsApp</h3><span className="text-xs text-zinc-500">em breve</span></div>
          <p className="text-sm text-zinc-600">Conecte sua conta para enviar mensagens em massa e responder leads.</p>
          <button className="mt-3 px-3 py-2 rounded-px border hover:bg-zinc-50">Conectar</button>
        </div>
        <div className="rounded-px border bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2"><h3 className="font-semibold flex items-center gap-2"><MailIcon className="w-4 h-4"/> Gmail</h3><span className="text-xs text-zinc-500">em breve</span></div>
          <p className="text-sm text-zinc-600">Autorize o envio e acompanhamento de e-mails diretamente pela Growth.</p>
          <button className="mt-3 px-3 py-2 rounded-px border hover:bg-zinc-50">Conectar</button>
        </div>
      </div>
    </div>
  );
}

function PageStudio(){
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="rounded-px border bg-white p-6 shadow-soft text-center">
        <h1 className="text-2xl font-semibold mb-2">Estúdio IA (futuro)</h1>
        <p className="text-zinc-600">Gere copies para campanhas, assuntos de e-mail e mensagens de WhatsApp a partir de um briefing.</p>
        <div className="mt-4 max-w-2xl mx-auto">
          <textarea className="w-full rounded-px border p-3 h-32" placeholder="Descreva seu produto/oferta e o tom desejado..."/>
          <div className="mt-2 flex justify-center"><button className="px-4 py-2 rounded-px border hover:bg-zinc-50"><Wand2 className="w-4 h-4"/> Gerar ideias</button></div>
        </div>
        <p className="text-xs text-zinc-500 mt-4">* recurso será liberado em versões futuras.</p>
      </div>
    </div>
  );
}

/******************** APP ********************/
export default function GrowthV1App() {
  const [view, setView] = useState<
    "dashboard" | "leads" | "landing" | "campaigns" | "templates" | "integrations" | "studio"
  >("dashboard");

  return (
    <div className="min-h-screen bg-white">
      <BrandStyles />
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r bg-white">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-4 border-b">
              <div className="w-8 h-8 rounded-full bg-brand-500" />
              <div className="font-semibold">CaririCode • Growth</div>
            </div>
            <nav className="p-3 text-sm">
              <Section title="Principal" />
              <SideItem active={view==='dashboard'} onClick={()=>setView('dashboard')}>Dashboard</SideItem>
              <SideItem active={view==='leads'} onClick={()=>setView('leads')}>Leads</SideItem>
              <SideItem active={view==='landing'} onClick={()=>setView('landing')}>Landing Pages</SideItem>

              <Section title="Mensagens" />
              <SideItem active={view==='campaigns'} onClick={()=>setView('campaigns')}>Campanhas</SideItem>
              <SideItem active={view==='templates'} onClick={()=>setView('templates')}>Templates</SideItem>

              <Section title="Configurações" />
              <SideItem active={view==='integrations'} onClick={()=>setView('integrations')}>Integrações</SideItem>
              <SideItem active={view==='studio'} onClick={()=>setView('studio')} disabled>Estúdio IA (em breve)</SideItem>
            </nav>
          </div>
        </aside>

        {/* Coluna principal */}
        <div className="bg-[rgb(249,250,251)] min-h-screen">
          {/* App bar */}
          <div className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
            <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500" title="Logo" />
                <span className="font-semibold">Dashboard Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-zinc-50" title="Notificações"><Bell className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg hover:bg-zinc-50" title="Conta"><UserCircle2 className="w-6 h-6" /></button>
              </div>
            </div>
          </div>

          {/* Páginas */}
          {view==='dashboard' && <PageDashboard/>}
          {view==='leads' && <PageLeads/>}
          {view==='landing' && <PageLanding/>}
          {view==='campaigns' && <PageCampaigns/>}
          {view==='templates' && <PageTemplates/>}
          {view==='integrations' && <PageIntegrations/>}
          {view==='studio' && <PageStudio/>}
        </div>
      </div>
    </div>
  );
}

/***************** Auxiliares de Nav *****************/
function Section({ title }: { title: string }) {
  return <div className="px-3 pt-4 pb-2 text-xs uppercase tracking-wide text-zinc-500">{title}</div>;
}

function SideItem({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: ()=>void }) {
  const base = "w-full text-left px-3 py-2 rounded-px mb-1";
  const state = disabled
    ? "text-zinc-400 cursor-not-allowed"
    : active
    ? "bg-brand-50 text-brand-600 border"
    : "hover:bg-zinc-50";
  return <button className={`${base} ${state}`} onClick={onClick}>{children}</button>;
}

// Drawer e menu (reuso do Leads)
function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/15 transition-opacity ${lead ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <aside className={`fixed right-0 top-0 h-screen w-[420px] bg-white shadow-soft border-l transition-transform duration-300 ${lead ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Detalhes do lead</h3>
            {lead && <p className="text-sm text-zinc-500">#{lead.id}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-50"><X className="w-5 h-5" /></button>
        </div>
        {lead ? (
          <div className="p-5 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">{lead.name}</h4>
              <div className="flex items-center gap-2 text-sm text-zinc-600"><Mail className="w-4 h-4" /><a className="hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a></div>
              <div className="flex items-center gap-2 text-sm text-zinc-600"><Phone className="w-4 h-4" /><a className="hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></div>
              <div className="pt-2"><StatusChip status={lead.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-zinc-50 border"><p className="text-zinc-500">Origem</p><p className="font-medium">{lead.source}</p></div>
              <div className="p-3 rounded-xl bg-zinc-50 border"><p className="text-zinc-500">Owner</p><p className="font-medium">{lead.owner}</p></div>
              <div className="p-3 rounded-xl bg-zinc-50 border col-span-2"><p className="text-zinc-500">Última atividade</p><p className="font-medium">{lead.lastActivity}</p></div>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Ações rápidas</h5>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 rounded-xl border hover:bg-zinc-50">Enviar e-mail</button>
                <button className="px-3 py-2 rounded-xl border hover:bg-zinc-50">WhatsApp</button>
                <button className="px-3 py-2 rounded-xl border hover:bg-zinc-50">Mudar status</button>
                <button className="px-3 py-2 rounded-xl border hover:bg-zinc-50">Atribuir</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-zinc-500">Selecione um lead para ver os detalhes.</div>
        )}
      </aside>
    </>
  );
}

function RowMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border bg-white shadow-soft p-1 text-sm">
      {["Abrir","Enviar e-mail","WhatsApp","Marcar em andamento","Arquivar"].map((item) => (
        <button key={item} onClick={onClose} className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50">{item}</button>
      ))}
    </div>
  );
}
