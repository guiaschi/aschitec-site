// src/App.jsx
import { useEffect, useRef, useState } from "react";
import {
  Cpu, ShieldCheck, Wrench, Headphones, ArrowRight, Check, Mail,
  MessageCircle, Github, Linkedin, Calendar, Code2, Copy
} from "lucide-react";

// 🔧 Cole aqui seu endpoint real do Formspree:
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrbazgvo";
// ✅ Seu Calendly (30min):
const CALENDLY_URL = "https://calendly.com/gui-gomes-aschi/30min";

export default function App() {
  // ---------- Estados ----------
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [servico, setServico] = useState("Onboarding SaaS");
  const [msgWA, setMsgWA] = useState("Olá, Guilherme! Quero um orçamento.");

  // ---------- Utilidades ----------
  function copyEmail() {
    navigator.clipboard.writeText("gui.gomes.aschi@gmail.com");
    setToast("E-mail copiado!");
    setTimeout(() => setToast(""), 2000);
  }
  function scrollToContato() {
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
  }
  function abrirWhatsApp() {
    const base = "https://wa.me/5551995739787";
    const text = encodeURIComponent(`[${servico}] ${msgWA}`);
    window.open(`${base}?text=${text}`, "_blank");
  }
  function getFormVals() {
    const form = document.querySelector('#contato form');
    const name = form?.querySelector('input[name="name"]')?.value || "";
    const email = form?.querySelector('input[name="email"]')?.value || "";
    return { name, email };
  }

  // ---------- Calendly: pré-carregar script + CSS ----------
  useEffect(() => {
    // CSS (caso não esteja no index.html)
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }
    // Script
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  function openCalendlyPrefilled() {
    const { name, email } = getFormVals();
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (email) params.set("email", email);
    // a1 e a2 devem corresponder à ordem das suas Invitee Questions no Calendly
    params.set("a1", servico);
    params.set("a2", msgWA);

    const url = `${CALENDLY_URL}?${params.toString()}`;

    if (window.Calendly?.initPopupWidget) {
      try {
        window.Calendly.initPopupWidget({ url });
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } else {
      // Fallback: primeira vez pode abrir em nova aba enquanto o script carrega
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // ---------- Contadores ----------
  const metrics = [
    { k: "Implantações", v: 40 },
    { k: "NPS médio", v: 92 },
    { k: "Integrações/API", v: 18 },
    { k: "SLA cumprido", v: 99 },
  ];
  const [counts, setCounts] = useState(metrics.map(() => 0));
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
          setCounts(metrics.map(m => Math.round(m.v * p)));
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
    { icon: <Wrench className="w-6 h-6" />, title: "Suporte & Implementação",
      bullets: ["Onboarding de sistemas SaaS", "Telefonia SIP/VoIP", "Treinamentos e documentação"] },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Infra & Segurança",
      bullets: ["Hardening básico", "Backups e acessos", "Monitoramento e incidentes"] },
    { icon: <Cpu className="w-6 h-6" />, title: "Automação & APIs",
      bullets: ["REST (GET/POST)", "WhatsApp API (Meta)", "Scripts e rotinas"] },
    { icon: <Headphones className="w-6 h-6" />, title: "Customer Success",
      bullets: ["Jornadas & NPS", "Playbooks de adoção", "Redução de churn"] },
  ];
  const skills = ["SIP/VoIP", "APIs REST", "Linux (shell)", "Windows Server", "Redes (básico)", "MySQL/SQL", "HTML/CSS/JS", "Git/GitHub"];

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
    } catch {
      setError("Falha de rede. Tente novamente.");
    } finally { setSending(false); }
  }

  // ---------- Botões estilizados ----------
  const GButton = ({ children, className = "", onClick, type }) => (
    <button type={type} onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 p-[2px]
                  hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[.98] transition ${className}`}>
      <span className="rounded-2xl bg-neutral-950/90 px-4 py-2 text-sm font-semibold text-white group-hover:bg-transparent">
        {children}
      </span>
    </button>
  );
  const GLink = ({ children, href, target }) => (
    <a href={href} target={target}
      className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 p-[2px]">
      <span className="rounded-2xl bg-neutral-950/90 px-4 py-2 text-sm font-semibold text-white group-hover:bg-transparent">
        {children}
      </span>
    </a>
  );

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
      {/* Fundo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-fuchsia-500/25" />
        <div className="aurora absolute top-40 -right-24 h-[520px] w-[520px] rounded-full bg-indigo-500/25" />
        <div className="aurora absolute bottom-0 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-cyan-500/20" />
        <div className="bg-grid absolute inset-0" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-neutral-800/60 bg-neutral-950/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#home" className="font-semibold text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5" /> Guilherme Suporte TI
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a className="hover:text-white" href="#servicos">Serviços</a>
            <a className="hover:text-white" href="#skills">Skills</a>
            <a className="hover:text-white" href="#sobre">Sobre</a>
            <a className="hover:text-white" onClick={scrollToContato}>Contato</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://github.com/" target="_blank" className="p-2 rounded-xl border border-neutral-800 hover:bg-neutral-900"><Github className="w-4 h-4" /></a>
            <a href="https://www.linkedin.com/in/guilhermeaschi/" target="_blank" className="p-2 rounded-xl border border-neutral-800 hover:bg-neutral-900"><Linkedin className="w-4 h-4" /></a>
            <GButton onClick={openCalendlyPrefilled}><Calendar className="w-4 h-4" /> Agende um papo</GButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Suporte, CS e Automação{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">
            para seu negócio
          </span>.
        </h1>
        <p className="mt-4 text-neutral-300 max-w-prose">
          Implanto e otimizo SaaS, SIP/VoIP e integrações com APIs (Meta/WhatsApp) para acelerar o Time-to-Value,
          reduzir chamados e aumentar a satisfação do cliente.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GLink href="https://wa.me/5551995739787?text=Ol%C3%A1%20Guilherme!%20Quero%20um%20or%C3%A7amento%20de%20TI." target="_blank">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </GLink>
          <GButton onClick={() => document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" })}>
            Ver serviços <ArrowRight className="w-4 h-4" />
          </GButton>
        </div>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-300">
          {["Implantações ponta a ponta","Playbooks e métricas de CS","Automação com APIs (Meta/WhatsApp)","Monitoramento e documentação"]
            .map(t => <li key={t} className="flex gap-2 items-start"><Check className="w-4 h-4 mt-0.5" />{t}</li>)}
        </ul>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Serviços</h2>
        <p className="text-neutral-300 mt-2">Pacotes sob medida com SLA e documentação.</p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article key={s.title} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl h-full bg-neutral-900/60 p-6 border border-neutral-800">
                <div className="flex items-center gap-2 text-white font-semibold">{s.icon} {s.title}</div>
                <ul className="mt-3 space-y-2 text-neutral-300">
                  {s.bullets.map(b => <li key={b} className="flex gap-2"><span className="text-neutral-600">▹</span>{b}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Stack & Skills</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map(k => <span key={k} className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-sm">{k}</span>)}
        </div>
      </section>

      {/* NÚMEROS */}
      <section id="numeros" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Resultados em números</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={m.k} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
              <div className="rounded-3xl bg-neutral-900/60 p-6 border border-neutral-800 text-center">
                <div className="text-4xl font-extrabold">{counts[i]}{(m.k==="NPS médio"||m.k==="SLA cumprido")?"%":""}</div>
                <div className="text-neutral-300 mt-1">{m.k}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900" id="planos">
        <h2 className="text-2xl md:text-3xl font-bold">Planos</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {nome:"Starter", preco:"R$ 490", itens:["Setup básico","2h suporte","WhatsApp assíncrono"]},
            {nome:"Pro (recomendado)", preco:"R$ 990", hot:true, itens:["Onboarding completo","SIP/VoIP + APIs","6h suporte + SLA"]},
            {nome:"Enterprise", preco:"Sob consulta", itens:["Implantação avançada","Treinamento equipe","SLA dedicado"]},
          ].map(p => (
            <div key={p.nome} className={`rounded-3xl p-[1px] ${p.hot ? "from-fuchsia-600/60" : "from-neutral-700/40"} bg-gradient-to-br via-indigo-700/30 to-cyan-700/30`}>
              <div className="rounded-3xl bg-neutral-900/60 p-6 border border-neutral-800 h-full flex flex-col">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold">{p.nome}</h3>
                  {p.hot && <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">+ popular</span>}
                </div>
                <div className="text-3xl font-bold mt-2">{p.preco}</div>
                <ul className="mt-4 space-y-2 text-neutral-300 flex-1">
                  {p.itens.map(i => <li key={i} className="flex gap-2"><span className="text-neutral-600">▹</span>{i}</li>)}
                </ul>
                <GButton onClick={openCalendlyPrefilled} className="mt-4">Contratar</GButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Sobre mim</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-8">
          <p className="text-neutral-300">
            Sou <span className="text-white font-medium">Guilherme Gomes Aschi</span>, Analista de Suporte e Customer Success.
            Experiência com implantação de sistemas, SIP/VoIP, integrações com APIs (Meta/WhatsApp) e playbooks orientados a métricas.
          </p>
          <ul className="space-y-2 text-neutral-300">
            {["ADS (La Salle, 2024)","Implementações ponta a ponta","Documentação clara","Comunicação e proatividade"]
              .map(item => <li key={item} className="flex gap-2"><Check className="w-4 h-4 mt-0.5" /> {item}</li>)}
          </ul>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900">
        <h2 className="text-2xl md:text-3xl font-bold">Vamos conversar?</h2>
        <p className="text-neutral-300 mt-2">WhatsApp dinâmico, copiar e-mail, Calendly e formulário.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Ações rápidas */}
          <div className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
            <div className="rounded-3xl bg-neutral-900/60 p-6 border border-neutral-800">
              <GButton onClick={openCalendlyPrefilled}><Calendar className="w-4 h-4" /> Agendar via Calendly</GButton>

              <div className="mt-4 space-y-2 text-sm text-neutral-300">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> gui.gomes.aschi@gmail.com</p>
                <div className="flex items-center gap-2">
                  <GButton onClick={copyEmail}><Copy className="w-4 h-4" /> Copiar e-mail</GButton>
                </div>
                <p className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> linkedin.com/in/guilhermeaschi</p>
                <p className="flex items-center gap-2"><Github className="w-4 h-4" /> github.com/seuusuario</p>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-2">
                <select value={servico} onChange={(e)=>setServico(e.target.value)}
                        className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2">
                  <option>Onboarding SaaS</option>
                  <option>Telefonia SIP/VoIP</option>
                  <option>Automação/API WhatsApp</option>
                  <option>Suporte & Treinamento</option>
                </select>
                <button onClick={abrirWhatsApp}
                        className="rounded-xl bg-emerald-500 font-semibold px-4 py-2 hover:brightness-110">
                  WhatsApp com mensagem
                </button>
              </div>
              <textarea value={msgWA} onChange={(e)=>setMsgWA(e.target.value)}
                        rows={3} placeholder="Descreva rapidamente sua necessidade…"
                        className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2" />
            </div>
          </div>

          {/* Formulário (Formspree) */}
          <form onSubmit={handleSubmit} className="rounded-3xl p-[1px] bg-gradient-to-br from-fuchsia-700/40 via-indigo-700/30 to-cyan-700/30">
            <div className="rounded-3xl bg-neutral-900/60 p-6 border border-neutral-800">
              <input type="text" name="company" className="hidden" tabIndex="-1" autoComplete="off" />
              <label className="block text-sm text-neutral-300">Seu nome</label>
              <input name="name" required placeholder="Seu nome"
                     className="mt-1 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-300 mt-4">Seu e-mail</label>
              <input type="email" name="email" required placeholder="voce@empresa.com"
                     className="mt-1 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-300 mt-4">Assunto</label>
              <input name="subject" placeholder="Onboarding SaaS / VoIP / Automação"
                     className="mt-1 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              <label className="block text-sm text-neutral-300 mt-4">Mensagem</label>
              <textarea name="message" required rows={5} placeholder="Conte rapidamente sua necessidade…"
                        className="mt-1 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" />
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
              {sent  && <p className="mt-3 text-sm text-emerald-400">Obrigado! Recebi sua mensagem.</p>}
              <div className="mt-4">
                <GButton type="submit">Enviar <ArrowRight className="w-4 h-4" /></GButton>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-neutral-900" id="faq">
        <h2 className="text-2xl md:text-3xl font-bold">Dúvidas frequentes</h2>
        <div className="mt-6 space-y-3">
          {[
            {q:"Quanto tempo leva um onboarding padrão?", a:"Geralmente 1–2 semanas, com sessões assíncronas e checkpoint ao final."},
            {q:"Atende remoto e presencial?", a:"Remoto em todo o Brasil; presencial mediante agenda e custo de deslocamento."},
            {q:"Emite nota fiscal?", a:"Sim. O orçamento já segue com detalhes e condições."},
          ].map(f => (
            <details key={f.q} className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                {f.q} <span className="text-neutral-400 group-open:rotate-90 transition">›</span>
              </summary>
              <p className="text-neutral-300 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-neutral-900/90 border border-neutral-800 px-4 py-2 text-sm">
          {toast}
        </div>
      )}

      {/* Ações fixas */}
      <a href="https://wa.me/5551995739787?text=Ol%C3%A1%20Guilherme!%20Quero%20falar."
         target="_blank"
         className="fixed bottom-5 right-5 rounded-full p-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg animate-[pulse_2.2s_ease-in-out_infinite]">
        <div className="rounded-full bg-neutral-950/90 p-3">
          <MessageCircle className="w-6 h-6" />
        </div>
      </a>
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur p-3 flex gap-2 justify-center">
        <button onClick={openCalendlyPrefilled} className="rounded-xl bg-white text-neutral-900 font-semibold px-4 py-2">Agendar</button>
        <button onClick={abrirWhatsApp} className="rounded-xl border border-neutral-700 px-4 py-2">WhatsApp</button>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Guilherme Suporte TI. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a className="hover:text-white" href="/privacidade.html">Política de Privacidade</a>
            <a className="hover:text-white" href="/termos.html">Termos</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
