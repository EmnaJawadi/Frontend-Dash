"use client";

import * as React from "react";
import Image from "next/image";
import {
  Building2,
  Bot,
  CheckCircle2,
  MessageCircleMore,
  PlugZap,
  QrCode,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Unplug,
  Workflow,
} from "lucide-react";
import RoleGuard from "@/src/components/layout/role-guard";
import { getUserRole } from "@/src/lib/auth";
import { useSettings } from "@/src/features/settings/hooks/use-settings";
import {
  getAllowedCompanySettingsCards,
  type CompanySettingsCardId,
} from "@/src/features/settings/settings-permissions";
import type {
  CompanyAiSettingsData,
  CompanyAdminSettingsData,
  CompanyWhatsappConfigData,
  CompanyWorkflowSettingsData,
  ResponseTone,
  SupportedLanguage,
} from "@/src/features/settings/types/settings.types";
import type { UserRole } from "@/src/types/role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SAFE_VERIFICATION_MESSAGE =
  "Nous avons bien reçu votre demande. Elle nécessite une vérification complémentaire et notre équipe vous répondra dès que possible.";

const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string }> = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "ar", label: "Arabe" },
];

const TONE_OPTIONS: Array<{ value: ResponseTone; label: string }> = [
  { value: "professional", label: "Professionnel" },
  { value: "friendly", label: "Amical" },
  { value: "formal", label: "Formel" },
  { value: "concise", label: "Concis" },
];

const TIMEZONE_OPTIONS = [
  "Africa/Lagos",
  "Africa/Tunis",
  "Africa/Casablanca",
  "Europe/Paris",
  "UTC",
];

type SettingsForm = {
  evolutionInstanceName: string;
  aiSettings: CompanyAiSettingsData;
  workflowSettings: CompanyWorkflowSettingsData;
  preferences: CompanyAdminSettingsData["preferences"];
};

const DEFAULT_AI_SETTINGS: CompanyAiSettingsData = {
  enabled: false,
  handoffEnabled: false,
  responseTone: "professional",
  language: "fr",
  escalationDelayMinutes: 0,
  botGuidelines: "",
  confidenceThresholdManagedByPlatform: true,
  technicalSettingsManagedByPlatform: true,
};

const DEFAULT_WORKFLOW_SETTINGS: CompanyWorkflowSettingsData = {
  enabled: false,
  defaultAssigneeId: null,
  defaultAssignment: "",
  welcomeMessage: "",
  verificationMessage: SAFE_VERIFICATION_MESSAGE,
};

function cloneForm(data: CompanyAdminSettingsData): SettingsForm {
  return {
    evolutionInstanceName: data.whatsapp?.evolutionInstanceName ?? "",
    aiSettings: { ...(data.aiSettings ?? DEFAULT_AI_SETTINGS) },
    workflowSettings: { ...(data.workflowSettings ?? DEFAULT_WORKFLOW_SETTINGS) },
    preferences: { ...data.preferences },
  };
}

function formatDateTime(value: string | null) {
  if (!value) return "Jamais";
  return new Date(value).toLocaleString("fr-FR");
}

function statusLabel(status: CompanyWhatsappConfigData["connectionStatus"]) {
  if (status === "connected") return "Connecté";
  if (status === "pending") return "En attente";
  return "Déconnecté";
}

function statusVariant(status: CompanyWhatsappConfigData["connectionStatus"]) {
  if (status === "connected") return "default";
  if (status === "pending") return "secondary";
  return "outline";
}

function resolveQrImageSrc(qrCodeValue: string) {
  return qrCodeValue.startsWith("data:")
    ? qrCodeValue
    : `data:image/png;base64,${qrCodeValue}`;
}

export default function SettingsPage() {
  const [currentRole, setCurrentRole] = React.useState<UserRole | null>(null);
  const visibleSettingsCards = React.useMemo(
    () => getAllowedCompanySettingsCards(currentRole),
    [currentRole],
  );
  const visibleCardIds = React.useMemo(
    () => new Set(visibleSettingsCards.map((card) => card.id)),
    [visibleSettingsCards],
  );
  const canShowCard = React.useCallback(
    (cardId: CompanySettingsCardId) => visibleCardIds.has(cardId),
    [visibleCardIds],
  );
  const showWhatsappSettings = canShowCard("whatsapp");
  const showAiSettings = canShowCard("ai");
  const showWorkflowSettings = canShowCard("workflow");

  const {
    data,
    qrCode,
    isLoading,
    isSaving,
    isConnecting,
    isTestingConnection,
    isQrLoading,
    isDisconnecting,
    isResetting,
    error,
    saveError,
    refetch,
    saveSettings,
    connectWhatsapp,
    loadQrCode,
    testWhatsappConnection,
    disconnectWhatsapp,
    resetWhatsapp,
  } = useSettings({ role: currentRole });
  const [form, setForm] = React.useState<SettingsForm | null>(null);
  const [toast, setToast] = React.useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  React.useEffect(() => {
    setCurrentRole(getUserRole());
  }, []);

  React.useEffect(() => {
    if (data) {
      setForm(cloneForm(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const resetForm = () => {
    if (!data) return;
    setForm(cloneForm(data));
    setToast(null);
  };

  const showSuccess = (message: string) => setToast({ tone: "success", message });
  const showError = (message: string) => setToast({ tone: "error", message });

  const onSave = async () => {
    if (!form) return;
    try {
      await saveSettings({
        ...(showAiSettings
          ? {
              aiSettings: {
                enabled: form.aiSettings.enabled,
                handoffEnabled: form.aiSettings.handoffEnabled,
                escalationDelayMinutes: form.aiSettings.escalationDelayMinutes,
                responseTone: form.aiSettings.responseTone,
                language: form.aiSettings.language,
                botGuidelines: form.aiSettings.botGuidelines,
              },
            }
          : {}),
        ...(showWorkflowSettings
          ? {
              workflowSettings: {
                enabled: form.workflowSettings.enabled,
                defaultAssigneeId: form.workflowSettings.defaultAssigneeId,
                welcomeMessage: form.workflowSettings.welcomeMessage,
                verificationMessage: form.workflowSettings.verificationMessage,
              },
            }
          : {}),
        preferences: {
          officialName: form.preferences.officialName,
          displayName: form.preferences.displayName,
          supportEmail: form.preferences.supportEmail,
          supportPhone: form.preferences.supportPhone,
          city: form.preferences.city,
          country: form.preferences.country,
          defaultLanguage: form.preferences.defaultLanguage,
          timezone: form.preferences.timezone,
          emailNotificationsEnabled: form.preferences.emailNotificationsEnabled,
        },
      });
      showSuccess("Paramètres entreprise enregistrés.");
    } catch {
      showError("Impossible d'enregistrer les paramètres.");
    }
  };

  const onConnect = async () => {
    if (!form) return;
    try {
      await connectWhatsapp(form.evolutionInstanceName);
      showSuccess("Connexion WhatsApp préparée.");
    } catch {
      showError("Impossible de préparer la connexion WhatsApp.");
    }
  };

  const onShowQr = async () => {
    try {
      await loadQrCode();
      showSuccess("QR Code WhatsApp chargé.");
    } catch {
      showError("Impossible de charger le QR Code WhatsApp.");
    }
  };

  const onTestConnection = async () => {
    try {
      const result = await testWhatsappConnection();
      if (result.ok) {
        showSuccess(result.message || "Connexion WhatsApp vérifiée.");
      } else {
        showError(result.message || "Connexion WhatsApp non disponible.");
      }
    } catch {
      showError("Echec du test de connexion WhatsApp.");
    }
  };

  const onDisconnect = async () => {
    try {
      await disconnectWhatsapp();
      showSuccess("WhatsApp déconnecté.");
    } catch {
      showError("Impossible de déconnecter WhatsApp.");
    }
  };

  const onReset = async () => {
    try {
      await resetWhatsapp();
      showSuccess("Connexion WhatsApp réinitialisée.");
    } catch {
      showError("Impossible de réinitialiser WhatsApp.");
    }
  };

  return (
    <RoleGuard allowedRoles={["OWNER"]}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              Paramètres entreprise
            </h1>
            <p className="text-sm text-muted-foreground">
              Visible uniquement par votre entreprise. Aucun paramètre technique
              sensible n'est exposé.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} disabled={!form || isSaving}>
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={onSave} disabled={isSaving || !form}>
              <Save className="h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {toast ? (
          <div
            className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-sm ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        ) : null}

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Chargement des paramètres...
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-red-700">{error}</p>
              <Button onClick={() => void refetch()}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : null}

        {saveError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        ) : null}

        {!form || !data ? null : (
          <div className="grid gap-5 xl:grid-cols-2">
            {canShowCard("companyInfo") ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations entreprise
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Coordonnees et identite visibles par votre entreprise.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nom officiel</Label>
                      <Input value={form.preferences.officialName} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom affiche</Label>
                      <Input
                        value={form.preferences.displayName}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    displayName: event.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email support</Label>
                      <Input
                        type="email"
                        value={form.preferences.supportEmail}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    supportEmail: event.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telephone support</Label>
                      <Input
                        value={form.preferences.supportPhone}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    supportPhone: event.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input
                        value={form.preferences.city}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    city: event.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Input
                        value={form.preferences.country}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    country: event.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {showWhatsappSettings && data.whatsapp ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircleMore className="h-5 w-5" />
                    Connexion WhatsApp
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Géré par la plateforme via Evolution API.
                  </p>
                </div>
                <Badge variant={statusVariant(data.whatsapp.connectionStatus)}>
                  {statusLabel(data.whatsapp.connectionStatus)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nom de l'instance Evolution</Label>
                    <Input
                      value={form.evolutionInstanceName}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                evolutionInstanceName: event.target.value,
                              }
                            : prev,
                        )
                      }
                      placeholder="ex: support-whatsapp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro WhatsApp connecté</Label>
                    <Input value={data.whatsapp.whatsappNumber || "Non connecté"} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom affiché</Label>
                    <Input value={data.whatsapp.displayName || "Non renseigné"} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Dernière vérification</Label>
                    <Input value={formatDateTime(data.whatsapp.lastSyncAt)} readOnly />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onConnect} disabled={isConnecting}>
                    <PlugZap className="h-4 w-4" />
                    {isConnecting ? "Connexion..." : "Connecter WhatsApp"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onShowQr}
                    disabled={isQrLoading || data.whatsapp.connectionStatus === "connected"}
                  >
                    <QrCode className="h-4 w-4" />
                    {isQrLoading ? "Chargement..." : "Afficher QR Code"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onTestConnection}
                    disabled={isTestingConnection}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isTestingConnection ? "Test..." : "Tester"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onDisconnect}
                    disabled={isDisconnecting}
                  >
                    <Unplug className="h-4 w-4" />
                    {isDisconnecting ? "Déconnexion..." : "Déconnecter"}
                  </Button>
                  <Button variant="outline" onClick={onReset} disabled={isResetting}>
                    <RotateCcw className="h-4 w-4" />
                    {isResetting ? "Réinitialisation..." : "Réinitialiser"}
                  </Button>
                </div>
                {qrCode?.qrCode ? (
                  <div className="w-fit rounded-lg border bg-muted/30 p-3">
                    <Image
                      src={resolveQrImageSrc(qrCode.qrCode)}
                      alt="QR Code WhatsApp"
                      width={208}
                      height={208}
                      unoptimized
                      className="size-52"
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
            ) : null}

            {showAiSettings ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Assistant IA
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Les paramètres techniques IA sont gérés par la plateforme.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">Activer le bot</span>
                    <Switch
                      checked={form.aiSettings.enabled}
                      onCheckedChange={(checked) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiSettings: { ...prev.aiSettings, enabled: checked },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">Activer handoff humain</span>
                    <Switch
                      checked={form.aiSettings.handoffEnabled}
                      onCheckedChange={(checked) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiSettings: {
                                  ...prev.aiSettings,
                                  handoffEnabled: checked,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Ton de réponse</Label>
                    <Select
                      value={form.aiSettings.responseTone}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiSettings: {
                                  ...prev.aiSettings,
                                  responseTone: value as ResponseTone,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Langue par défaut</Label>
                    <Select
                      value={form.aiSettings.language}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiSettings: {
                                  ...prev.aiSettings,
                                  language: value as SupportedLanguage,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Délai avant alerte support</Label>
                    <Input
                      type="number"
                      min={0}
                      max={1440}
                      value={form.aiSettings.escalationDelayMinutes}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiSettings: {
                                  ...prev.aiSettings,
                                  escalationDelayMinutes: Math.max(
                                    0,
                                    Number(event.target.value) || 0,
                                  ),
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                  Confiance minimale : gérée par la plateforme.
                </div>
                <div className="space-y-2">
                  <Label>Consignes personnalisées du bot</Label>
                  <Textarea
                    value={form.aiSettings.botGuidelines}
                    maxLength={1200}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              aiSettings: {
                                ...prev.aiSettings,
                                botGuidelines: event.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
            ) : null}

            {showWorkflowSettings ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Workflow automatique
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Assignation limitée aux agents de votre entreprise.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">Activer workflow</span>
                  <Switch
                    checked={form.workflowSettings.enabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflowSettings: {
                                ...prev.workflowSettings,
                                enabled: checked,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignation par défaut</Label>
                  {data.supportAssignees.length === 0 ? (
                    <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                      Aucun agent disponible. Ajoutez d'abord un membre dans la
                      section Équipe.
                    </div>
                  ) : (
                    <Select
                      value={form.workflowSettings.defaultAssigneeId ?? "none"}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                workflowSettings: {
                                  ...prev.workflowSettings,
                                  defaultAssigneeId:
                                    value === "none" ? null : value,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune assignation</SelectItem>
                        {data.supportAssignees.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Message d'accueil</Label>
                  <Textarea
                    value={form.workflowSettings.welcomeMessage}
                    maxLength={500}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflowSettings: {
                                ...prev.workflowSettings,
                                welcomeMessage: event.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message de vérification complémentaire</Label>
                  <Textarea
                    value={
                      form.workflowSettings.verificationMessage ||
                      SAFE_VERIFICATION_MESSAGE
                    }
                    maxLength={500}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              workflowSettings: {
                                ...prev.workflowSettings,
                                verificationMessage: event.target.value,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
            ) : null}

            {canShowCard("preferences") ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences entreprise
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Langue, fuseau horaire et notifications generales.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Langue par defaut</Label>
                    <Select
                      value={form.preferences.defaultLanguage}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  defaultLanguage: value as SupportedLanguage,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Select
                      value={form.preferences.timezone}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  timezone: value,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONE_OPTIONS.map((timezone) => (
                          <SelectItem key={timezone} value={timezone}>
                            {timezone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">Notifications email</span>
                  <Switch
                    checked={form.preferences.emailNotificationsEnabled}
                    onCheckedChange={(checked) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                emailNotificationsEnabled: checked,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
            ) : null}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
