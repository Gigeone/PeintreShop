"use client";

import { useState, FormEvent } from "react";
import { EmailIcon, LocationIcon, ClockIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoi réel via l'API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      // Succès
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      setIsSubmitting(false);
      setErrors({
        message: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const fieldClass = (field: keyof FormErrors) =>
    cn(
      "w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:outline-none",
      errors[field] ? "border-red-700" : "border-line-strong focus:border-ink"
    );

  const FIELDS: { name: keyof FormData; label: string; type?: string; placeholder: string }[] = [
    { name: "name", label: "Nom", placeholder: "Votre nom" },
    { name: "email", label: "Email", type: "email", placeholder: "votre@email.com" },
    { name: "subject", label: "Sujet", placeholder: "Une œuvre, une question…" },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-12 lg:gap-8">
      {/* Introduction et coordonnées */}
      <div className="flex flex-col gap-8 lg:col-span-5">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-5xl font-normal tracking-[-0.02em] md:text-[64px]">
            Contact
          </h1>
          <p className="max-w-[440px] text-lg leading-relaxed text-body">
            Une question sur une œuvre ? Une demande particulière ? Écrivez-moi,
            je réponds personnellement.
          </p>
        </div>

        <ul className="flex flex-col border-t border-line">
          <li className="flex items-start gap-4 border-b border-line py-5">
            <EmailIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">Email</span>
              <a href="mailto:contact@mngh-art.com" className="transition-colors hover:text-accent">
                contact@mngh-art.com
              </a>
            </div>
          </li>
          <li className="flex items-start gap-4 border-b border-line py-5">
            <LocationIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">Atelier</span>
              <span>Mayenne, France</span>
            </div>
          </li>
          <li className="flex items-start gap-4 border-b border-line py-5">
            <ClockIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">Délai de réponse</span>
              <span>Sous 24-48h en semaine</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Formulaire */}
      <div className="lg:col-span-6 lg:col-start-7">
        {submitSuccess && (
          <div role="status" className="mb-6 rounded-lg border border-success/40 bg-success/10 p-4 text-success">
            Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {FIELDS.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label} <span className="text-muted">*</span>
              </label>
              <input
                type={field.type ?? "text"}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                className={fieldClass(field.name)}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="text-sm text-red-700">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-muted">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={7}
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(fieldClass("message"), "resize-none")}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-700">
                {errors.message}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto sm:self-start">
            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
