import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";
import { EVIDENCE_MAPPING_CONTENT as content } from "../../../../shared/evidenceMappingContent";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors duration-200" aria-expanded={open}>
        <span className="font-heading font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
          <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{answer}</p>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function ArticleTable({ headers, rows, kind }: { headers: readonly string[]; rows: readonly (readonly string[])[]; kind: "families" | "comparison" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm border-collapse ${kind === "families" ? "min-w-[500px]" : "min-w-[480px]"}`}>
        <thead><tr className="bg-card border border-border/40">{headers.map((header, index) => (
          <th key={header} className={`text-left p-3 font-heading font-semibold ${kind === "families" && index === 1 || kind === "comparison" && index === 2 ? "text-primary" : kind === "comparison" && index === 1 ? "text-muted-foreground" : "text-foreground"}${index < headers.length - 1 ? " border-r border-border/40" : ""}${kind === "families" && index === 1 ? " w-20" : ""}`}>{header}</th>
        ))}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => {
          const total = kind === "families" && row[0] === "TOTAL";
          return <tr key={row[0]} className={total ? "bg-primary/10 border border-primary/30" : `border border-border/30 ${rowIndex % 2 === 0 ? "bg-card/20" : "bg-card/40"}`}>
            {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`p-3 ${index === 0 ? total ? "font-heading font-bold text-foreground" : "font-medium text-foreground" : kind === "families" && index === 1 ? total ? "text-center font-heading font-bold text-primary" : "text-center text-primary font-semibold" : kind === "families" && index === 2 ? "text-muted-foreground text-xs leading-relaxed" : kind === "comparison" && index === 2 ? "text-primary font-medium" : "text-muted-foreground"}${index < row.length - 1 ? " border-r border-border/30" : ""}`}>{cell}</td>)}
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}

const platformColors = ["border-blue-500/30 bg-blue-500/5", "border-blue-400/30 bg-blue-400/5", "border-orange-500/30 bg-orange-500/5", "border-primary/30 bg-primary/5"] as const;

export default function EvidenceMapping() {
  return (
    <KnowledgeHubLayout title={content.title} description={content.description} lastUpdated={content.lastUpdated} tocItems={[...content.toc]} relatedArticles={[...content.related]}>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">{content.h1}</h1>
      <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r"><p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Quick Answer</p><p className="text-foreground leading-relaxed">{content.quickAnswer.map((part, index) => part.strong ? <strong key={index}>{part.text}</strong> : part.text)}</p></div>

      <section id={content.definition.id} className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.definition.heading}</h2>
        {content.definition.paragraphs.map((paragraph, index) => <p key={paragraph} className={`text-muted-foreground leading-relaxed ${index === content.definition.paragraphs.length - 1 ? "mb-6" : "mb-4"}`}>{paragraph}</p>)}
        <div className="grid sm:grid-cols-3 gap-4">{content.definition.stats.map((stat) => <div key={stat.label} className="bg-card/60 backdrop-blur-sm border border-border/40 p-4 text-center"><p className="font-heading text-2xl font-bold text-primary mb-1">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>)}</div>
      </section>

      <section id={content.controlFamilies.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.controlFamilies.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.controlFamilies.introduction}</p><ArticleTable headers={content.controlFamilies.headers} rows={content.controlFamilies.rows} kind="families" /></section>
      <section id={content.comparison.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.comparison.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.comparison.introduction}</p><ArticleTable headers={content.comparison.headers} rows={content.comparison.rows} kind="comparison" /></section>

      <section id={content.collection.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.collection.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.collection.introduction}</p><div className="space-y-4">{content.collection.steps.map((item) => <div key={item.step} className="flex gap-4 bg-card/40 border border-border/30 p-5"><div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">{item.step}</div><div><p className="font-heading font-semibold text-foreground mb-2">{item.title}</p><p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p></div></div>)}</div></section>

      <section id={content.cloud.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.cloud.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.cloud.introduction}</p><div className="grid sm:grid-cols-2 gap-4">{content.cloud.platforms.map((item, index) => <div key={item.platform} className={`border p-5 ${platformColors[index]}`}><h3 className="font-heading font-semibold text-foreground mb-3">{item.platform}</h3><ul className="space-y-1.5">{item.evidence.map((evidence) => <li key={evidence} className="flex items-start gap-2 text-xs text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /><span>{evidence}</span></li>)}</ul></div>)}</div></section>

      <section id={content.documents.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.documents.heading}</h2><p className="text-muted-foreground leading-relaxed mb-4">{content.documents.introduction}</p><div className="grid sm:grid-cols-2 gap-6 mb-6">{content.documents.items.map((item) => <div key={item.title} className="bg-card/60 backdrop-blur-sm border border-border/40 p-5"><h3 className="font-heading font-semibold text-foreground mb-3">{item.title}</h3>{item.paragraphs.map((paragraph, index) => <p key={paragraph} className={`text-sm text-muted-foreground leading-relaxed ${index < item.paragraphs.length - 1 ? "mb-3" : ""}`}>{paragraph}</p>)}</div>)}</div></section>

      <section id={content.automation.id} className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.automation.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.automation.paragraph}</p>
        <div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration mb-6"><div className="flex items-start gap-4 mb-5"><div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0"><Zap className="w-5 h-5 text-primary" /></div><div><p className="font-heading font-bold text-foreground mb-1">{content.automation.cardTitle}</p><p className="text-sm text-muted-foreground">{content.automation.cardSubtitle}</p></div></div><div className="grid sm:grid-cols-2 gap-3 mb-6">{content.automation.capabilities.map((capability) => <div key={capability} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{capability}</span></div>)}</div><div className="flex flex-wrap gap-3"><Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Book Assessment<ArrowRight className="w-4 h-4 ml-2" /></Button><Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Free Consultation</Button></div></div>
        <p className="text-sm text-muted-foreground">Related: {content.automation.links.map((link, index) => <span key={link.href}>{index > 0 && " · "}<Link href={link.href} className="text-primary hover:underline">{link.label}</Link></span>)}</p>
      </section>

      <section id={content.faq.id} className="mb-8"><h2 className="font-heading text-2xl font-bold text-foreground mb-6">{content.faq.heading}</h2><div className="space-y-2">{content.faq.items.map((item) => <FAQItem key={item.question} question={item.question} answer={item.answer} />)}</div></section>
    </KnowledgeHubLayout>
  );
}
