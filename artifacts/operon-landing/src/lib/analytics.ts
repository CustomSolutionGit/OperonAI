declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return;

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`,
  );

  const script = existingScript ?? document.createElement("script");

  if (!existingScript) {
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];

  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  window.gtag = window.gtag ?? gtag;
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: `${window.location.pathname}${window.location.hash}`,
  });
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackCtaClick(label: string, location: string): void {
  trackEvent("cta_click", {
    cta_label: label,
    cta_location: location,
  });
}

export function trackCalendlyClick(location: string): void {
  trackEvent("calendly_open", {
    destination: "https://calendly.com/operonai/30min",
    cta_location: location,
  });
}
