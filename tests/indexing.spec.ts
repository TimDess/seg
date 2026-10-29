import { test, expect } from "@playwright/test";
import { isSiteIndexable } from "../src/lib/indexing";

test("production indexing and preview exclusions use one policy", () => {
  expect(isSiteIndexable({ NODE_ENV: "production" })).toBe(true);
  expect(isSiteIndexable({ NODE_ENV: "development" })).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", SITE_INDEXABLE: "false" }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", VERCEL_ENV: "production" }),
  ).toBe(true);
  expect(
    isSiteIndexable({
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      SITE_INDEXABLE: "true",
    }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", VERCEL_ENV: "development" }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", CONTEXT: "production" }),
  ).toBe(true);
  expect(
    isSiteIndexable({
      NODE_ENV: "production",
      CONTEXT: "deploy-preview",
      SITE_INDEXABLE: "true",
    }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", CONTEXT: "branch-deploy" }),
  ).toBe(false);
});
