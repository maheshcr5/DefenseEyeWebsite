import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Zap } from "lucide-react";
import { Link } from "wouter";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";
import { Button } from "@/components/ui/button";
import { WHAT_IS_CMMC_CONTENT as content, type WhatIsCmmcTable } from "../../../../shared/whatIsCmmcContent";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return <div className="border border-border/50 bg-card/50 backdrop-blur-sm">
    <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors duration-200" aria-expanded={open}>
      <span className="font-heading font-semibold text-foreground pr-4">{question}</span>
      <ChevronDown className={"w-5 h-5 text-primary shrink-0 transition-transform duration-200 " + (open ? "rotate-180" : "")} />
    </button>
    <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><p className="px-5 pb-5 text-muted-foreground leading-relaxed">{answer}</p></motion.div>}</AnimatePresence>
  </div>;
}

function ComparisonTable({ table }: { table: WhatIsCmmcTable }) {
  return <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
    <thead><tr className="bg-card border border-border/40">{table.headers.map((header, index) => <th key={header} className={"text-left p-3 font-heading font-semibold " + (index ? "text-primary" : "text-foreground") + (index < table.headers.length - 1 ? " border-r border-border/40" : "")}>{header}</th>)}</tr></thead>
    <tbody>{table.rows.map((row, rowIndex) => <tr key={row[0]} className={"border border-border/30 " + (rowIndex % 2 === 0 ? "bg-card/20" : "bg-card/40")}>{row.map((cell, index) => <td key={row[0] + "-" + index} className={"p-3 " + (index === 0 ? "font-medium text-foreground" : "text-muted-foreground") + (index < row.length - 1 ? " border-r border-border/30" : "")}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

function EmphasizedText({ text, emphasis }: { text: string; emphasis: readonly string[] }) {
  if (emphasis.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${emphasis.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return <>{text.split(pattern).map((part, index) => emphasis.includes(part) ? <strong key={part + index} className="text-foreground">{part}</strong> : part)}</>;
}

export default function WhatIsCMMC() {
  return <KnowledgeHubLayout title={content.title} description={content.description} lastUpdated={content.lastUpdated} tocItems={[...content.toc]} relatedArticles={[...content.relatedArticles]} schemaType="FAQPage">
    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">{content.h1}</h1>
    <div className="bg-primary/5 border-l-4 border-primary p-5 mb-10 rounded-r"><p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Quick Answer</p><p className="text-foreground leading-relaxed"><EmphasizedText text={content.quickAnswer} emphasis={content.quickAnswerEmphasis} /></p></div>

    <section id={content.definition.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.definition.heading}</h2>{content.definition.paragraphs.map((paragraph, index) => <p key={paragraph} className={"text-muted-foreground leading-relaxed " + (index === content.definition.paragraphs.length - 1 ? "mb-6" : "mb-4")}><EmphasizedText text={paragraph} emphasis={content.definition.paragraphEmphasis[index] ?? []} /></p>)}<div className="grid sm:grid-cols-2 gap-4">{content.definition.cards.map((item) => <div key={item.title} className="bg-card/60 backdrop-blur-sm border border-border/40 p-4 flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><p className="font-semibold text-foreground text-sm mb-1">{item.title}</p><p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p></div></div>)}</div></section>

    <section id={content.history.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.history.heading}</h2><p className="text-muted-foreground leading-relaxed mb-4">{content.history.introduction}</p><div className="space-y-0 relative"><div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />{content.history.items.map((item) => <div key={item.year} className="relative pl-10 pb-8"><div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" /><div className="bg-card/40 border border-border/30 p-4"><div className="flex items-center gap-3 mb-1"><span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{item.year}</span><span className="font-heading font-semibold text-foreground text-sm">{item.event}</span></div><p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p></div></div>)}</div></section>

    <section id={content.whoNeedsIt.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.whoNeedsIt.heading}</h2><p className="text-muted-foreground leading-relaxed mb-4">{content.whoNeedsIt.introduction}</p><ul className="space-y-3 mb-6">{content.whoNeedsIt.items.map((item) => <li key={item} className="flex items-start gap-3 text-muted-foreground"><ChevronDown className="w-4 h-4 text-primary shrink-0 mt-1 rotate-[-90deg]" /><span className="leading-relaxed">{item}</span></li>)}</ul><div className="bg-accent/5 border border-accent/20 p-4 rounded"><p className="text-sm text-foreground"><strong className="text-accent">Important:</strong> {content.whoNeedsIt.note}</p></div></section>

    <section id={content.levels.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.levels.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.levels.introduction}</p><ComparisonTable table={content.levels.table} /><p className="text-xs text-muted-foreground mt-3">{content.levels.note}</p></section>
    <section id={content.comparison.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.comparison.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.comparison.introduction}</p><ComparisonTable table={content.comparison.table} /></section>

    <section id={content.terms.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.terms.heading}</h2><p className="text-muted-foreground leading-relaxed mb-6">{content.terms.introduction}</p><div className="space-y-4">{content.terms.items.map((item) => <div key={item.title} className="bg-card/60 backdrop-blur-sm border border-border/40 p-5"><h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3><p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p></div>)}</div></section>

    <section id={content.automation.id} className="mb-12"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.automation.heading}</h2>{content.automation.paragraphs.map((paragraph, index) => <p key={paragraph} className={"text-muted-foreground leading-relaxed " + (index ? "mb-6" : "mb-4")}><EmphasizedText text={paragraph} emphasis={content.automation.paragraphEmphasis[index] ?? []} /></p>)}<div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-6 bracket-decoration"><div className="flex items-start gap-4 mb-5"><div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0"><Zap className="w-5 h-5 text-primary" /></div><div><p className="font-heading font-bold text-foreground mb-1">{content.automation.title}</p><p className="text-sm text-muted-foreground">{content.automation.subtitle}</p></div></div><ul className="grid sm:grid-cols-2 gap-3 mb-6">{content.automation.capabilities.map((capability) => <li key={capability} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{capability}</span></li>)}</ul><div className="flex flex-wrap gap-3"><Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Book Assessment<ArrowRight className="w-4 h-4 ml-2" /></Button><Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">Free Consultation</Button></div></div><div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground"><span>Learn more: </span>{content.automation.links.map((link) => <span key={link.href}><Link href={link.href} className="text-primary hover:underline">{link.label}</Link></span>)}</div></section>

    <section id={content.faq.id} className="mb-8"><h2 className="font-heading text-2xl font-bold text-foreground mb-6">{content.faq.heading}</h2><div className="space-y-2">{content.faq.items.map((item) => <FAQItem key={item.question} question={item.question} answer={item.answer} />)}</div></section>
  </KnowledgeHubLayout>;
}
