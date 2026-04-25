"use client";

import { useState } from "react";
import { apiClient } from "@/src/lib/api-client";
import { isApiError } from "@/src/lib/api-error";

type RegistrationRequestFormState = {
  companyName: string;
  businessEmail: string;
  phoneNumber: string;
  responsibleFullName: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  message: string;
};

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegistrationRequestFormState>({
    companyName: "",
    businessEmail: "",
    phoneNumber: "",
    responsibleFullName: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.companyName.trim() ||
      !formData.businessEmail.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.responsibleFullName.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.businessType.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/public/company-registration", {
        companyName: formData.companyName.trim(),
        businessEmail: formData.businessEmail.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        responsibleFullName: formData.responsibleFullName.trim(),
        requestedRole: "COMPANY_ADMIN",
        businessType: formData.businessType.trim(),
        message: formData.message.trim() || undefined,
        password: formData.password,
      });

      setSuccess(
        "Votre demande d inscription a ete envoyee. Elle sera verifiee par l administration.",
      );
      setFormData({
        companyName: "",
        businessEmail: "",
        phoneNumber: "",
        responsibleFullName: "",
        password: "",
        confirmPassword: "",
        businessType: "",
        message: "",
      });
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
      {error ? (
        <div className="auth-alert auth-alert-error">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="auth-alert auth-alert-success">
          {success}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="companyName" className="auth-label">
          Nom de l'entreprise
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Support Vision"
          className="auth-input"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="businessEmail" className="auth-label">
            Email professionnel
          </label>
          <input
            id="businessEmail"
            name="businessEmail"
            type="email"
            value={formData.businessEmail}
            onChange={handleChange}
            placeholder="contact@entreprise.com"
            className="auth-input"
          />
        </div>
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
            placeholder="+234..."
            className="auth-input"
          />
        </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="responsibleFullName"
            className="auth-label"
          >
            Responsable
          </label>
          <input
            id="responsibleFullName"
            name="responsibleFullName"
            type="text"
            value={formData.responsibleFullName}
            onChange={handleChange}
            placeholder="Nom complet"
            className="auth-input"
          />
        </div>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-button"
      >
        {isSubmitting ? "Envoi..." : "Demander l'inscription entreprise"}
      </button>
    </form>
  );
}
