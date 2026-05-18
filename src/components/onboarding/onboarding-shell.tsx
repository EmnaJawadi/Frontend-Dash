import type { ReactNode } from "react";

type OnboardingShellProps = {
  currentStep: 1 | 2 | 3;
  title: string;
  description: string;
  children: ReactNode;
};

const steps = [
  { id: 1, label: "Votre equipe" },
  { id: 2, label: "Configuration initiale" },
  { id: 3, label: "Finalisation" },
] as const;

export function OnboardingShell({
  currentStep,
  title,
  description,
  children,
}: OnboardingShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 md:px-6">
      <section className="w-full max-w-6xl rounded-[1.65rem] border border-border/80 bg-card/80 p-6 shadow-[0_24px_70px_rgba(30,64,175,0.14)] backdrop-blur-2xl md:p-8">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-foreground/80">
            Onboarding
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Bienvenue dans Centre Support
          </h1>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">
            Configurez votre equipe et vos preferences pour tirer le meilleur parti de la plateforme.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const active = step.id === currentStep;
            const done = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-extrabold ${
                    active || done
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="min-w-0">
                  <p className={active ? "font-bold text-primary" : "font-semibold text-muted-foreground"}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[1.35rem] border border-border/80 bg-background/60 p-5 shadow-sm md:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
