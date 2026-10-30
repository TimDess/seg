import { test, expect } from "@playwright/test";

test("contact sends through Resend and reports provider failures without false success", async () => {
  const { POST } = require("../src/app/api/contact/route") as typeof import("../src/app/api/contact/route");
  const previousKey = process.env.RESEND_API_KEY;
  const previousRecipient = process.env.CONTACT_TO_EMAIL;
  const originalFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = "re_test_not_a_real_key";
  process.env.CONTACT_TO_EMAIL = "recipient@example.com";
  const payload = {
    profile: "particulier", name: "Personne Test", email: "sender@example.com",
    location: "Ennery", project: "autre", building: "Maison", consent: "yes",
    description: "Un projet résidentiel à étudier avec SEG.",
    document: { name: "plan.pdf", type: "application/pdf", content: "JVBERi0xLjQ=" },
  };
  const request = () => new Request("https://seg.example/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://seg.example", "x-forwarded-for": "resend-unit-test" },
    body: JSON.stringify(payload),
  });
  let providerStatus = 200;
  let sentEmail: { from: string; to: string; reply_to: string; text: string; attachments: { content: string }[] } | undefined;
  globalThis.fetch = async (url, options) => {
    expect(String(url)).toBe("https://api.resend.com/emails");
    sentEmail = JSON.parse(options!.body as string);
    return Response.json(providerStatus === 200 ? { id: "email-test" } : {
      name: "validation_error", message: "Provider detail must not be exposed",
    }, { status: providerStatus });
  };
  try {
    const sent = await POST(request());
    expect(sent.status).toBe(200);
    expect(await sent.json()).toEqual({ ok: true });
    expect(sentEmail!.from).toBe("onboarding@resend.dev");
    expect(sentEmail!.to).toBe("recipient@example.com");
    expect(sentEmail!.reply_to).toBe("sender@example.com");
    expect(sentEmail!.text).toContain(payload.description);
    expect(sentEmail!.attachments[0].content).toBe(payload.document.content);
    providerStatus = 403;
    const rejected = await POST(request());
    expect(rejected.status).toBe(502);
    expect(await rejected.text()).not.toContain("Provider detail");
    globalThis.fetch = async () => { throw new Error("Network unavailable"); };
    expect((await POST(request())).status).toBe(502);
    delete process.env.RESEND_API_KEY;
    expect((await POST(request())).status).toBe(503);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousRecipient === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = previousRecipient;
  }
});
