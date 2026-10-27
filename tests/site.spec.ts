import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/expertises",
  "/realisations",
  "/entreprise",
  "/particuliers",
  "/renovation-electrique-tertiaire",
  "/installation-electrique-neuve",
  "/courants-forts-et-faibles",
  "/mise-en-conformite-electrique",
  "/projet-bureaux",
  "/projet-locaux-professionnels",
  "/zones-intervention",
  "/conseils",
  "/mentions-legales",
  "/confidentialite",
  "/contact",
];
test("all pages have distinct titles, one heading and valid local links", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), title).toBe(false);
    titles.add(title);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) =>
        els.map((e) => e.getAttribute("href")!.split("?")[0]),
      );
    for (const link of new Set(links))
      expect(routes.includes(link), link).toBe(true);
  }
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/page-inexistante")).status()).toBe(404);
});
test("desktop images load and layout fits viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".hero-visual img")).toBeVisible();
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
});
test("mobile navigation, contact paths and overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/expertises", "/realisations", "/contact"]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Particuliers", exact: true })
    .click();
  await expect(page).toHaveURL(/particuliers/);
  await page
    .getByRole("link", { name: "Présenter mon projet résidentiel" })
    .click();
  await expect(
    page.getByRole("button", { name: "Particulier", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Entreprise")).toHaveCount(0);
  await page.goto("/");
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0));
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});
test("contact validates and never reports a fictitious delivery", async ({
  page,
  request,
}) => {
  await page.goto("/contact?projet=renovation-electrique-tertiaire");
  await expect(page.getByLabel("Nature du projet")).toHaveValue(
    "renovation-electrique-tertiaire",
  );
  await page.getByLabel("Entreprise").fill("Test SEG");
  await page.getByLabel("Nom et prénom").fill("Personne Test");
  await page.getByLabel("Adresse e-mail").fill("test@example.com");
  await page.getByLabel("Localisation du projet").fill("Ennery");
  await page.getByLabel("Type de bâtiment").selectOption("Bureaux");
  await page
    .getByLabel("Votre projet en quelques mots")
    .fill("Une rénovation complète des bureaux à étudier.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Transmettre ma demande" }).click();
  await expect(page.locator(".form-message[role=alert]")).toContainText(
    "Votre demande n’a pas été transmise",
  );
  expect(
    (
      await request.post("/api/contact", { multipart: { name: "Invalid" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: "https://untrusted.example" },
        multipart: { name: "Invalid" },
      })
    ).status(),
  ).toBe(403);
});
test("contact handles an accepted delivery", async ({ page }) => {
  await page.goto("/contact?profil=particulier");
  await page.getByLabel("Nom et prénom").fill("Personne Test");
  await page.getByLabel("Adresse e-mail").fill("test@example.com");
  await page.getByLabel("Localisation du projet").fill("Ennery");
  await page.getByLabel("Nature du projet").selectOption("autre");
  await page.getByLabel("Type de bâtiment").selectOption("Maison");
  await page
    .getByLabel("Votre projet en quelques mots")
    .fill("Un projet résidentiel à étudier avec votre équipe.");
  await page.getByRole("checkbox").check();
  await page.route("**/api/contact", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await page.getByRole("button", { name: "Transmettre ma demande" }).click();
  await expect(page.getByRole("status")).toContainText(
    "transmise au service de réception",
  );
});
test('API rejects invalid attachments before delivery',async({request})=>{const data={profile:'particulier',name:'Personne Test',email:'test@example.com',location:'Ennery',project:'autre',building:'Maison',description:'Un projet résidentiel à étudier avec SEG.',consent:'yes'};const invalid=await request.post('/api/contact',{multipart:{...data,document:{name:'script.html',mimeType:'text/html',buffer:Buffer.from('<script>test</script>')}}});expect(invalid.status()).toBe(400);expect((await invalid.json()).error).toContain('Document non accepté');const valid=await request.post('/api/contact',{multipart:data});expect(valid.status()).toBe(503);expect((await valid.json()).error).toContain('n’a pas été transmise')});
