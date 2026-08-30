const OPENAI_ADS_PIXEL_ID = "RfmMBNhDLXgfHCoWA9pQSA";
const OPENAI_ADS_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
const OPENAI_ADS_SDK_ID = "openai-ads-measurement-sdk";
const CONSENT_KEY = "de_cookie_consent";
const CONSENT_VERSION = 2;
const CONSENT_PURPOSE = "analytics_ad_measurement_openai_ads";

type ConsentStatus = "accepted" | "declined";

type VersionedConsent = {
  status: ConsentStatus;
  version: number;
  purposes: {
    analytics: boolean;
    openaiAdsMeasurement: boolean;
  };
  updatedAt: string;
};

type OpenAiQueue = {
  (...args: unknown[]): void;
  q?: unknown[][];
};

type OpenAiAdsState = {
  sdkLoading: boolean;
  initialized: boolean;
  measurementEnabled: boolean;
};

declare global {
  interface Window {
    oaiq?: OpenAiQueue;
    __openAiAdsPixelState?: OpenAiAdsState;
  }
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function parseVersionedConsent(raw: string | null): VersionedConsent | null {
  if (!raw || raw === "accepted" || raw === "declined") return null;
  try {
    const parsed = JSON.parse(raw) as Partial<VersionedConsent>;
    if (
      parsed.version === CONSENT_VERSION &&
      (parsed.status === "accepted" || parsed.status === "declined") &&
      parsed.purposes?.openaiAdsMeasurement === (parsed.status === "accepted")
    ) {
      return parsed as VersionedConsent;
    }
  } catch {
    return null;
  }
  return null;
}

export function getMeasurementConsent(): ConsentStatus | null {
  const raw = getStorage()?.getItem(CONSENT_KEY) ?? null;
  return parseVersionedConsent(raw)?.status ?? null;
}

export function hasLegacyGa4Consent(): boolean {
  return getStorage()?.getItem(CONSENT_KEY) === "accepted";
}

export function hasCurrentMeasurementConsent(): boolean {
  return getMeasurementConsent() === "accepted";
}

export function setMeasurementConsent(status: ConsentStatus) {
  const storage = getStorage();
  if (!storage) return;

  const accepted = status === "accepted";
  const consent: VersionedConsent = {
    status,
    version: CONSENT_VERSION,
    purposes: {
      analytics: accepted,
      openaiAdsMeasurement: accepted,
    },
    updatedAt: new Date().toISOString(),
  };

  storage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent(`${CONSENT_KEY}:changed`, {
      detail: {
        status,
        version: CONSENT_VERSION,
        purpose: CONSENT_PURPOSE,
      },
    })
  );

  if (accepted) {
    loadOpenAiAdsPixelIfConsented();
  } else {
    disableOpenAiAdsMeasurement();
  }
}

export function shouldShowConsentBanner(): boolean {
  return getMeasurementConsent() === null;
}

function getState(): OpenAiAdsState {
  window.__openAiAdsPixelState ??= {
    sdkLoading: false,
    initialized: false,
    measurementEnabled: false,
  };
  return window.__openAiAdsPixelState;
}

function ensureOpenAiQueue() {
  if (window.oaiq) return;
  const oaiq: OpenAiQueue = (...args: unknown[]) => {
    oaiq.q ??= [];
    oaiq.q.push(args);
  };
  window.oaiq = oaiq;
}

export function isOpenAiAdsDebugEnabled(mode = import.meta.env.MODE, hostname = typeof window === "undefined" ? "" : window.location.hostname) {
  if (mode === "production") return false;
  return mode === "development" || mode === "staging" || hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("staging");
}

export function loadOpenAiAdsPixelIfConsented() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!hasCurrentMeasurementConsent()) return false;

  const state = getState();
  state.measurementEnabled = true;
  ensureOpenAiQueue();
  window.oaiq?.("consent", true);

  if (!state.initialized) {
    const initOptions: { pixelId: string; debug?: boolean } = {
      pixelId: OPENAI_ADS_PIXEL_ID,
    };
    if (isOpenAiAdsDebugEnabled()) initOptions.debug = true;
    window.oaiq?.("init", initOptions);
    state.initialized = true;
  }

  if (!document.getElementById(OPENAI_ADS_SDK_ID) && !state.sdkLoading) {
    const script = document.createElement("script");
    script.id = OPENAI_ADS_SDK_ID;
    script.async = true;
    script.src = OPENAI_ADS_SDK_URL;
    document.head.appendChild(script);
    state.sdkLoading = true;
  }

  return true;
}

export function disableOpenAiAdsMeasurement() {
  if (typeof window === "undefined") return;
  const state = getState();
  state.measurementEnabled = false;
  if (window.oaiq) window.oaiq("consent", false);
}

export function canUseOpenAiAdsMeasurement() {
  if (typeof window === "undefined") return false;
  return Boolean(window.__openAiAdsPixelState?.measurementEnabled && hasCurrentMeasurementConsent());
}

export function reportOpenAiAdsLeadCreated() {
  if (typeof window === "undefined") return false;
  const state = window.__openAiAdsPixelState;
  if (!state?.measurementEnabled || !state.initialized || !hasCurrentMeasurementConsent() || !window.oaiq) return false;

  try {
    window.oaiq("measure", "lead_created", { type: "customer_action" });
    return true;
  } catch {
    return false;
  }
}
