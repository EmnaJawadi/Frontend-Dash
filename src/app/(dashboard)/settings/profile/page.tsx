"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, Save, ShieldCheck, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCurrentUser,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/src/lib/auth";
import { ROLE_LABELS, type UserRole } from "@/src/types/role";

const SUPER_ADMIN_SECURITY_KEY = "super_admin_security_settings_v1";

type SuperAdminSecuritySettings = {
  hardenedMode: boolean;
  forceMfaReview: boolean;
  sessionTimeoutMinutes: number;
};

function loadSecuritySettings(): SuperAdminSecuritySettings {
  if (typeof window === "undefined") {
    return {
      hardenedMode: true,
      forceMfaReview: true,
      sessionTimeoutMinutes: 30,
    };
  }

  const raw = localStorage.getItem(SUPER_ADMIN_SECURITY_KEY);
  if (!raw) {
    return {
      hardenedMode: true,
      forceMfaReview: true,
      sessionTimeoutMinutes: 30,
    };
  }

  try {
    return JSON.parse(raw) as SuperAdminSecuritySettings;
  } catch {
    return {
      hardenedMode: true,
      forceMfaReview: true,
      sessionTimeoutMinutes: 30,
    };
  }
}

function saveSecuritySettings(settings: SuperAdminSecuritySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUPER_ADMIN_SECURITY_KEY, JSON.stringify(settings));
}

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [security, setSecurity] = useState<SuperAdminSecuritySettings>(loadSecuritySettings());

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [error, setError] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.role);
  }, []);

  const isSuperAdmin = useMemo(() => role === "SUPER_ADMIN", [role]);

  async function handleProfileSave() {
    setError("");
    setProfileMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Le prenom et le nom sont obligatoires.");
      return;
    }

    try {
      setIsSavingProfile(true);
      const updated = await updateCurrentUserProfile({ firstName, lastName });
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setProfileMessage("Profil mis a jour.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de mettre a jour le profil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSave() {
    setError("");
    setPasswordMessage("");

    try {
      setIsSavingPassword(true);
      await updateCurrentUserPassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Mot de passe mis a jour.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de modifier le mot de passe.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  function handleSecuritySave() {
    setIsSavingSecurity(true);
    setSecurityMessage("");
    setError("");

    if (security.sessionTimeoutMinutes < 5) {
      setError("Le timeout session doit etre au minimum 5 minutes.");
      setIsSavingSecurity(false);
      return;
    }

    saveSecuritySettings(security);
    setSecurityMessage("Parametres de securite Super Admin enregistres.");
    setIsSavingSecurity(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Gere tes informations personnelles, ton mot de passe et les options de securite.
        </p>
      </div>

      {error ? <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div> : null}
      {profileMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{profileMessage}</div> : null}
      {passwordMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{passwordMessage}</div> : null}
      {securityMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{securityMessage}</div> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border-border/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5" />
              <CardTitle>Informations utilisateur</CardTitle>
            </div>
            <CardDescription>Met a jour ton profil et visualise ton role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Prenom</Label><Input value={firstName} onChange={(event) => setFirstName(event.target.value)} /></div>
              <div><Label>Nom</Label><Input value={lastName} onChange={(event) => setLastName(event.target.value)} /></div>
            </div>
            <div><Label>Email</Label><Input value={email} disabled /></div>
            <div>
              <Label>Role</Label>
              <div className="pt-2">
                <Badge variant="secondary">{role ? ROLE_LABELS[role] : "Utilisateur"}</Badge>
              </div>
            </div>
            <Button type="button" onClick={() => void handleProfileSave()} disabled={isSavingProfile}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingProfile ? "Enregistrement..." : "Enregistrer profil"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <CardTitle>Securite compte</CardTitle>
            </div>
            <CardDescription>Change ton mot de passe regulierement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Mot de passe actuel</Label><Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></div>
            <div><Label>Nouveau mot de passe</Label><Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></div>
            <div><Label>Confirmer mot de passe</Label><Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
            <Button type="button" onClick={() => void handlePasswordSave()} disabled={isSavingPassword}>
              <LockKeyhole className="mr-2 h-4 w-4" />
              {isSavingPassword ? "Mise a jour..." : "Modifier mot de passe"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {isSuperAdmin ? (
        <Card className="rounded-3xl border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Securite renforcee Super Admin</CardTitle>
            </div>
            <CardDescription>Regles globales de securite appliquees au compte super administrateur.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={security.hardenedMode ? "true" : "false"}
                onChange={(event) => setSecurity((prev) => ({ ...prev, hardenedMode: event.target.value === "true" }))}
                className="h-10 rounded-xl border border-border bg-background px-2"
              >
                <option value="true">Mode securise renforce ON</option>
                <option value="false">Mode securise renforce OFF</option>
              </select>
              <select
                value={security.forceMfaReview ? "true" : "false"}
                onChange={(event) => setSecurity((prev) => ({ ...prev, forceMfaReview: event.target.value === "true" }))}
                className="h-10 rounded-xl border border-border bg-background px-2"
              >
                <option value="true">Verification MFA obligatoire</option>
                <option value="false">Verification MFA optionnelle</option>
              </select>
            </div>
            <div>
              <Label>Timeout session (minutes)</Label>
              <Input
                type="number"
                min={5}
                value={security.sessionTimeoutMinutes}
                onChange={(event) =>
                  setSecurity((prev) => ({
                    ...prev,
                    sessionTimeoutMinutes: Math.max(5, Number(event.target.value) || 5),
                  }))
                }
              />
            </div>
            <Button type="button" onClick={handleSecuritySave} disabled={isSavingSecurity}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingSecurity ? "Enregistrement..." : "Enregistrer securite Super Admin"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
