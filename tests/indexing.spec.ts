import { test, expect } from "@playwright/test";
import { isSiteIndexable } from "../src/lib/indexing";

test("pre-launch lock blocks indexing even with the previous test flag", () => {
  expect(isSiteIndexable({ NODE_ENV: "production" })).toBe(false);
  expect(isSiteIndexable({ NODE_ENV: "development" })).toBe(false);
  expect(
    isSiteIndexable({
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      SITE_INDEXABLE: "true",
    }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", SITE_INDEXABLE: "false" }),
  ).toBe(false);
  expect(
    isSiteIndexable({ NODE_ENV: "production", VERCEL_ENV: "production" }),
  ).toBe(false);
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
  ).toBe(false);
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
