"use client";

import * as React from "react";
import {
  Settings,
  Clock3,
  MessageCircleMore,
  Bot,
  Save,
  Bell,
  ShieldCheck,
  Workflow,
  PlugZap,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SectionHeader({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
      <div className="pr-4">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [businessHoursEnabled, setBusinessHoursEnabled] = React.useState(true);
  const [autoReplyOutsideHours, setAutoReplyOutsideHours] = React.useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = React.useState(true);
  const [botEnabled, setBotEnabled] = React.useState(true);
  const [humanHandoffEnabled, setHumanHandoffEnabled] = React.useState(true);
  const [workflowEnabled, setWorkflowEnabled] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [secureMode, setSecureMode] = React.useState(true);
  const [saveMessage, setSaveMessage] = React.useState("");
  const [connectionMessage, setConnectionMessage] = React.useState("");

  const handleSave = () => {
    setSaveMessage("Paramètres enregistrés avec succès.");
    setTimeout(() => setSaveMessage(""), 2500);
  };

  const handleTestConnection = () => {
    setConnectionMessage("Connexion WhatsApp testée avec succès.");
    setTimeout(() => setConnectionMessage(""), 2500);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
          <p className="text-sm text-muted-foreground">
            Configure WhatsApp, l’assistant IA, les workflows automatiques et les préférences globales.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>

          <Button
            onClick={handleSave}
            className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      {saveMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      ) : null}

      {connectionMessage ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {connectionMessage}
        </div>
      ) : null}

      <div className="grid gap-6">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Configuration WhatsApp"
              description="Paramètres liés au numéro Business, au webhook et à l’état de connexion."
              icon={<MessageCircleMore className="h-5 w-5" />}
              action={
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Connecté
                </Badge>
              }
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Numéro WhatsApp Business</Label>
                <Input defaultValue="+216 70 000 000" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Nom affiché</Label>
                <Input defaultValue="Support Brand" className="rounded-xl" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  defaultValue="https://api.my-platform.com/webhooks/whatsapp"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Verify token</Label>
                <Input defaultValue="support-whatsapp-token" className="rounded-xl" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone Number ID</Label>
                <Input defaultValue="572001245879001" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Business Account ID</Label>
                <Input defaultValue="104550889210022" className="rounded-xl" />
              </div>
            </div>

            <SettingToggle
              label="Notifications WhatsApp"
              description="Active les alertes lors de nouveaux messages ou événements importants."
              checked={whatsappNotifications}
              onCheckedChange={setWhatsappNotifications}
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-xl" onClick={handleTestConnection}>
                <PlugZap className="mr-2 h-4 w-4" />
                Tester la connexion
              </Button>

              <Button variant="outline" className="rounded-xl">
                Copier le webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Horaires de support"
              description="Définis les heures de disponibilité du service client et la réponse hors horaires."
              icon={<Clock3 className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <SettingToggle
              label="Activer les horaires d’ouverture"
              description="Le système prendra en compte les plages horaires définies."
              checked={businessHoursEnabled}
              onCheckedChange={setBusinessHoursEnabled}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Lundi - Vendredi</Label>
                <Input defaultValue="08:00 - 18:00" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Samedi</Label>
                <Input defaultValue="09:00 - 13:00" className="rounded-xl" />
              </div>
            </div>

            <SettingToggle
              label="Réponse automatique hors horaires"
              description="Envoie un message automatique si un client écrit en dehors des heures."
              checked={autoReplyOutsideHours}
              onCheckedChange={setAutoReplyOutsideHours}
            />

            <div className="space-y-2">
              <Label>Message hors horaires</Label>
              <Textarea
                defaultValue="Merci pour votre message. Notre équipe vous répondra dès la prochaine ouverture."
                className="min-h-[100px] rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Assistant IA"
              description="Configure le comportement du bot, le handoff humain et les règles d’escalade."
              icon={<Bot className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <SettingToggle
              label="Activer le bot"
              description="L’assistant IA répond automatiquement aux conversations entrantes."
              checked={botEnabled}
              onCheckedChange={setBotEnabled}
            />

            <SettingToggle
              label="Activer handoff humain"
              description="Permet le transfert vers un agent humain selon les règles définies."
              checked={humanHandoffEnabled}
              onCheckedChange={setHumanHandoffEnabled}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Confiance minimale du bot (%)</Label>
                <Input defaultValue="75" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Délai max avant escalade (min)</Label>
                <Input defaultValue="5" className="rounded-xl" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ton de réponse</Label>
                <Input defaultValue="Professionnel" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Langue par défaut du bot</Label>
                <Input defaultValue="Français" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instruction système principale</Label>
              <Textarea
                defaultValue="Réponds de manière claire, concise et professionnelle. Si la demande est complexe, propose un transfert vers un agent humain."
                className="min-h-[120px] rounded-xl"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-xl">
                Tester l’assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Workflow automatique"
              description="Définis comment les messages sont traités, tagués et escaladés automatiquement."
              icon={<Workflow className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <SettingToggle
              label="Activer le workflow automatique"
              description="Le système applique automatiquement les règles de traitement et de routage."
              checked={workflowEnabled}
              onCheckedChange={setWorkflowEnabled}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tag automatique principal</Label>
                <Input defaultValue="SupportWhatsApp" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Agent par défaut</Label>
                <Input defaultValue="Equipe Support" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message d’accueil automatique</Label>
              <Textarea
                defaultValue="Bonjour 👋 Merci de nous avoir contactés sur WhatsApp. Notre assistant analyse votre demande et vous répond immédiatement."
                className="min-h-[100px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Message avant transfert à un agent</Label>
              <Textarea
                defaultValue="Votre demande nécessite une vérification complémentaire. Un agent humain va prendre le relais."
                className="min-h-[100px] rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Préférences générales"
              description="Préférences globales de la plateforme, notifications et sécurité."
              icon={<Settings className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom de l’entreprise</Label>
                <Input defaultValue="My Support Company" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Email support</Label>
                <Input defaultValue="support@company.com" className="rounded-xl" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Langue par défaut</Label>
                <Input defaultValue="Français" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Input defaultValue="Africa/Tunis" className="rounded-xl" />
              </div>
            </div>

            <SettingToggle
              label="Notifications email"
              description="Reçois les notifications système par email."
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />

            <SettingToggle
              label="Mode sécurisé"
              description="Renforce certaines validations et protections internes."
              checked={secureMode}
              onCheckedChange={setSecureMode}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </div>
                  <p className="text-sm">
                    Les alertes WhatsApp et les notifications email peuvent être ajustées ici.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    Sécurité
                  </div>
                  <p className="text-sm">
                    Vérifie régulièrement les paramètres sensibles et l’accès aux intégrations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}