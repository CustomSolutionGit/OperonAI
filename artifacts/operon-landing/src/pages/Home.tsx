import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Database, Users, LineChart, Cpu, FileSearch, Send, ShieldCheck, CheckCircle2, House } from "lucide-react";
import { trackCalendlyClick, trackCtaClick } from "../lib/analytics";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const primaryCtaClass = "inline-flex min-h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-8 text-lg font-medium text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary))] transition-all hover:brightness-110 sm:w-auto";
const outlineCtaClass = "inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-primary/50 px-4 text-sm font-medium text-primary transition-all hover:bg-primary/10";

export default function Home() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncSupportsHover = () => {
      setSupportsHover(mediaQuery.matches);
    };

    syncSupportsHover();
    mediaQuery.addEventListener("change", syncSupportsHover);

    return () => {
      mediaQuery.removeEventListener("change", syncSupportsHover);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookDemoClick = (location: string) => {
    trackCtaClick("Book a Demo", location);
    trackCalendlyClick(location);
  };

  const handleStepClick = (stepNum: string) => {
    if (supportsHover) return;

    setExpandedStep((currentStep) => (currentStep === stepNum ? null : stepNum));
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="fixed -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Operon AI</span>
          </div>
          <div>
            <a href="https://calendly.com/operonai/30min" target="_blank" rel="noopener noreferrer" onClick={() => handleBookDemoClick("nav") }>
              <span data-testid="cta-book-demo-nav" className={outlineCtaClass}>
                Book a Demo
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        {/* Section 1 - Hero */}
        <section className="container mx-auto px-6 pt-20 pb-32">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-4xl mx-auto text-center flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <ShieldCheck className="w-4 h-4" />
              <span>$2,000 one-time setup</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-8">
              AI SDR employee for cold outreach <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">does 60–80% of SDR work</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Operon is not a SaaS tool. It's your own AI SDR employee — deployed by us, owned by you.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
              <a href="https://calendly.com/operonai/30min" target="_blank" rel="noopener noreferrer" className={primaryCtaClass} data-testid="cta-book-demo-hero" onClick={() => handleBookDemoClick("hero") }>
                <span>Book a Demo</span>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2 - Problems */}
        <section className="container mx-auto px-6 py-24 border-t border-white/5 relative">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold font-display text-center mb-16">
              Why outbound is broken
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={fadeInUp} className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-4">Hiring SDRs is expensive and slow</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You spend months recruiting, onboarding, and managing reps — only to watch them churn in 6–12 months. Average fully-loaded SDR cost: $80,000–$120,000/year.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-4">Your outreach stack is expensive and fragmented</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Apollo, Instantly, warm-up tools, email accounts — and you're still doing half the work manually. More tools don't mean less work.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-6">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-4">Personalization at scale is impossible with humans</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generic "Hi {'{FirstName}'}" emails get ignored. Real personalization takes 20+ minutes per prospect. SDRs choose volume over quality — and results tank.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Section 3 - Workflow */}
        <section id="how-it-works" className="container mx-auto scroll-mt-28 px-6 py-28 relative">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">How Operon works end-to-end</h2>
            <p className="text-xl text-muted-foreground">Seven automated steps. One deployment. </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Center Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 md:-translate-x-1/2" />

            {[
              { num: "1", title: "Lead Search", desc: "AI scans enriched databases to find companies matching your ICP — industry, size, tech stack, signals.", icon: FileSearch },
              { num: "2", title: "Contact Search", desc: "Finds decision-maker contacts at target accounts: name, title, verified email, LinkedIn.", icon: Users },
              { num: "3", title: "Research", desc: "Reads company news, job postings, and signals to build context for each prospect before outreach.", icon: Database },
              { num: "4", title: "Personalization", desc: "Drafts hyper-personalized opening lines and email sequences using the research — not templates.", icon: Cpu },
              { num: "5", title: "Review", desc: "You review and approve sequences before anything sends. Full control, no surprises.", icon: ShieldCheck },
              { num: "6", title: "Campaign Launch", desc: "Approved sequences go live from your own email domain. Deliverability stays yours.", icon: Send },
              { num: "7", title: "Ownership & Control", desc: "All data, all sequences, all results stay in your stack. No vendor lock-in. No data leakage. You own everything.", icon: CheckCircle2 }
            ].map((step, idx) => {
              const isEven = idx % 2 !== 0;
              const Icon = step.icon;
              const isExpanded = expandedStep === step.num;

              return (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 56 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.65 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex items-start justify-between mb-12 md:mb-14 ${isEven ? 'md:flex-row-reverse' : ''} flex-row`}
                  onMouseEnter={() => {
                    if (supportsHover) {
                      setExpandedStep(step.num);
                    }
                  }}
                  onMouseLeave={() => {
                    if (supportsHover) {
                      setExpandedStep((currentStep) => (currentStep === step.num ? null : currentStep));
                    }
                  }}
                >
                  <div className={`hidden md:block w-5/12 ${isEven ? 'text-left' : 'text-right'}`} />
                  
                  {/* Node */}
                  <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 md:-translate-x-1/2 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                    <span className="font-display font-bold text-primary">{step.num}</span>
                  </div>

                  {/* Card */}
                  <div className="w-full md:w-5/12 pl-20 md:pl-0">
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.num)}
                      aria-expanded={isExpanded}
                      className="glass-card w-full rounded-2xl border border-white/5 bg-background/60 p-5 text-left transition-colors duration-300 hover:bg-background/80 md:p-6"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className="h-7 w-7 shrink-0 text-primary" />
                        <h3 className="text-lg md:text-xl font-bold font-display">{step.title}</h3>
                      </div>
                      <div
                        className={`grid transition-all duration-300 ease-out ${isExpanded ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Section 4 - What's Included */}
        <section className="container mx-auto px-6 py-24 border-y border-white/5 bg-white/[0.02]">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Everything you need to run outbound AI</h2>
              <p className="text-primary font-medium">$2,000 one-time setup — no monthly fees, no per-seat pricing</p>
            </motion.div>

          </motion.div>
        </section>

        {/* Section 5 - Ownership Message */}
        <section className="container mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto glass-card p-12 md:p-20 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-8 text-white">You own the AI. Not the other way around.</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 text-left md:text-center">
              No infrastructure? We can host it in the cloud. Prefer your own stack? We can deploy it there too. Either way, the AI works for you — and belongs to you. No lock-in, no hidden dependencies. You pay only after setup, testing, and approval — if you're satisfied with the result.
            </p>
            <div className="text-primary font-medium">
              Run first. Pay after. Own it fully.
            </div>
          </motion.div>
        </section>

        {/* Section 6 - Final CTA */}
        <section className="container mx-auto px-6 py-24 pb-32">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold font-display mb-6">
              Ready to hire your AI SDR employee?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-12">
              $2,000 one-time setup. Book a call and we'll map out your outbound workflow in 30 minutes.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <a href="https://calendly.com/operonai/30min" target="_blank" rel="noopener noreferrer" className={`${primaryCtaClass} min-h-16 px-10 text-xl font-bold`} data-testid="cta-book-demo-footer" onClick={() => handleBookDemoClick("footer") }>
                <span>
                  Book a Demo
                </span>
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
              <span>No monthly fees</span>
              <span className="hidden sm:inline">·</span>
              <span>No data leakage</span>
              <span className="hidden sm:inline">·</span>
              <span>Full ownership</span>
              <span className="hidden sm:inline">·</span>
              <span>Deployed in days</span>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-background/85 text-primary shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-primary/10"
      >
        <House className="h-5 w-5" />
      </button>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Operon AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
