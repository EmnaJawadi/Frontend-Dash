"use client";

import { useEffect, useState } from "react";
import { Save, ShieldCheck, UserCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  getCurrentUser,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/src/lib/auth";
import { ROLE_LABELS } from "@/src/types/role";

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<keyof typeof ROLE_LABELS | "">("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.role);
  }, []);

  const handleProfileSave = () => {
    setError("");
    setProfileMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Le prénom et le nom sont obligatoires.");
      return;
    }

    try {
      setIsSavingProfile(true);

      const updatedUser = updateCurrentUserProfile({
        firstName,
        lastName,
      });

      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);
      setProfileMessage("Profil mis à jour avec succès.");
      setTimeout(() => setProfileMessage(""), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour le profil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = () => {
    setError("");
    setPasswordMessage("");

    try {
      setIsSavingPassword(true);

      updateCurrentUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Mot de passe modifié avec succès.");
      setTimeout(() => setPasswordMessage(""), 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier le mot de passe.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Profile settings</h1>
        <p className="text-sm text-muted-foreground">
          Gérez vos informations personnelles et la sécurité de votre compte.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {profileMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          {profileMessage}
        </div>
      ) : null}

      {passwordMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          {passwordMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-5 w-5" />
              <div>
                <CardTitle>Informations utilisateur</CardTitle>
                <CardDescription>
                  Modifiez votre prénom, votre nom et consultez votre rôle.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Rôle</Label>
              <div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {role ? ROLE_LABELS[role] : "Utilisateur"}
                </Badge>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleProfileSave}
              disabled={isSavingProfile}
              className="rounded-xl"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSavingProfile ? "Enregistrement..." : "Enregistrer le profil"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <div>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe pour sécuriser votre compte.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button
              type="button"
              onClick={handlePasswordSave}
              disabled={isSavingPassword}
              className="rounded-xl"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {isSavingPassword
                ? "Mise à jour..."
                : "Modifier le mot de passe"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}