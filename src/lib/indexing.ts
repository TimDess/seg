/** Production is public by default; preview/development deployments stay private. */
export function isSiteIndexable(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return false;
  if (env.CONTEXT && env.CONTEXT !== "production") return false;
  if (env.SITE_INDEXABLE === "false") return false;
  if (env.SITE_INDEXABLE === "true") return true;
  return env.NODE_ENV === "production";
}
