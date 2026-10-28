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
  await expect(page.locator(".territory-map svg")).toBeVisible();
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const el of await page.locator("[data-reveal]").all()) {
    await el.scrollIntoViewIfNeeded();
    await expect(el).toHaveAttribute("data-reveal", "visible");
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("[data-reveal=visible]")).every(
      (el) => getComputedStyle(el).opacity === "1",
    ),
  );
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
    await expect
      .poll(() =>
        img.evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  for (const el of await page.locator("[data-reveal]").all()) {
    await el.scrollIntoViewIfNeeded();
    await expect(el).toHaveAttribute("data-reveal", "visible");
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("[data-reveal=visible]")).every(
      (el) => getComputedStyle(el).opacity === "1",
    ),
  );
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
test("API rejects invalid attachments before delivery", async ({ request }) => {
  const data = {
    profile: "particulier",
    name: "Personne Test",
    email: "test@example.com",
    location: "Ennery",
    project: "autre",
    building: "Maison",
    description: "Un projet résidentiel à étudier avec SEG.",
    consent: "yes",
  };
  const invalid = await request.post("/api/contact", {
    multipart: {
      ...data,
      document: {
        name: "script.html",
        mimeType: "text/html",
        buffer: Buffer.from("<script>test</script>"),
      },
    },
  });
  expect(invalid.status()).toBe(400);
  expect((await invalid.json()).error).toContain("Document non accepté");
  const valid = await request.post("/api/contact", { multipart: data });
  expect(valid.status()).toBe(503);
  expect((await valid.json()).error).toContain("n’a pas été transmise");
});

test("reference motion reveals content and ticker can be paused", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Mettre en pause le défilement des expertises",
    })
    .click();
  await expect(page.locator(".expertise-ticker")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await page
    .getByRole("button", { name: "Reprendre le défilement des expertises" })
    .click();
  await expect(page.locator(".expertise-ticker")).toHaveAttribute(
    "data-paused",
    "false",
  );
  const card = page.locator(".service-row").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-reveal", "visible");
  await expect(card).toHaveCSS("opacity", "1");
  await card.click();
  await expect(page).toHaveURL(/renovation-electrique-tertiaire/);
  await expect(page.locator("h1")).toContainText(
    "Rénovation électrique tertiaire",
  );
});
test("reduced motion leaves content visible and stops animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-word").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".ticker-track")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".service-row").first()).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-reveal=pending]")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation")).toBeHidden();
});
test("content remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.locator(".service-row").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".service-row")).toHaveCount(4);
  await expect(page.locator(".territory-map")).toBeVisible();
  await context.close();
});

test("all pages fit narrow screens after fonts load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/expertises",
      "/contact",
      "/realisations",
      "/renovation-electrique-tertiaire",
      "/mentions-legales",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});

test("theme toggle persists through navigation and reload", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Activer le thème sombre" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(2, 6, 23)",
  );
  await expect(page.locator(".hero-actions .button")).toHaveCSS(
    "background-color",
    "rgb(251, 191, 36)",
  );
  await expect(page.locator(".hero-actions .button")).toHaveCSS(
    "color",
    "rgb(15, 23, 42)",
  );
  await expect(page.locator(".brand .seg-logo")).toHaveCSS(
    "color",
    "rgb(248, 250, 252)",
  );
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Expertises", exact: true })
    .click();
  await expect(page).toHaveURL(/expertises/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Activer le thème clair" }),
  ).toBeEnabled();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Activer le thème clair" }).click();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(245, 245, 242)",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("system theme applies initially and explicit choice wins", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Activer le thème clair" }),
  ).toBeEnabled();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Activer le thème sombre" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("theme works without browser storage and fits mobile", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage unavailable");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Activer le thème sombre" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const route of ["/", "/contact", "/expertises"]) {
    await page.goto(route);
    await page.getByRole("button", { name: "Activer le thème sombre" }).click();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page.keyboard.press("Escape");
  }
});
