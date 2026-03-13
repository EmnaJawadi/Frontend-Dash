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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-xl bg-muted p-2 text-muted-foreground">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [businessHoursEnabled, setBusinessHoursEnabled] = React.useState(true);
  const [autoReplyOutsideHours, setAutoReplyOutsideHours] = React.useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = React.useState(true);
  const [botEnabled, setBotEnabled] = React.useState(true);
  const [humanHandoffEnabled, setHumanHandoffEnabled] = React.useState(true);
  const [saveMessage, setSaveMessage] = React.useState("");

  const handleSave = () => {
    setSaveMessage("Paramètres enregistrés avec succès.");
    setTimeout(() => setSaveMessage(""), 2500);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure les horaires, WhatsApp, l’IA et les préférences générales.
          </p>
        </div>

        <Button onClick={handleSave} className="rounded-xl">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      {saveMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      ) : null}

      <div className="grid gap-6">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Business Hours"
              description="Définis les horaires de disponibilité du support."
              icon={<Clock3 className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">
                  Activer les horaires d’ouverture
                </Label>
                <p className="text-sm text-muted-foreground">
                  Le système prendra en compte les plages horaires définies.
                </p>
              </div>
              <Switch
                checked={businessHoursEnabled}
                onCheckedChange={setBusinessHoursEnabled}
              />
            </div>

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

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">
                  Réponse automatique hors horaires
                </Label>
                <p className="text-sm text-muted-foreground">
                  Envoie un message automatique si un client écrit en dehors des heures.
                </p>
              </div>
              <Switch
                checked={autoReplyOutsideHours}
                onCheckedChange={setAutoReplyOutsideHours}
              />
            </div>

            <div className="space-y-2">
              <Label>Message hors horaires</Label>
              <Textarea
                defaultValue="Merci pour votre message. Notre équipe vous répondra dès la prochaine ouverture."
                className="min-h-[100px] rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <SectionHeader
              title="WhatsApp Settings"
              description="Gère les paramètres liés au canal WhatsApp."
              icon={<MessageCircleMore className="h-5 w-5" />}
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

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">Notifications WhatsApp</Label>
                <p className="text-sm text-muted-foreground">
                  Active les alertes lors de nouveaux messages ou événements.
                </p>
              </div>
              <Switch
                checked={whatsappNotifications}
                onCheckedChange={setWhatsappNotifications}
              />
            </div>

            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                defaultValue="https://api.my-platform.com/webhooks/whatsapp"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <SectionHeader
              title="AI Settings"
              description="Paramètres de l’assistant IA et des escalades."
              icon={<Bot className="h-5 w-5" />}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">Activer le bot</Label>
                <p className="text-sm text-muted-foreground">
                  L’assistant IA répond automatiquement aux conversations entrantes.
                </p>
              </div>
              <Switch checked={botEnabled} onCheckedChange={setBotEnabled} />
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">Activer handoff humain</Label>
                <p className="text-sm text-muted-foreground">
                  Permet le transfert vers un agent humain selon les règles définies.
                </p>
              </div>
              <Switch
                checked={humanHandoffEnabled}
                onCheckedChange={setHumanHandoffEnabled}
              />
            </div>

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

            <div className="space-y-2">
              <Label>Instruction système principale</Label>
              <Textarea
                defaultValue="Réponds de manière claire, concise et professionnelle. Si la demande est complexe, propose un transfert vers un agent humain."
                className="min-h-[120px] rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <SectionHeader
              title="General Settings"
              description="Préférences globales de la plateforme."
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

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">Notifications email</Label>
                <p className="text-sm text-muted-foreground">
                  Reçois les notifications système par email.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-medium">Mode sécurisé</Label>
                <p className="text-sm text-muted-foreground">
                  Renforce certaines validations et protections internes.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border shadow-sm">
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

          <Card className="rounded-2xl border shadow-sm">
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
      </div>
    </div>
  );
}