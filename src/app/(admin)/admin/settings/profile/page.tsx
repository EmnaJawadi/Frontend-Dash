"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, Save, UserCircle2 } from "lucide-react";

import { getCurrentUser, updateCurrentUserPassword, updateCurrentUserProfile } from "@/src/lib/auth";

export default function AdminProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, []);

  async function handleSaveProfile() {
    try {
      setIsSavingProfile(true);
      setError(null);
      setSuccess(null);

      const updated = await updateCurrentUserProfile({
        firstName,
        lastName,
      });

      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setSuccess("Profil mis a jour avec succes.");
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : "Impossible de mettre a jour le profil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleSavePassword() {
    try {
      setIsSavingPassword(true);
      setError(null);
      setSuccess(null);

      await updateCurrentUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Mot de passe modifie avec succes.");
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Impossible de modifier le mot de passe.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
        </div>

        <p className="text-sm text-slate-500">
          Modifiez vos informations personnelles Super Admin.
        </p>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Prenom</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Prenom"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Nom</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Nom"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Email</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
            value={email}
            readOnly
          />
        </label>

        <button
          type="button"
          disabled={isSavingProfile}
          onClick={() => void handleSaveProfile()}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {isSavingProfile ? "Enregistrement..." : "Enregistrer le profil"}
        </button>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">Securite du compte</h2>
        </div>

        <p className="text-sm text-slate-500">
          Modifiez votre mot de passe de connexion.
        </p>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Mot de passe actuel</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Mot de passe actuel"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Nouveau mot de passe</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Nouveau mot de passe"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Confirmer le mot de passe</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirmer le mot de passe"
          />
        </label>

        <button
          type="button"
          disabled={isSavingPassword}
          onClick={() => void handleSavePassword()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
        >
          <LockKeyhole className="h-4 w-4" />
          {isSavingPassword ? "Mise a jour..." : "Changer le mot de passe"}
        </button>
      </section>

      {error ? (
        <div className="xl:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="xl:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}
    </div>
  );
}
