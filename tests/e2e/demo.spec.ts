import { test, expect } from "@playwright/test";
const sizes = [
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1600, 900],
  [1920, 1080],
  [1280, 720],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [375, 812],
  [360, 800],
  [320, 568],
];
for (const [width, height] of sizes) {
  test(`responsive routes ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of [
      "/",
      "/demo",
      "/product",
      "/individuals",
      "/enterprise",
      "/technology",
      "/research",
      "/docs",
      "/about",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} horizontal overflow`,
      ).toBeTruthy();
      if (route === "/" && width >= 1024) {
        const cta = page
          .getByRole("link", { name: "Try Demo", exact: true })
          .nth(1);
        const box = await cta.boundingBox();
        expect(box!.y + box!.height).toBeLessThan(height);
        const visual = await page.getByText("PIPELINE SCHEMATIC").boundingBox();
        expect(visual!.y).toBeLessThan(height);
      }
      if (route === "/" && width === 1366)
        await page.screenshot({ path: "test-results/home-desktop.png" });
      if (route === "/demo" && width === 390)
        await page.screenshot({
          path: "test-results/demo-mobile.png",
          fullPage: true,
        });
    }
  });
}
for (const [width, height] of [
  [1366, 768],
  [390, 844],
]) {
  test(`real upload-to-report ${width}x${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page
      .getByRole("link", { name: "Try Demo", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/demo$/);
    await page.getByLabel("Upload a file", { exact: true }).setInputFiles({
      name: "blank.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "Email: alex@example.com\nEmployee ID: ABC123\nConfidential\nAPI_KEY=demo-only",
      ),
    });
    await page.getByLabel("Search platforms").fill("ChatGPT");
    await page.getByLabel("Selected platform").selectOption("chatgpt");
    await page
      .getByRole("button", { name: "Analyze Exposure", exact: true })
      .click();
    await expect(
      page.getByText("Understand before you share.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Email-like pattern", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Why This Score?" }),
    ).toBeVisible();
    await page.locator("summary").first().click();
    await expect(
      page
        .getByRole("link", { name: /official privacy documentation/ })
        .first(),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/result-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Analyze Another File", exact: true })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: "Analyze your exposure." }),
    ).toBeVisible();
  });
}
test("mobile navigation and validation errors", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "Research" })
    .click();
  await expect(page).toHaveURL(/\/research$/);
  await page.goto("/demo");
  await page.getByLabel("Upload a file", { exact: true }).setInputFiles({
    name: "x.mp4",
    mimeType: "video/mp4",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.getByRole("alert")).toContainText(
    "Video analysis is not supported",
  );
  await page.getByLabel("Upload a file", { exact: true }).setInputFiles({
    name: "a.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello"),
  });
  await page.getByLabel("Selected platform").selectOption("other");
  await page
    .getByRole("button", { name: "Analyze Exposure", exact: true })
    .click();
  await expect(
    page.getByText("Not enough verified information.", { exact: false }),
  ).toBeVisible();
});
