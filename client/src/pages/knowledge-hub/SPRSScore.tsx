import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";
import { SPRS_SCORE_CONTENT as content } from "../../../../shared/sprsScoreContent";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors duration-200" aria-expanded={open}>
        <span className="font-heading font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><p className="px-5 pb-5 text-muted-foreground leading-relaxed">{answer}</p></motion.div>}</AnimatePresence>
    </div>
  );
}

const rangeColors = ["text-green-400", "text-green-400", "text-yellow-400", "text-orange-400", "text-red-400", "text-red-500", "text-red-600"] as const;

function ArticleTable({ headers, rows, kind }: { headers: readonly string[]; rows: readonly (readonly string[])[]; kind: "ranges" | "domains" | "comparison" }) {
  return (
    <div className="overflow-x-auto"><table className={`w-full text-sm border-collapse ${kind === "domains" ? "min-w-[500px]" : "min-w-[480px]"}`}>
      <thead><tr className="bg-card border border-border/40">{headers.map((header, index) => <th key={header} className={`text-left p-3 font-heading font-semibold ${kind === "domains" && (index === 1 || index === 2) || kind === "comparison" && index > 0 ? "text-primary" : "text-foreground"}${index < headers.length - 1 ? " border-r border-border/40" : ""}${kind === "domains" && index === 1 ? " w-20" : ""}${kind === "domains" && index === 2 ? " w-24" : ""}`}>{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, rowIndex) => {
        const total = kind === "domains" && row[0] === "TOTAL";
        return <tr key={row[0]} className={total ? "bg-primary/10 border border-primary/30" : `border border-border/30 ${rowIndex % 2 === 0 ? "bg-card/20" : "bg-card/40"}`}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`p-3 ${kind === "ranges" && index === 0 ? `font-heading font-bold ${rangeColors[rowIndex]}` : index === 0 ? total ? "font-heading font-bold text-foreground" : "font-medium text-foreground" : kind === "domains" && (index === 1 || index === 2) ? total ? "text-center font-heading font-bold text-primary" : index === 1 ? "text-center text-primary font-semibold" : "text-center font-semibold text-foreground" : kind === "domains" && index === 3 ? "text-muted-foreground text-xs leading-relaxed" : "text-muted-foreground"}${index < row.length - 1 ? " border-r border-border/30" : ""}`}>{cell}</td>)}</tr>;
      })}</tbody>
    </table></div>
  );
}

export default function SPRSScore() {
  return (
    <KnowledgeHubLayout title={content.title} description={content.description} lastUpdated={content.lastUpdated} tocItems={[...content.toc]} relatedArticles={[...content.related]}>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">{content.h1}</h1>
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r"><p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Quick Answer</p><p className="text-foreground leading-relaxed">{content.quickAnswer.map((part, index) => part.strong ? <strong key={index}>{part.text}</strong> : part.text)}</p></div>

      <section id={content.overview.id} className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.overview.heading}</h2>
        {content.overview.paragraphs.map((paragraph, index) => <p key={paragraph.text} className={`text-muted-foreground leading-relaxed ${index === content.overview.paragraphs.length - 1 ? "mb-6" : "mb-4"}`}>{paragraph.emphasis && <strong className="text-foreground">{paragraph.emphasis}</strong>}{paragraph.text}</p>)}
        <div className="grid sm:grid-cols-3 gap-4">{content.overview.stats.map((stat) => <div key={stat.label} className="bg-card/60 backdrop-blur-sm border border-border/40 p-4 text-center"><p className="font-heading text-2xl font-bold text-primary mb-1">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>)}</div>
      </section>

      <section id={content.calculation.id} className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.calculation.heading}</h2><p className="text-muted-foreground leading-relaxed mb-4">{content.calculation.introduction}</p>
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-5 mb-6"><h3 className="font-heading font-semibold text-foreground mb-3">{content.calculation.formulaHeading}</h3><div className="bg-background/50 border border-border/30 p-4 font-mono text-sm mb-4">{content.calculation.formula.map((line, index) => <p key={line} className={index === 0 ? "text-primary mb-1" : `text-muted-foreground ${index === 2 ? "mt-1" : ""}`}>{line}</p>)}</div><p className="text-sm text-muted-foreground leading-relaxed">{content.calculation.explanation}</p></div>
        <p className="text-muted-foreground leading-relaxed mb-4">{content.calculation.assessmentIntroduction} {content.calculation.assessmentStates.map((state, index) => <span key={state.label}>{index > 0 && (index === content.calculation.assessmentStates.length - 1 ? ", or " : ", ")}<strong className="text-foreground">{state.label}</strong> ({state.description})</span>)}.</p>
      </section>

      <section id={content.scoreRanges.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.scoreRanges.heading}</h2><ArticleTable headers={content.scoreRanges.headers} rows={content.scoreRanges.rows} kind="ranges" /></section>
      <section id={content.domainImpact.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.domainImpact.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.domainImpact.introduction}</p><ArticleTable headers={content.domainImpact.headers} rows={content.domainImpact.rows} kind="domains" /></section>

      <section id={content.submission.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.submission.heading}</h2><p className="text-muted-foreground leading-relaxed mb-5">{content.submission.introduction}</p><div className="space-y-4">{content.submission.steps.map((item) => <div key={item.step} className="flex gap-4 bg-card/40 border border-border/30 p-4"><div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">{item.step}</div><div><p className="font-semibold text-foreground mb-1">{item.title}</p><p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p></div></div>)}</div></section>

      <section id={content.improvements.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.improvements.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.improvements.introduction}</p><div className="space-y-3">{content.improvements.items.map((item) => <div key={item.number} className="flex gap-4 bg-card/40 border border-border/30 p-4 hover:border-primary/30 transition-colors"><div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">{item.number}</div><div><p className="font-semibold text-foreground mb-1.5">{item.title}</p><p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p></div></div>)}</div></section>

      <section id={content.comparison.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.comparison.heading}</h2><p className="text-muted-foreground leading-relaxed mb-5">{content.comparison.introduction}</p><ArticleTable headers={content.comparison.headers} rows={content.comparison.rows} kind="comparison" /></section>

      <section id={content.automation.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.automation.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.automation.paragraph}</p><div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration mb-6"><div className="flex items-start gap-4 mb-5"><div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-primary" /></div><div><p className="font-heading font-bold text-foreground mb-1">{content.automation.cardTitle}</p><p className="text-sm text-muted-foreground">{content.automation.cardSubtitle}</p></div></div><div className="grid sm:grid-cols-2 gap-3 mb-6">{content.automation.capabilities.map((capability) => <div key={capability} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{capability}</span></div>)}</div><div className="flex flex-wrap gap-3"><Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Book Assessment<ArrowRight className="w-4 h-4 ml-2" /></Button><Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Free Consultation</Button></div></div></section>

      <section id={content.faq.id} className="mb-8"><h2 className="font-heading text-2xl font-bold text-foreground mb-6">{content.faq.heading}</h2><div className="space-y-2">{content.faq.items.map((item) => <FAQItem key={item.question} question={item.question} answer={item.answer} />)}</div></section>
    </KnowledgeHubLayout>
  );
}
