"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/src/lib/auth";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getRoleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Propriétaire d’entreprise";
    case "AGENT":
      return "Agent de support";
    case "SUPER_ADMIN":
      return "Admin plateforme";
    default:
      return role;
  }
}

export default function AccountPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    companyName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
      companyName: user.companyName || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsReady(true);
  }, []);

  const initials = useMemo(() => {
    const first = form.firstName?.[0] || "";
    const last = form.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [form.firstName, form.lastName]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    const rawUser = localStorage.getItem("user_data");
    if (!rawUser) {
      alert("Utilisateur introuvable.");
      return;
    }

    const currentUser = JSON.parse(rawUser);

    const updatedUser = {
      ...currentUser,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      companyName: form.companyName.trim(),
    };

    localStorage.setItem("user_data", JSON.stringify(updatedUser));
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(updatedUser)
    )}; path=/`;

    const rawUsers = localStorage.getItem("mock_users");
    if (rawUsers) {
      const users = JSON.parse(rawUsers);
      const updatedUsers = users.map((user: any) =>
        user.id === updatedUser.id
          ? {
              ...user,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              companyName: updatedUser.companyName,
            }
          : user
      );

      localStorage.setItem("mock_users", JSON.stringify(updatedUsers));
    }

    alert("Profil mis à jour avec succès.");
    window.location.reload();
  };

  const handleChangePassword = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    const rawUsers = localStorage.getItem("mock_users");
    const rawCurrentUser = localStorage.getItem("user_data");

    if (!rawUsers || !rawCurrentUser) {
      alert("Impossible de mettre à jour le mot de passe.");
      return;
    }

    const users = JSON.parse(rawUsers);
    const currentUser = JSON.parse(rawCurrentUser);

    const targetUser = users.find((user: any) => user.id === currentUser.id);

    if (!targetUser) {
      alert("Utilisateur introuvable.");
      return;
    }

    if (targetUser.password !== form.currentPassword) {
      alert("Le mot de passe actuel est incorrect.");
      return;
    }

    const updatedUsers = users.map((user: any) =>
      user.id === currentUser.id
        ? {
            ...user,
            password: form.newPassword,
          }
        : user
    );

    localStorage.setItem("mock_users", JSON.stringify(updatedUsers));

    setForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    alert("Mot de passe modifié avec succès.");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!isReady) {
    return (
      <main className="min-h-screen bg-muted/20 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            Chargement...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mon compte</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gère ton profil, la sécurité de ton compte et ta session.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted text-2xl font-bold">
                  {initials}
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                  {form.firstName} {form.lastName}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {getRoleLabel(form.role)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {form.email}
                </p>

                {form.companyName ? (
                  <div className="mt-4 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {form.companyName}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <h3 className="text-base font-semibold">Informations rapides</h3>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Rôle</span>
                  <span className="font-medium">{getRoleLabel(form.role)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Entreprise</span>
                  <span className="font-medium">
                    {form.companyName || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Session</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Informations personnelles
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mets à jour ton nom, ton email et les informations de ton compte.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Prénom
                  </label>
                  <input
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Nom</label>
                  <input
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Rôle</label>
                  <input
                    className="w-full rounded-xl border bg-muted p-3 text-muted-foreground outline-none"
                    value={getRoleLabel(form.role)}
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Entreprise
                  </label>
                  <input
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Enregistrer les modifications
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="rounded-xl border px-5 py-3 text-sm font-medium"
                >
                  Annuler
                </button>
              </div>
            </section>

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Sécurité</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Change ton mot de passe pour sécuriser ton compte.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.currentPassword}
                    onChange={(e) =>
                      handleChange("currentPassword", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirmation
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border bg-background p-3 outline-none"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleChangePassword}
                  className="rounded-xl border px-5 py-3 text-sm font-medium"
                >
                  Modifier le mot de passe
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-red-200 bg-background p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-red-600">Session</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu peux te déconnecter de ton compte à tout moment.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}