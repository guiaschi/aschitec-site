// src/App.jsx
import { useEffect, useRef, useState } from "react";
import {
  Cpu, ShieldCheck, Wrench, Headphones, ArrowRight, Check, Mail,
  MessageCircle, Github, Linkedin, Calendar, Code2, Copy, ExternalLink,
  Sun, Moon, Star
} from "lucide-react";

// 🔧 Formulário (Formspree)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrbazgvo";
// ✅ Calendly (30min)
const CALENDLY_URL = "https://calendly.com/gui-gomes-aschi/30min";

// Métricas estáveis (fora do componente) para evitar exhaustive-deps
const METRICS = [
  { k: "Projetos entregues", v: 12 },
  { k: "Implantações", v: 40 },
  { k: "Integrações/API", v: 18 },
  { k: "SLA cumprido", v: 99 },
];

export default function App() {
  // ---------- Estados ----------
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [servico, setServico] = useState("Criação de site");
  const [msgWA, setMsgWA] = useState("Olá! Quero solicitar um orçamento.");

  // Tema claro/escuro (persiste)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---------- Utilidades ----------
  function copyEmail() {
    navigator.clipboard.writeText("gui.gomes.aschi@gmail.com");
    setToast("E-mail copiado!");
    setTimeout(() => setToast(""), 2000);
  }
  function scrollTo(el) {
    document.querySelector(el)?.scrollIntoView({ behavior: "smooth" });
  }
  function abrirWhatsApp() {
    const base = "https://wa.me/5551995739787";
    const text = encodeURIComponent(`[${servico}] ${msgWA}`);
    window.open(`${base}?text=${text}`, "_blank", "noopener,noreferrer");
  }
  function getFormVals() {
    const form = document.querySelector('#contato form');
    const name = form?.querySelector('input[name="name"]')?.value || "";
    const email = form?.querySelector('input[name="email"]')?.value || "";
    return { name, email };
  }

  // ---------- Calendly (injeta CSS/JS) ----------
  useEffect(() => {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      try { document.body.removeChild(s); }
      catch (err) { console.debug("Calendly cleanup:", err?.message); }
    };
  }, []);

  function openCalendlyPrefilled() {
    const { name, email } = getFormVals();
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (email) params.set("email", email);
    params.set("a1", servico);
    params.set("a2", msgWA);
    const url = `${CALENDLY_URL}?${params.toString()}`;
    if (window.Calendly?.initPopupWidget) {
      try { window.Calendly.initPopupWidget({ url }); }
      catch (err) {
        console.debug("Calendly popup falhou, abrindo nova aba:", err?.message);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // ---------- Contadores ----------
  const [counts, setCounts] = useState(METRICS.map(() => 0));
  const seenRef = useRef(false);
  useEffect(() => {
    const el = document.getElementById("numeros");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seenRef.current) {
        seenRef.current = true;
        const duration = 1200, start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / duration);
          setCounts(METRICS.map(m => Math.round(m.v * p)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---------- Dados ----------
  const services = [
    { icon: <Wrench className="w-6 h-6" />, title: "Criação de Sites",
      bullets: ["Landing pages modernas", "Sites institucionais", "SEO básico & performance"] },
    { icon: <Cpu className="w-6 h-6" />, title: "Apps & Integrações",
      bullets: ["SPA com React/Vite", "Integração com APIs (Meta/WhatsApp)", "Automação de rotinas"] },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Infra & Deploy",
      bullets: ["Hospedagem Vercel", "Domínio e SSL", "Boas práticas e monitoramento"] },
    { icon: <Headphones className="w-6 h-6" />, title: "Suporte & CS",
      bullets: ["Onboarding e documentação", "Playbooks de adoção", "Acompanhamento contínuo"] },
  ];

  const projetos = [
    { nome: "Website para SaaS X", desc: "Landing page com captação de leads e integração com formulário.", tags: ["React", "Tailwind", "Vercel"], link: "#" },
    { nome: "App interno de chamados", desc: "Aplicação web para gestão de tickets e SLAs.", tags: ["React", "API", "Automação"], link: "#" },
    { nome: "Site institucional — Cliente Y", desc: "Site institucional rápido, responsivo e com SEO básico.", tags: ["Vite", "SEO", "A11y"], link: "#" },
  ];

  const parceiros = [
    { nome: "Cliente/Parceiro A", logo: "/partners/placeholder.svg" },
    { nome: "Cliente/Parceiro B", logo: "/partners/placeholder.svg" },
    { nome: "Cliente/Parceiro C", logo: "/partners/placeholder.svg" },
  ];

  const depoimentos = [
    { nome: "Mariana P.", cargo: "CEO — Startup X", texto: "O Guilherme entregou nosso site rápido e com ótimo cuidado de performance. Comunicação 10/10.", rating: 5 },
    { nome: "Rafael L.", cargo: "Head de Produto — Empresa Y", texto: "Integrações com API concluídas sem dor de cabeça. Documentação e handoff muito claros.", rating: 5 },
    { nome: "Carla M.", cargo: "CS Lead — SaaS Z", texto: "Onboarding redondo, playbooks e métricas de adoção bem montados. Recomendo.", rating: 5 },
  ];

  // ---------- Formspree ----------
  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true); setError(""); setSent(false);

    if (!FORMSPREE_ENDPOINT.includes("/f/")) {
      setError("Formulário não configurado. Cole seu endpoint do Formspree no código.");
      setSending(false);
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) { setSending(false); return; } // honeypot

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) { form.reset(); setSent(true); }
      else {
        const j = await res.json().catch(() => ({}));
        setError(j?.errors?.[0]?.message || "Formulário não encontrado (confira endpoint e Allowed Domains).");
      }
    } catch (err) {
      setError("Falha de rede. Tente novamente.");
      console.debug("Formspree erro:", err?.message);
    } finally { setSending(false); }
  }

  // ---------- Botões ----------
  const GButton = ({ children, className = "", onClick, type = "button", disabled = false }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 p-[2px]
                  ${disabled ? "opacity-60 pointer-events-none" : "hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[.98]"} transition ${className}`}>
      <span className="rounded-2xl bg-neutral-950/90 px-4 py-2 text-sm font-semibold text-white group-hover:bg-transparent">
        {children}
      </span>
    </button>
  );
  const GLink = ({ children, href, target }) => (
    <a href={href} target={target} rel="noopener noreferrer"
       className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 p-[2px]">
      <span className="rounded-2xl bg-neutral-950/90 px-4 py-2 text-sm font-semibold text-white group-hover:bg-transparent">
        {children}
      </span>
    </a>
  );

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 relative overflow-hidden">
      {/* Fundo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-fuchsia-500/25" />
        <div className="aurora absolute top-40 -right-24 h-[520px] w-[520px] rounded-full bg-indigo-500/25" />
        <div className="aurora absolute bottom-0 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-cyan-500/20" />
        <div className="bg-grid absolute inset-0" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#home" className="font-semibold text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5" /> Guilherme Desenvolvedor Jr
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700 dark:text-neutral-300">
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#servicos">Serviços</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#projetos">Projetos</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#depoimentos">Depoimentos</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#clientes">Clientes</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#skills">Skills</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#sobre">Sobre</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" onClick={() => scrollTo("#contato")}>Contato</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Alternar tema"
              title="Alternar tema"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Github className="w-4 h-4" /></a>
            <a href="https://www.linkedin.com/in/guilhermeaschi/" target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Linkedin className="w-4 h-4" /></a>
            <GButton onClick={openCalendlyPrefilled}><Calendar className="w-4 h-4" /> Solicitar orçamento</GButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Desenvolvedor Jr —{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">
            crio sites e apps
          </span>{" "}
          que geram resultado.
        </h1>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300 max-w-prose">
          Eu mesmo criei este site do zero (React + Vite + Tailwind). Faço landing pages, sites institucionais,
          aplicações web e integrações com APIs — com hospedagem, domínio e SSL prontos para produção.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GButton onClick={() => scrollTo("#contato")}>
            Solicitar orçamento <ArrowRight className="w-4 h-4" />
          </GButton>
          <GLink href="https://wa.me/5551995739787?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento." target="_blank">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </GLink>
        </div>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
          {[
            "Sites responsivos e rápidos",
            "SPA com React/Vite",
            "Integrações com APIs (Meta/WhatsApp)",
            "Deploy na Vercel com domínio e SSL"
          ].map(t => <li key={t} className="flex gap-2 items-start"><Check className="w-4 h-4 mt-0.5" />{t}</li>)}
        </ul>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Serviços</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-2">Sem pacotes fixos. <strong>Solicite um orçamento</strong> conforme sua necessidade.</p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article key={s.title} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl h-full bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold">{s.icon} {s.title}</div>
                <ul className="mt-3 space-y-2 text-neutral-700 dark:text-neutral-300">
                  {s.bullets.map(b => <li key={b} className="flex gap-2"><span className="text-neutral-400 dark:text-neutral-600">▹</span>{b}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <GButton onClick={() => scrollTo("#contato")}><Calendar className="w-4 h-4" /> Pedir orçamento</GButton>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projetos" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Projetos recentes</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-2">Alguns trabalhos e estudos. Em breve, mais cases.</p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map(p => (
            <div key={p.nome} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{p.nome}</h3>
                <p className="text-neutral-700 dark:text-neutral-300 mt-2 flex-1">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map(t => <span key={t} className="px-2 py-0.5 text-xs rounded-full border border-neutral-300 dark:border-neutral-700">{t}</span>)}
                </div>
                {p.link !== "#" && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                     className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
                    <ExternalLink className="w-4 h-4" /> Ver projeto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Depoimentos</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-2">
          O que clientes e parceiros dizem sobre meu trabalho.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {depoimentos.map((d) => (
            <article key={d.nome} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: d.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 mt-3 flex-1">“{d.texto}”</p>
                <div className="mt-4">
                  <div className="font-semibold text-neutral-900 dark:text-white">{d.nome}</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">{d.cargo}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CLIENTES / PARCEIROS */}
      <section id="clientes" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Clientes & Parceiros</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-2">Espaço para logos e depoimentos. Me chame para incluir o seu 🙂</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
          {parceiros.map(p => (
            <div key={p.nome} className="h-16 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 flex items-center justify-center">
              <span className="text-neutral-500 dark:text-neutral-400 text-xs px-2 text-center">{p.nome}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Stack & Skills</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {["React/Vite", "Tailwind", "APIs REST", "WhatsApp API (Meta)", "Hospedagem Vercel", "Git/GitHub", "SIP/VoIP", "Linux/Windows"].map(k => (
            <span key={k} className="px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 text-sm">{k}</span>
          ))}
        </div>
      </section>

      {/* NÚMEROS */}
      <section id="numeros" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Resultados</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <div key={m.k} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800 text-center">
                <div className="text-4xl font-extrabold text-neutral-900 dark:text-white">
                  {counts[i]}{m.k==="SLA cumprido"?"%":""}
                </div>
                <div className="text-neutral-700 dark:text-neutral-300 mt-1">{m.k}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Sobre mim</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-8">
          <p className="text-neutral-700 dark:text-neutral-300">
            Sou <span className="text-neutral-900 dark:text-white font-medium">Guilherme Gomes Aschi</span>, Desenvolvedor <strong>Jr.</strong> e Analista de Suporte/CS.
            Crio sites e aplicações web, integro APIs, cuido de hospedagem e processos de implantação. Este site foi
            desenvolvido por mim com React, Vite e Tailwind, seguindo boas práticas de performance e acessibilidade.
          </p>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            {["Foco em resultado do cliente", "Comunicação clara e documentação", "Entrega com domínio e SSL", "Evolução contínua (portfólio em expansão)"]
              .map(item => <li key={item} className="flex gap-2"><Check className="w-4 h-4 mt-0.5" /> {item}</li>)}
          </ul>
        </div>
      </section>

      {/* CONTATO / ORÇAMENTO */}
      <section id="contato" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Solicite um orçamento</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mt-2">Preencha o formulário, chame no WhatsApp ou agende um papo no Calendly.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Ações rápidas */}
          <div className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
            <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800">
              <GButton onClick={openCalendlyPrefilled}><Calendar className="w-4 h-4" /> Agendar via Calendly</GButton>

              <div className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> gui.gomes.aschi@gmail.com</p>
                <div className="flex items-center gap-2">
                  <GButton onClick={copyEmail}><Copy className="w-4 h-4" /> Copiar e-mail</GButton>
                </div>
                <p className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> linkedin.com/in/guilhermeaschi</p>
                <p className="flex items-center gap-2"><Github className="w-4 h-4" /> github.com/seuusuario</p>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-2">
                <select value={servico} onChange={(e)=>setServico(e.target.value)}
                        className="rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2">
                  <option>Criação de site</option>
                  <option>Aplicativo web (SPA)</option>
                  <option>Integração/API WhatsApp</option>
                  <option>Suporte & Treinamento</option>
                </select>
                <button onClick={abrirWhatsApp}
                        className="rounded-xl bg-emerald-500 text-white font-semibold px-4 py-2 hover:brightness-110">
                  WhatsApp com mensagem
                </button>
              </div>
              <textarea value={msgWA} onChange={(e)=>setMsgWA(e.target.value)}
                        rows={3} placeholder="Conte rapidamente sua necessidade…"
                        className="mt-2 w-full rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2" />
            </div>
          </div>

          {/* Formulário (Formspree) */}
          <form onSubmit={handleSubmit} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
            <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800">
              <input type="text" name="company" className="hidden" tabIndex="-1" autoComplete="off" />
              <label className="block text-sm text-neutral-700 dark:text-neutral-300">Seu nome</label>
              <input name="name" required placeholder="Seu nome"
                     className="mt-1 w-full rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-700 dark:text-neutral-300 mt-4">Seu e-mail</label>
              <input type="email" name="email" required placeholder="voce@empresa.com"
                     className="mt-1 w-full rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-700 dark:text-neutral-300 mt-4">Assunto</label>
              <input name="subject" placeholder="Criação de site / App / Integração"
                     className="mt-1 w-full rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-700 dark:text-neutral-300 mt-4">Mensagem</label>
              <textarea name="message" required rows={5} placeholder="Descreva rapidamente sua necessidade…"
                        className="mt-1 w-full rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              {sent  && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">Obrigado! Recebi sua mensagem.</p>}
              <div className="mt-4">
                <GButton type="submit" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar"} <ArrowRight className="w-4 h-4" />
                </GButton>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Ações fixas */}
      <a href="https://wa.me/5551995739787?text=Ol%C3%A1!%20Quero%20falar."
         target="_blank" rel="noopener noreferrer"
         className="fixed bottom-5 right-5 rounded-full p-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg animate-[pulse_2.2s_ease-in-out_infinite]">
        <div className="rounded-full bg-neutral-950/90 p-3">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </a>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-neutral-900/90 text-white border border-neutral-800 px-4 py-2 text-sm">
          {toast}
        </div>
      )}

      {/* Footer fixo mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/95 backdrop-blur p-3 flex gap-2 justify-center">
        <button onClick={openCalendlyPrefilled} className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold px-4 py-2">Orçamento</button>
        <button onClick={abrirWhatsApp} className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2">WhatsApp</button>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-900 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Guilherme Suporte TI. Site desenvolvido por mim.</p>
          <div className="flex gap-4">
            <a className="hover:text-neutral-900 dark:hover:text-white" href="/privacidade.html">Política de Privacidade</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="/termos.html">Termos</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
