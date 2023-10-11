export function pareseIntWithDefault(str?: string, defaultV?: number) {
  if (!str) return defaultV;
  const parsed = parseInt(str);
  if (isNaN(parsed)) return defaultV;
  return parsed;
}
