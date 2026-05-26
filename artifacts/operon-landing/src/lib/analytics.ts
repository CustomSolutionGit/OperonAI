declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getClientName(): string | null {
  return new URLSearchParams(window.location.search).get("client");
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackCtaClick(label: string, location: string): void {
  const clientName = getClientName();

  trackEvent("cta_click", {
    cta_label: label,
    cta_location: location,
    ...(clientName ? { client_name: clientName } : {}),
  });
}

export function trackCalendlyClick(location: string): void {
  const clientName = getClientName();

  trackEvent("calendly_open", {
    destination: "https://calendly.com/operonai/30min",
    cta_location: location,
    ...(clientName ? { client_name: clientName } : {}),
  });
}
