import type { ReactNode } from "react";
import Image from "next/image";
import { Bot, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

type AuthHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  panelTitle: string;
  panelDescription: string;
  highlights?: AuthHighlight[];
  children: ReactNode;
  footer?: ReactNode;
};

const defaultHighlights: AuthHighlight[] = [
  {
    title: "Reponses plus rapides",
    description: "Unifiez les conversations et assignez vos agents en quelques clics.",
    icon: Zap,
  },
  {
    title: "Qualite constante",
    description: "Le bot propose des reponses et apprend des transferts vers les humains.",
    icon: Bot,
  },
  {
    title: "Controle et securite",
    description: "Roles, permissions et suivi d'activite pour toute votre equipe.",
    icon: ShieldCheck,
  },
];

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  panelTitle,
  panelDescription,
  highlights = defaultHighlights,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="auth-layout flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Image src="/logopfe.png" alt="Centre Support" width={54} height={54} className="h-12 w-12 object-contain" priority />
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-foreground">Centre Support</p>
            <p className="text-sm font-medium text-emerald-500">WhatsApp Entreprise</p>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border border-border/80 bg-card/70 shadow-[0_24px_70px_rgba(30,64,175,0.14)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 p-10 text-white lg:flex lg:flex-col">
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                Experience premium
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight">{panelTitle}</h2>
              <p className="mt-3 max-w-xl text-sm text-cyan-50/95">{panelDescription}</p>
            </div>

            <div className="relative mt-8 space-y-3">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <article
                    key={highlight.title}
                    className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{highlight.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-cyan-50/95">{highlight.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="auth-form-panel rounded-none border-0 shadow-none fade-up">
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
              <h1 className="text-2xl font-extrabold leading-tight text-foreground md:text-[2.05rem]">{title}</h1>
              <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-muted/45 p-2 text-center lg:hidden">
              {highlights.slice(0, 3).map((highlight) => (
                <div key={highlight.title} className="rounded-xl bg-background/75 px-2 py-2">
                  <p className="text-[11px] font-semibold text-foreground">{highlight.title}</p>
                </div>
              ))}
            </div>

            {children}

            {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
