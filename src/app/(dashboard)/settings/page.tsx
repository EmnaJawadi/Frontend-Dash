"use client";

import * as React from "react";
import {
  Bot,
  Clock3,
  MessageCircleMore,
  RefreshCw,
  Save,
  Settings,
  Workflow,
} from "lucide-react";
import RoleGuard from "@/src/components/layout/role-guard";
import { useSettings } from "@/src/features/settings/hooks/use-settings";
import type {
  BusinessHoursDay,
  CompanySettingsData,
} from "@/src/features/settings/types/settings.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const WEEKDAYS = new Set(["monday", "tuesday", "wednesday", "thursday", "friday"]);

function cloneSettings(value: CompanySettingsData): CompanySettingsData {
  return JSON.parse(JSON.stringify(value)) as CompanySettingsData;
}

function getRangeFromDays(
  days: BusinessHoursDay[],
  predicate: (day: string) => boolean,
) {
  const first = days.find((item) => predicate(item.day));
  return first ? `${first.start} - ${first.end}` : "";
}

function parseRange(input: string, fallbackStart: string, fallbackEnd: string) {
  const parts = input.split("-").map((item) => item.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { start: fallbackStart, end: fallbackEnd };
  }
  return { start: parts[0], end: parts[1] };
}

function applyHourRanges(
  days: BusinessHoursDay[],
  weekdaysRange: string,
  saturdayRange: string,
): BusinessHoursDay[] {
  return days.map((item) => {
    if (WEEKDAYS.has(item.day)) {
      const parsed = parseRange(weekdaysRange, item.start, item.end);
      return { ...item, active: true, start: parsed.start, end: parsed.end };
    }
    if (item.day === "saturday") {
      if (!saturdayRange.trim()) return { ...item, active: false };
      const parsed = parseRange(saturdayRange, item.start, item.end);
      return { ...item, active: true, start: parsed.start, end: parsed.end };
    }
    return item;
  });
}

export default function SettingsPage() {
  const { data, isLoading, isSaving, error, saveError, refetch, saveSettings } =
    useSettings();
  const [form, setForm] = React.useState<CompanySettingsData | null>(null);
  const [weekdaysHours, setWeekdaysHours] = React.useState("");
  const [saturdayHours, setSaturdayHours] = React.useState("");
  const [saveMessage, setSaveMessage] = React.useState("");
  const [connectionMessage, setConnectionMessage] = React.useState("");

  React.useEffect(() => {
    if (!data) return;
    const cloned = cloneSettings(data);
    setForm(cloned);
    setWeekdaysHours(
      getRangeFromDays(cloned.businessHours.days, (day) => WEEKDAYS.has(day)),
    );
    setSaturdayHours(
      getRangeFromDays(cloned.businessHours.days, (day) => day === "saturday"),
    );
  }, [data]);

  const resetForm = () => {
    if (!data) return;
    const cloned = cloneSettings(data);
    setForm(cloned);
    setWeekdaysHours(
      getRangeFromDays(cloned.businessHours.days, (day) => WEEKDAYS.has(day)),
    );
    setSaturdayHours(
      getRangeFromDays(cloned.businessHours.days, (day) => day === "saturday"),
    );
    setSaveMessage("");
    setConnectionMessage("");
  };

  const onSave = async () => {
    if (!form) return;
    try {
      const saved = await saveSettings({
        businessHours: {
          ...form.businessHours,
          days: applyHourRanges(form.businessHours.days, weekdaysHours, saturdayHours),
        },
        aiPolicy: {
          enabled: form.aiPolicy.enabled,
          handoffEnabled: form.aiPolicy.handoffEnabled,
          escalationDelayMinutes: form.aiPolicy.escalationDelayMinutes,
          responseTone: form.aiPolicy.responseTone,
          language: form.aiPolicy.language,
          botGuidelines: form.aiPolicy.botGuidelines,
        },
        workflow: {
          enabled: form.workflow.enabled,
          defaultAssignment: form.workflow.defaultAssignment,
          welcomeMessage: form.workflow.welcomeMessage,
          preHandoffMessage: form.workflow.preHandoffMessage,
        },
        general: {
          companyName: form.general.companyName,
          supportEmail: form.general.supportEmail,
          defaultLanguage: form.general.defaultLanguage,
          timezone: form.general.timezone,
          emailNotifications: form.general.emailNotifications,
        },
        whatsappProfile: {
          businessPhoneNumber: form.whatsappProfile.businessPhoneNumber,
          displayName: form.whatsappProfile.displayName,
          phoneNumberId: form.whatsappProfile.phoneNumberId,
          businessAccountId: form.whatsappProfile.businessAccountId,
          connectionStatus: form.whatsappProfile.connectionStatus,
        },
      });
      const cloned = cloneSettings(saved);
      setForm(cloned);
      setWeekdaysHours(
        getRangeFromDays(cloned.businessHours.days, (day) => WEEKDAYS.has(day)),
      );
      setSaturdayHours(
        getRangeFromDays(cloned.businessHours.days, (day) => day === "saturday"),
      );
      setSaveMessage("Parametres entreprise enregistres avec succes.");
      setTimeout(() => setSaveMessage(""), 2500);
    } catch {
      setSaveMessage("");
    }
  };

  const onTestConnection = async () => {
    try {
      await refetch();
      setConnectionMessage("Verification de la connexion terminee.");
      setTimeout(() => setConnectionMessage(""), 2500);
    } catch {
      setConnectionMessage("Echec du test de connexion.");
      setTimeout(() => setConnectionMessage(""), 2500);
    }
  };

  return (
    <RoleGuard allowedRoles={["OWNER"]}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Parametres entreprise
            </h1>
            <p className="text-sm text-muted-foreground">
              Parametres metier de votre entreprise (bot, workflow, horaires et
              preferences).
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reinitialiser
            </Button>
            <Button onClick={onSave} disabled={isSaving || !form}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Chargement des parametres...
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-red-700">{error}</p>
              <Button onClick={() => void refetch()}>Reessayer</Button>
            </CardContent>
          </Card>
        ) : null}

        {saveMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {saveMessage}
          </div>
        ) : null}
        {saveError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        ) : null}
        {connectionMessage ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {connectionMessage}
          </div>
        ) : null}

        {!form ? null : (
          <>
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircleMore className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">
                    Configuration WhatsApp
                  </h2>
                </div>
                <Badge>
                  {form.whatsappProfile.connectionStatus === "connected"
                    ? "Connecte"
                    : "Deconnecte"}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Numero WhatsApp Business</Label>
                  <Input
                    value={form.whatsappProfile.businessPhoneNumber}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              whatsappProfile: {
                                ...prev.whatsappProfile,
                                businessPhoneNumber: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom affiche</Label>
                  <Input
                    value={form.whatsappProfile.displayName}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              whatsappProfile: {
                                ...prev.whatsappProfile,
                                displayName: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input
                    value={form.whatsappProfile.phoneNumberId}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              whatsappProfile: {
                                ...prev.whatsappProfile,
                                phoneNumberId: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Account ID</Label>
                  <Input
                    value={form.whatsappProfile.businessAccountId}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              whatsappProfile: {
                                ...prev.whatsappProfile,
                                businessAccountId: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Button variant="outline" onClick={onTestConnection}>
                    Tester la connexion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Clock3 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Horaires de support</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">Activer les horaires</p>
                  </div>
                  <Switch
                    checked={form.businessHours.enabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              businessHours: { ...prev.businessHours, enabled: checked },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Lundi - Vendredi</Label>
                    <Input
                      value={weekdaysHours}
                      onChange={(e) => setWeekdaysHours(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Samedi</Label>
                    <Input
                      value={saturdayHours}
                      onChange={(e) => setSaturdayHours(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Input
                    value={form.businessHours.timezone}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                timezone: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">Reponse auto hors horaires</p>
                  </div>
                  <Switch
                    checked={form.businessHours.autoReplyOutsideHours}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                autoReplyOutsideHours: checked,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message hors horaires</Label>
                  <Textarea
                    value={form.businessHours.outOfHoursMessage}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                outOfHoursMessage: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Bot className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Assistant IA</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <p className="font-medium">Activer le bot</p>
                  <Switch
                    checked={form.aiPolicy.enabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? { ...prev, aiPolicy: { ...prev.aiPolicy, enabled: checked } }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <p className="font-medium">Activer handoff humain</p>
                  <Switch
                    checked={form.aiPolicy.handoffEnabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              aiPolicy: { ...prev.aiPolicy, handoffEnabled: checked },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Confiance minimale (%)</Label>
                    <Input
                      value={String(Math.round(form.aiPolicy.confidenceThreshold * 100))}
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Gere par la plateforme (lecture seule).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Delai max avant escalade (min)</Label>
                    <Input
                      value={String(form.aiPolicy.escalationDelayMinutes)}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (!Number.isFinite(n)) return;
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiPolicy: {
                                  ...prev.aiPolicy,
                                  escalationDelayMinutes: Math.max(
                                    0,
                                    Math.trunc(n),
                                  ),
                                },
                              }
                            : prev,
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ton de reponse</Label>
                    <Input
                      value={form.aiPolicy.responseTone}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiPolicy: {
                                  ...prev.aiPolicy,
                                  responseTone: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Langue par defaut</Label>
                    <Input
                      value={form.aiPolicy.language}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiPolicy: { ...prev.aiPolicy, language: e.target.value },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Consignes du bot</Label>
                  <Textarea
                    value={form.aiPolicy.botGuidelines}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              aiPolicy: {
                                ...prev.aiPolicy,
                                botGuidelines: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Workflow className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Workflow automatique</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <p className="font-medium">Activer workflow</p>
                  <Switch
                    checked={form.workflow.enabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? { ...prev, workflow: { ...prev.workflow, enabled: checked } }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignation par defaut</Label>
                  <Input
                    value={form.workflow.defaultAssignment}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflow: {
                                ...prev.workflow,
                                defaultAssignment: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message d'accueil</Label>
                  <Textarea
                    value={form.workflow.welcomeMessage}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflow: {
                                ...prev.workflow,
                                welcomeMessage: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message avant handoff</Label>
                  <Textarea
                    value={form.workflow.preHandoffMessage}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflow: {
                                ...prev.workflow,
                                preHandoffMessage: e.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Preferences entreprise</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nom entreprise</Label>
                    <Input
                      value={form.general.companyName}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                general: { ...prev.general, companyName: e.target.value },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email support</Label>
                    <Input
                      value={form.general.supportEmail}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                general: { ...prev.general, supportEmail: e.target.value },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Langue par defaut</Label>
                    <Input
                      value={form.general.defaultLanguage}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                general: {
                                  ...prev.general,
                                  defaultLanguage: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Input
                      value={form.general.timezone}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                general: { ...prev.general, timezone: e.target.value },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <p className="font-medium">Notifications email</p>
                  <Switch
                    checked={form.general.emailNotifications}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              general: {
                                ...prev.general,
                                emailNotifications: checked,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
