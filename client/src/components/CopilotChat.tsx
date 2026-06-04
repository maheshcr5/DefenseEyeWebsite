import { useEffect, useMemo, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Bot, ExternalLink, Loader2, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: Citation[];
}

interface Citation {
  id: string;
  label: string;
  title: string;
  url: string;
  type: string;
  score: number;
}

const SUGGESTED_PROMPTS = [
  "Explain AC.L2-3.1.1",
  "How do I scope CUI?",
  "What evidence is required for IA.L2-3.5.3?",
  "What is an SSP?",
  "What is an SPRS score?",
];

function newId() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
}

export function CopilotChat({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("defenseeye-copilot-history");
      if (saved) return JSON.parse(saved) as ChatMessage[];
    } catch {
      // Ignore invalid local history.
    }
    return [
      {
        id: newId(),
        role: "assistant",
        content:
          "I can help with CMMC, NIST SP 800-171, DFARS, SPRS, CUI scoping, FedRAMP, RMF, and assessment readiness. Ask a control question or describe your compliance problem.",
      },
    ];
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("defenseeye-copilot-history", JSON.stringify(messages.slice(-20)));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const hasUserMessages = useMemo(() => messages.some((message) => message.role === "user"), [messages]);

  async function sendMessage(value = input) {
    const text = value.trim();
    if (!text || isStreaming) return;

    const userMessage: ChatMessage = { id: newId(), role: "user", content: text };
    const assistantId = newId();
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "", sources: [] },
    ]);
    setInput("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/copilot/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The Copilot API is unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const eventText of events) {
          const event = parseSseEvent(eventText);
          if (!event) continue;
          if (event.event === "sources") {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId ? { ...message, sources: event.data as Citation[] } : message
              )
            );
          }
          if (event.event === "token") {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: `${message.content}${String(event.data)}` }
                  : message
              )
            );
          }
          if (event.event === "error") {
            throw new Error((event.data as { error?: string }).error || "The stream failed.");
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "The Copilot could not answer right now.";
      setError(message);
      setMessages((current) =>
        current.map((chatMessage) =>
          chatMessage.id === assistantId
            ? { ...chatMessage, content: "I could not generate a response. Please try again in a moment." }
            : chatMessage
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border border-border/40 bg-background text-foreground shadow-2xl shadow-black/20",
        compact ? "rounded-md" : "rounded-lg"
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 bg-card/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
            <ShieldCheck className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold leading-none">CMMC Copilot</h2>
            <p className="mt-1 text-xs text-muted-foreground">Grounded on DefenseEye KnowledgeHub and authoritative sources</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" && "justify-end")}>
              {message.role === "assistant" && (
                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "border-primary/40 bg-primary text-primary-foreground"
                    : "border-border/50 bg-card/70"
                )}
              >
                {message.content ? (
                  message.role === "assistant" ? (
                    <Streamdown
                      className="prose prose-invert max-w-none prose-p:my-2 prose-headings:mb-2 prose-headings:mt-3 prose-li:my-0.5 prose-a:text-primary"
                      isAnimating={isStreaming}
                    >
                      {message.content}
                    </Streamdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Reading the sources...</span>
                  </div>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border/30 pt-3">
                    {message.sources.slice(0, 5).map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1 rounded-sm border border-border/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <span className="shrink-0">{source.label}</span>
                        <span className="truncate">{source.title}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!hasUserMessages && (
        <div className="border-t border-border/30 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Suggested prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-sm border border-border/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="border-t border-destructive/30 px-4 py-2 text-xs text-destructive">{error}</div>}

      <form
        className="flex gap-2 border-t border-border/40 bg-card/30 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about CMMC, DFARS, SPRS, CUI, or assessment readiness..."
          className="max-h-32 min-h-11 resize-none bg-background/80 text-sm"
          maxLength={3000}
        />
        <Button type="submit" size="icon" disabled={isStreaming || !input.trim()} aria-label="Send message">
          {isStreaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  );
}

function parseSseEvent(raw: string) {
  const lines = raw.split("\n");
  const event = lines.find((line) => line.startsWith("event: "))?.slice(7);
  const dataLine = lines.find((line) => line.startsWith("data: "))?.slice(6);
  if (!event || !dataLine) return null;
  return { event, data: JSON.parse(dataLine) as unknown };
}
