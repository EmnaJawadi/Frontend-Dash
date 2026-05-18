"use client";

import { useState } from "react";
import { isApiError } from "@/src/lib/api-error";
import { authService } from "@/src/services/auth.service";

type AccountType = "company_admin" | "support_agent";

type RegistrationRequestFormState = {
  companyName: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  message: string;
};

const TUNISIA_PHONE_PREFIX = "+216 ";

function createEmptyForm(): RegistrationRequestFormState {
  return {
    companyName: "",
    email: "",
    phoneNumber: TUNISIA_PHONE_PREFIX,
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    message: "",
  };
}

export default function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>("company_admin");
  const [formData, setFormData] = useState<RegistrationRequestFormState>(
    createEmptyForm(),
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCompanyAdmin = accountType === "company_admin";

  function handleAccountTypeChange(nextType: AccountType) {
    setAccountType(nextType);
    setError("");
    setSuccess("");
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm(): boolean {
    if (
      !formData.companyName.trim() ||
      !formData.email.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (isCompanyAdmin && !formData.businessType.trim()) {
      setError("Veuillez renseigner le type d'activite.");
      return false;
    }

    if (isCompanyAdmin) {
      const normalizedPhoneNumber = formData.phoneNumber.trim();
      const phoneDigits = normalizedPhoneNumber.replace(/\D/g, "");

      if (!normalizedPhoneNumber.startsWith("+216") || phoneDigits.length <= 3) {
        setError(
          "Le telephone professionnel doit commencer par +216 et contenir le numero complet.",
        );
        return false;
      }
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fullName = [formData.firstName.trim(), formData.lastName.trim()].join(
        " ",
      );
      const email = formData.email.trim().toLowerCase();

      if (isCompanyAdmin) {
        const response = await authService.register({
          companyName: formData.companyName.trim(),
          businessEmail: email,
          phoneNumber: formData.phoneNumber.trim(),
          responsibleFullName: fullName,
          requestedRole: "COMPANY_ADMIN",
          businessType: formData.businessType.trim(),
          message: formData.message.trim() || undefined,
          password: formData.password,
        });

        setSuccess(
          response.message ||
            "Votre demande d'inscription a ete envoyee. Elle sera verifiee par l'administration.",
        );
      } else {
        const response = await authService.registerAgent({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          companyName: formData.companyName.trim(),
        });

        setSuccess(
          response.message ||
            "Votre demande a ete envoyee. Vous pourrez vous connecter apres l'autorisation du super administrateur.",
        );
      }

      setFormData(createEmptyForm());
    } catch (submitError) {
      if (isApiError(submitError)) {
        setError(
          submitError.message || "Erreur API lors de l'envoi de la demande.",
        );
      } else {
        const message =
          submitError instanceof Error
            ? submitError.message
            : "Impossible d'envoyer la demande.";
        if (message.toLowerCase().includes("failed to fetch")) {
          setError(
            "API inaccessible. Verifiez que le backend tourne sur http://localhost:3001.",
          );
        } else {
          setError(message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={isCompanyAdmin}
          onClick={() => handleAccountTypeChange("company_admin")}
          className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
            isCompanyAdmin
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          <span className="block font-semibold">Admin entreprise</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Creation d'une entreprise
          </span>
        </button>
        <button
          type="button"
          aria-pressed={!isCompanyAdmin}
          onClick={() => handleAccountTypeChange("support_agent")}
          className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
            !isCompanyAdmin
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          <span className="block font-semibold">Agent humain</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Rejoindre une entreprise
          </span>
        </button>
      </div>

      {error ? <div className="auth-alert auth-alert-error">{error}</div> : null}
      {success ? (
        <div className="auth-alert auth-alert-success">{success}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="auth-label">
            Prenom
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Prenom"
            className="auth-input"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="auth-label">
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nom"
            className="auth-input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="companyName" className="auth-label">
          {isCompanyAdmin ? "Nom de l'entreprise" : "Entreprise existante"}
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder={isCompanyAdmin ? "Support Vision" : "Nom exact de l'entreprise"}
          className="auth-input"
        />
      </div>

      <div className={isCompanyAdmin ? "grid gap-4 md:grid-cols-2" : "space-y-1.5"}>
        <div className="space-y-1.5">
          <label htmlFor="email" className="auth-label">
            {isCompanyAdmin ? "Email professionnel" : "Email"}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={isCompanyAdmin ? "contact@entreprise.com" : "agent@entreprise.com"}
            className="auth-input"
          />
        </div>

        {isCompanyAdmin ? (
          <div className="space-y-1.5">
            <label htmlFor="phoneNumber" className="auth-label">
              Telephone professionnel
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+216 XX XXX XXX"
              className="auth-input"
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="password" className="auth-label">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Au moins 6 caracteres"
            className="auth-input"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="auth-label">
            Confirmation mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repetez votre mot de passe"
            className="auth-input"
          />
        </div>
      </div>

      {isCompanyAdmin ? (
        <>
          <div className="space-y-1.5">
            <label htmlFor="businessType" className="auth-label">
              Type d'activite
            </label>
            <input
              id="businessType"
              name="businessType"
              type="text"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="E-commerce, services..."
              className="auth-input"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="auth-label">
              Message (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="auth-textarea"
              placeholder="Precisez vos besoins."
            />
          </div>
        </>
      ) : null}

      <button type="submit" disabled={isSubmitting} className="auth-button">
        {isSubmitting
          ? "Envoi..."
          : isCompanyAdmin
            ? "Demander l'inscription entreprise"
            : "Envoyer la demande agent"}
      </button>
    </form>
  );
}
