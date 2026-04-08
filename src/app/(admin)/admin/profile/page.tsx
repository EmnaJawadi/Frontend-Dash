"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  logout,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/src/lib/auth";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return `${first}${last}` || "A";
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [profileError, setProfileError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    setProfileForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
  }, [router]);

  const initials = useMemo(() => {
    return getInitials(profileForm.firstName, profileForm.lastName);
  }, [profileForm.firstName, profileForm.lastName]);

  const fullName = useMemo(() => {
    return `${profileForm.firstName} ${profileForm.lastName}`.trim() || "Super Admin";
  }, [profileForm.firstName, profileForm.lastName]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const firstName = profileForm.firstName.trim();
      const lastName = profileForm.lastName.trim();

      if (!firstName || !lastName) {
        throw new Error("Le prénom et le nom sont obligatoires.");
      }

      updateCurrentUserProfile({ firstName, lastName });

      setProfileForm((prev) => ({
        ...prev,
        firstName,
        lastName,
      }));

      setProfileMessage("Profil mis à jour avec succès.");
      router.refresh();
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du profil."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    setIsSavingPassword(true);

    try {
      if (
        !passwordForm.currentPassword.trim() ||
        !passwordForm.newPassword.trim() ||
        !passwordForm.confirmPassword.trim()
      ) {
        throw new Error("Tous les champs du mot de passe sont obligatoires.");
      }

      updateCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage("Mot de passe changé avec succès.");
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du changement du mot de passe."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      logout();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-sm">
              {initials}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Mon profil admin
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Gérez vos informations personnelles, votre mot de passe et votre session.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-900">{fullName}</p>
            <p className="text-sm text-slate-500">{profileForm.email}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Informations personnelles
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Modifiez votre prénom et votre nom affichés dans le dashboard.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-slate-700"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={profileForm.firstName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Votre prénom"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-slate-700"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={profileForm.lastName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={profileForm.email}
                disabled
                className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 outline-none"
              />
              <p className="text-xs text-slate-500">
                L’email est affiché ici en lecture seule.
              </p>
            </div>

            {profileError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {profileError}
              </div>
            ) : null}

            {profileMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {profileMessage}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Changer le mot de passe
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Utilisez un mot de passe fort d’au moins 6 caractères.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Mot de passe actuel
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Mot de passe actuel"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Nouveau mot de passe"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Confirmer le mot de passe"
                />
              </div>

              {passwordError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {passwordError}
                </div>
              ) : null}

              {passwordMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {passwordMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSavingPassword}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Session
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Déconnectez-vous de votre espace administrateur.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}