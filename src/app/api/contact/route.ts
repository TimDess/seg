import { NextResponse } from "next/server";
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
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024)
    return NextResponse.json(
      { error: "Le document dépasse la taille autorisée." },
      { status: 413 },
    );
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Le formulaire est illisible." },
      { status: 400 },
    );
  }
  const value = (key: string) => String(data.get(key) || "").trim();
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
    ["name", "email", "location", "company", "phone", "schedule"].some(
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
  const document = data.get("document");
  if (document instanceof File && document.size) {
    if (
      document.size > 5 * 1024 * 1024 ||
      !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
        document.type,
      )
    )
      return NextResponse.json(
        { error: "Document non accepté : PDF ou image, 5 Mo maximum." },
        { status: 400 },
      );
  }
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint)
    return NextResponse.json(
      {
        error:
          "Le service d’envoi n’est pas encore configuré. Votre demande n’a pas été transmise.",
      },
      { status: 503 },
    );
  let url: URL;
  try {
    url = new URL(endpoint);
    if (url.protocol !== "https:") throw new Error();
  } catch {
    return NextResponse.json(
      {
        error:
          "Le service de réception est indisponible. Votre demande n’a pas été transmise.",
      },
      { status: 503 },
    );
  }
  limits.set(ip, {
    count: (current?.count || 0) + 1,
    until: current?.until || now + 600000,
  });
  try {
    const headers: Record<string, string> = {};
    if (process.env.CONTACT_WEBHOOK_TOKEN)
      headers.Authorization = "Bearer " + process.env.CONTACT_WEBHOOK_TOKEN;
    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers,
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
    if (!response.ok) throw new Error();
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
