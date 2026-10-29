/** Temporary pre-launch lock. Re-enable only when SEG approves publication.
 * This also overrides SITE_INDEXABLE=true left over from the PageSpeed test.
 */
const publicationApproved = false;
export function isSiteIndexable(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (!publicationApproved) return false;
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return false;
  if (env.CONTEXT && env.CONTEXT !== "production") return false;
  if (env.SITE_INDEXABLE === "false") return false;
  if (env.SITE_INDEXABLE === "true") return true;
  return env.NODE_ENV === "production";
}
