import { beforeEach, describe, expect, it, vi } from "vitest";

const tracking = vi.hoisted(() => ({ trackConversion: vi.fn() }));
vi.mock("@/lib/tracking", () => tracking);

import {
  NEWSLETTER_MESSAGES,
  NEWSLETTER_PROVIDER,
  createNewsletterGuard,
  submitNewsletterSignup,
  validateNewsletterEmail,
  type NewsletterProvider,
} from "./newsletter";

const accepting = (): NewsletterProvider => ({ name: "test-provider", subscribe: vi.fn().mockResolvedValue(undefined) });
const failing = (): NewsletterProvider => ({ name: "test-provider", subscribe: vi.fn().mockRejectedValue(new Error("provider down")) });

describe("newsletter signup", () => {
  beforeEach(() => tracking.trackConversion.mockClear());

  it("has no provider configured, so the site cannot claim a subscription", async () => {
    expect(NEWSLETTER_PROVIDER).toBeNull();
    const result = await submitNewsletterSignup("ada@example.com", NEWSLETTER_PROVIDER, createNewsletterGuard(), "blog");
    expect(result).toEqual({ status: "unavailable", message: NEWSLETTER_MESSAGES.unavailable });
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });

  it("rejects an empty email without calling the provider", async () => {
    const provider = accepting();
    expect(validateNewsletterEmail("   ")).toBe(NEWSLETTER_MESSAGES.empty);
    const result = await submitNewsletterSignup("", provider, createNewsletterGuard(), "blog");
    expect(result.status).toBe("invalid");
    expect(result.message).toBe(NEWSLETTER_MESSAGES.empty);
    expect(provider.subscribe).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling the provider", async () => {
    const provider = accepting();
    const result = await submitNewsletterSignup("ada@example", provider, createNewsletterGuard(), "blog");
    expect(result).toEqual({ status: "invalid", message: NEWSLETTER_MESSAGES.invalid });
    expect(provider.subscribe).not.toHaveBeenCalled();
  });

  it("accepts a valid email and reports success only after the provider accepts it", async () => {
    const provider = accepting();
    expect(validateNewsletterEmail(" ada@example.com ")).toBeNull();
    const result = await submitNewsletterSignup(" ada@example.com ", provider, createNewsletterGuard(), "knowledge_hub");
    expect(provider.subscribe).toHaveBeenCalledWith("ada@example.com");
    expect(result).toEqual({ status: "success", message: NEWSLETTER_MESSAGES.success });
  });

  it("reports a visible error, not success, when the provider fails", async () => {
    const provider = failing();
    const guard = createNewsletterGuard();
    const result = await submitNewsletterSignup("ada@example.com", provider, guard, "blog");
    expect(result).toEqual({ status: "error", message: NEWSLETTER_MESSAGES.error });
    expect(guard.completed).toBe(false);
    expect(guard.inFlight).toBe(false);
  });

  it("ignores duplicate submissions while one is in flight and after success", async () => {
    let release: () => void = () => undefined;
    const provider: NewsletterProvider = { name: "slow", subscribe: vi.fn(() => new Promise<void>((resolve) => (release = resolve))) };
    const guard = createNewsletterGuard();
    const first = submitNewsletterSignup("ada@example.com", provider, guard, "blog");
    const second = await submitNewsletterSignup("ada@example.com", provider, guard, "blog");
    expect(second.status).toBe("duplicate");
    release();
    expect((await first).status).toBe("success");
    expect((await submitNewsletterSignup("ada@example.com", provider, guard, "blog")).status).toBe("duplicate");
    expect(provider.subscribe).toHaveBeenCalledTimes(1);
  });

  it("allows a retry after a provider failure", async () => {
    const provider: NewsletterProvider = { name: "flaky", subscribe: vi.fn().mockRejectedValueOnce(new Error("x")).mockResolvedValueOnce(undefined) };
    const guard = createNewsletterGuard();
    expect((await submitNewsletterSignup("ada@example.com", provider, guard, "blog")).status).toBe("error");
    expect((await submitNewsletterSignup("ada@example.com", provider, guard, "blog")).status).toBe("success");
  });

  it("fires analytics on success and failure without the email address", async () => {
    await submitNewsletterSignup("ada@example.com", accepting(), createNewsletterGuard(), "blog");
    await submitNewsletterSignup("bob@example.com", failing(), createNewsletterGuard(), "knowledge_hub");
    expect(tracking.trackConversion).toHaveBeenNthCalledWith(1, "newsletter_subscribe", { location: "blog", provider: "test-provider" });
    expect(tracking.trackConversion).toHaveBeenNthCalledWith(2, "newsletter_subscribe_failed", { location: "knowledge_hub", provider: "test-provider" });
    expect(JSON.stringify(tracking.trackConversion.mock.calls)).not.toMatch(/@example\.com/);
  });

  it("does not track anything for invalid input", async () => {
    await submitNewsletterSignup("nope", accepting(), createNewsletterGuard(), "blog");
    expect(tracking.trackConversion).not.toHaveBeenCalled();
  });
});
