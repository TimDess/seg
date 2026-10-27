"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
export default function ContactForm({ configured }: { configured: boolean }) {
  const [profile, setProfile] = useState("professionnel");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("profil") === "particulier") setProfile("particulier");
    if (services.some((s) => s.slug === q.get("projet")))
      setProject(q.get("projet")!);
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("profile", profile);
    const file = data.get("document");
    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("Le document dépasse 5 Mo. Choisissez un fichier plus léger.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "La transmission a échoué. Réessayez ultérieurement.",
        );
      setStatus("success");
      setMessage(
        "Votre demande a été transmise au service de réception. SEG pourra revenir vers vous avec les coordonnées indiquées.",
      );
      form.reset();
      setProject("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Votre demande n’a pas été envoyée.",
      );
    }
  }
  return (
    <form onSubmit={submit}>
      <div className="form-tabs" aria-label="Votre profil">
        <button
          type="button"
          aria-pressed={profile === "professionnel"}
          onClick={() => setProfile("professionnel")}
        >
          Professionnel
        </button>
        <button
          type="button"
          aria-pressed={profile === "particulier"}
          onClick={() => setProfile("particulier")}
        >
          Particulier
        </button>
      </div>
      {!configured && (
        <div className="notice">
          Le service d’envoi n’est pas encore activé. Vous pouvez préparer votre
          demande, mais elle ne pourra pas être transmise depuis cette version.
        </div>
      )}
      <div className="form-grid">
        {profile === "professionnel" && (
          <label className="field full">
            Entreprise *
            <input
              name="company"
              required
              maxLength={160}
              autoComplete="organization"
            />
          </label>
        )}
        <label className="field">
          Nom et prénom *
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className="field">
          Adresse e-mail *
          <input
            type="email"
            name="email"
            required
            maxLength={200}
            autoComplete="email"
          />
        </label>
        <label className="field">
          Téléphone
          <input type="tel" name="phone" maxLength={40} autoComplete="tel" />
        </label>
        <label className="field">
          Localisation du projet *
          <input
            name="location"
            required
            maxLength={160}
            autoComplete="address-level2"
            placeholder="Ville ou code postal"
          />
        </label>
        <label className="field">
          Nature du projet *
          <select
            name="project"
            required
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="">Sélectionner</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="autre">Autre projet / à préciser</option>
          </select>
        </label>
        <label className="field">
          Type de bâtiment *
          <select name="building" required>
            <option value="">Sélectionner</option>
            {(profile === "professionnel"
              ? ["Bureaux", "Commerce", "Local professionnel", "Autre bâtiment"]
              : ["Appartement", "Maison", "Autre logement"]
            ).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field full">
          Calendrier prévisionnel
          <input
            name="schedule"
            maxLength={200}
            placeholder="Période souhaitée ou échéance à respecter"
          />
        </label>
        <label className="field full">
          Votre projet en quelques mots *
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={6000}
            placeholder="Les travaux envisagés, l’existant, vos contraintes… (20 caractères minimum)"
          />
        </label>
        <label className="field full">
          Document technique (facultatif)
          <input
            name="document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />
          <small>
            PDF, JPEG, PNG ou WebP · 5 Mo maximum. Évitez les informations
            sensibles.
          </small>
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" required name="consent" value="yes" />
        <span>
          J’ai pris connaissance de la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link> et
          j’accepte que mes informations soient utilisées pour répondre à ma
          demande. *
        </span>
      </label>
      <button
        type="submit"
        className="button form-submit"
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Transmission en cours…"
          : "Transmettre ma demande"}
        <ArrowUpRight size={18} />
      </button>
      <p className="form-hint">
        * Champs obligatoires. Aucun engagement à ce stade.
      </p>
      {message && (
        <div
          role={status === "error" ? "alert" : "status"}
          className={"form-message " + (status === "error" ? "error" : "")}
        >
          {message}
        </div>
      )}
    </form>
  );
}
