export const runtime = 'edge';
import { NextResponse } from "next/server";
import { Resend } from "resend";
const limits = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (
        new URL(origin).host !==
        (request.headers.get("host") || new URL(request.url).host)
      )
        throw new Error();
    } catch {
      return NextResponse.json(
        { error: "Origine de la demande non autorisée." },
        { status: 403 },
      );
    }
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  for (const [k, v] of limits) if (v.until < now) limits.delete(k);
  const current = limits.get(ip);
  if (current && current.count >= 5)
    return NextResponse.json(
      { error: "Trop de demandes. Veuillez réessayer dans quelques minutes." },
      { status: 429 },
    );
  if (Number(request.headers.get("content-length") || 0) > 8 * 1024 * 1024)
    return NextResponse.json(
      { error: "Le document dépasse la taille autorisée." },
      { status: 413 },
    );
  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 8 * 1024 * 1024)
      return NextResponse.json({ error: "Le document dépasse la taille autorisée." }, { status: 413 });
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    data = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Le formulaire est illisible." },
      { status: 400 },
    );
  }
  const value = (key: string) => typeof data[key] === "string" ? data[key].trim() : "";
  const required = [
    "name",
    "email",
    "location",
    "project",
    "building",
    "description",
  ];
  if (
    required.some((k) => !value(k)) ||
    value("description").length < 20 ||
    value("description").length > 6000 ||
    !/^\S+@\S+\.\S+$/.test(value("email")) ||
    value("consent") !== "yes" ||
    !["professionnel", "particulier"].includes(value("profile")) ||
    (value("profile") === "professionnel" && !value("company")) ||
    ["name", "email", "location", "company", "phone", "schedule", "project", "building"].some(
      (k) => value(k).length > 200,
    )
  )
    return NextResponse.json(
      {
        error:
          "Vérifiez les champs obligatoires, l’adresse e-mail et la description (20 à 6 000 caractères).",
      },
      { status: 400 },
    );
  const attachments: { filename: string; content: string; contentType: string }[] = [];
  if (data.document != null) {
    const file = data.document as Record<string, unknown>;
    const content = typeof file.content === "string" ? file.content : "";
    const name = typeof file.name === "string" ? file.name : "";
    const type = typeof file.type === "string" ? file.type : "";
    const size = content.length * 3 / 4 - (content.endsWith("==") ? 2 : content.endsWith("=") ? 1 : 0);
    if (
      !name || name.length > 160 || /[\\/\r\n\x00]/.test(name) ||
      !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(type) ||
      !content || content.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(content) ||
      size > 5 * 1024 * 1024
    ) return NextResponse.json({ error: "Document non accepté : PDF ou image, 5 Mo maximum." }, { status: 400 });
    attachments.push({ filename: name, content, contentType: type });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL || "timdessaigne@gmail.com";
  if (!apiKey || !/^\S+@\S+\.\S+$/.test(recipient))
    return NextResponse.json(
      { error: "Le service d’envoi n’est pas encore configuré. Votre demande n’a pas été transmise." },
      { status: 503 },
    );
  limits.set(ip, {
    count: (current?.count || 0) + 1,
    until: current?.until || now + 600000,
  });
  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipient,
      replyTo: value("email"),
      subject: "Nouvelle demande de devis — SEG",
      text: [
        "Nouvelle demande de devis depuis le site SEG",
        "",
        "Profil : " + value("profile"),
        "Entreprise : " + (value("company") || "Non renseignée"),
        "Nom : " + value("name"),
        "E-mail : " + value("email"),
        "Téléphone : " + (value("phone") || "Non renseigné"),
        "Localisation : " + value("location"),
        "Nature du projet : " + value("project"),
        "Bâtiment : " + value("building"),
        "Calendrier : " + (value("schedule") || "Non renseigné"),
        "",
        value("description"),
        "",
        "Consentement au traitement de la demande : oui",
      ].join("\n"),
      attachments,
    }, { signal: AbortSignal.timeout(15000) });
    if (error || !sent?.id) throw new Error("Email not accepted");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Le service de réception n’a pas confirmé l’envoi. Réessayez ultérieurement.",
      },
      { status: 502 },
    );
  }
}
