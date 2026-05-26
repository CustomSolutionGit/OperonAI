declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!window.gtag) return;
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
