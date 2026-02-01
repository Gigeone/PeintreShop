"use client";

import { useState, FormEvent } from "react";

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

    // Simulation d'envoi pour le MVP
    await new Promise((resolve) => setTimeout(resolve, 1500));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue-bg to-pastel-rose-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-serif text-5xl font-bold text-pastel-blue-logo mb-6">
          Contactez-moi
        </h1>
        <p className="text-xl text-pastel-gray-text mb-12">
          Une question sur une œuvre ? Une demande particulière ? N'hésitez pas
          à me contacter.
        </p>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✓ Message envoyé avec succès ! Je vous répondrai dans les plus
              brefs délais.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-pastel-lavender/30 focus:border-pastel-lavender"
                } focus:outline-none transition-colors duration-300`}
                placeholder="Votre nom"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-pastel-lavender/30 focus:border-pastel-lavender"
                } focus:outline-none transition-colors duration-300`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Sujet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.subject
                    ? "border-red-400 focus:border-red-500"
                    : "border-pastel-lavender/30 focus:border-pastel-lavender"
                } focus:outline-none transition-colors duration-300`}
                placeholder="Sujet de votre message"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-pastel-gray-text mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.message
                    ? "border-red-400 focus:border-red-500"
                    : "border-pastel-lavender/30 focus:border-pastel-lavender"
                } focus:outline-none transition-colors duration-300 resize-none`}
                placeholder="Votre message..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                isSubmitting
                  ? "bg-pastel-gray-text/50 cursor-not-allowed"
                  : "bg-pastel-rose-mauve hover:bg-pastel-lavender text-white"
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
