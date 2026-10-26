import { Link } from "wouter";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import KnowledgeHubLayout from "@/components/KnowledgeHubLayout";
import { Button } from "@/components/ui/button";
import { CERTIFICATION_PROCESS_CONTENT as content } from "../../../../shared/certificationProcessContent";

export default function CertificationProcess() {
  return <KnowledgeHubLayout title={content.title} description={content.description} lastUpdated={content.lastUpdated} tocItems={[...content.toc]} relatedArticles={[...content.related]} schemaType="Article">
    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">{content.h1}</h1>
    <div className="bg-primary/5 border border-primary/20 p-5 mb-8"><p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Quick Answer</p><p className="text-foreground leading-relaxed">{content.quickAnswer}</p></div>

    <section id={content.overview.id}>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.overview.heading}</h2>
      {content.overview.paragraphs.map((paragraph, index) => <p key={paragraph} className={"text-muted-foreground leading-relaxed " + (index ? "mb-6" : "mb-4")}>{paragraph}</p>)}
      <div className="overflow-x-auto mb-8"><div className="flex items-center gap-0 min-w-max">{content.steps.map((step, index) => <div key={step.num} className="flex items-center"><div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center font-heading font-bold text-primary text-sm">{step.num}</div><span className="text-xs text-muted-foreground mt-1.5 text-center max-w-[80px]">{step.title}</span></div>{index < content.steps.length - 1 && <div className="w-8 h-0.5 bg-border/60 mx-1 mb-4" />}</div>)}</div></div>
    </section>

    {content.steps.map((step) => <section id={step.id} key={step.id} className="mb-10">
      <div className="flex items-start gap-4 mb-4"><div className="w-12 h-12 rounded border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0"><span className="font-heading font-bold text-primary text-lg">{step.num}</span></div><h2 className="font-heading text-2xl font-bold text-foreground pt-2">{step.title}</h2></div>
      <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
      <ul className="space-y-2 mb-5">{step.details.map((detail) => <li key={detail} className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span className="text-sm text-muted-foreground">{detail}</span></li>)}</ul>
      <div className="grid sm:grid-cols-2 gap-3 mb-4"><div className="bg-card/40 border border-border/30 p-3"><p className="text-xs font-medium text-muted-foreground/70 uppercase mb-1">Timing</p><p className="text-sm font-semibold text-foreground">{step.timeManual}</p></div><div className="bg-primary/5 border border-primary/20 p-3"><p className="text-xs font-medium text-primary/70 uppercase mb-1">How CMMCLens can help</p><p className="text-sm font-semibold text-primary">{step.timeWithLens}</p></div></div>
      <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 p-3"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground"><span className="font-semibold text-amber-400">Note:</span> {step.note}</p></div>
    </section>)}

    <section id={content.postCertification.id} className="mb-10"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.postCertification.heading}</h2><p className="text-muted-foreground leading-relaxed mb-4">{content.postCertification.paragraph}</p><ul className="space-y-2 mb-4">{content.postCertification.items.map((item) => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span className="text-sm text-muted-foreground">{item}</span></li>)}</ul></section>

    <section id={content.timeline.id} className="mb-10"><h2 className="font-heading text-2xl font-bold text-foreground mb-4">{content.timeline.heading}</h2><div className="overflow-x-auto"><table className="w-full border-collapse text-sm" role="table"><thead><tr className="border-b-2 border-primary/30">{content.timeline.headers.map((header, index) => <th key={header} className={(index ? "text-center" : "text-left") + " py-3 px-3 font-heading font-semibold " + (index === 2 ? "text-primary" : index ? "text-muted-foreground" : "text-foreground")}>{header}</th>)}</tr></thead><tbody>{content.timeline.rows.map((row, index) => <tr key={row[0]} className={"border-b border-border/30 " + (index % 2 === 0 ? "bg-card/30" : "")}>{row.map((cell, cellIndex) => <td key={row[0] + cellIndex} className={(cellIndex ? "text-center" : "") + " py-3 px-3 " + (cellIndex === 2 ? "text-primary font-medium" : cellIndex ? "text-muted-foreground" : "font-medium text-foreground")}>{cell}</td>)}</tr>)}</tbody></table></div><p className="text-xs text-muted-foreground mt-3 italic">{content.timeline.note}</p></section>

    <section id={content.automation.id} className="mb-10 bg-primary/5 border border-primary/20 p-6"><h2 className="font-heading text-2xl font-bold text-foreground mb-3">{content.automation.heading}</h2><p className="text-muted-foreground leading-relaxed mb-5">{content.automation.paragraph}</p><div className="grid sm:grid-cols-2 gap-4 mb-5">{content.automation.items.map((item) => <div key={item.step} className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /><div><span className="text-sm font-semibold text-foreground">{item.step}: </span><span className="text-sm text-muted-foreground">{item.impact}</span></div></div>)}</div><Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"><a href="/lp/cmmclens-demo">{content.automation.cta}<ArrowRight className="w-4 h-4 ml-2" /></a></Button></section>

    <section id={content.faq.id} className="mb-6"><h2 className="font-heading text-2xl font-bold text-foreground mb-6">{content.faq.heading}</h2><div className="space-y-4">{content.faq.items.map((item) => <div key={item.question} className="border border-border/40 bg-card/30 p-5"><h3 className="font-heading font-semibold text-foreground mb-2">{item.question}</h3><p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p></div>)}</div></section>

    <div className="border-t border-border/30 pt-6 mt-6"><p className="text-sm text-muted-foreground mb-3">Continue reading:</p><div className="flex flex-wrap gap-3">{content.related.map((article) => <Link key={article.href} href={article.href} className="text-sm text-primary hover:underline flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5" />{article.title}</Link>)}</div></div>
  </KnowledgeHubLayout>;
}
