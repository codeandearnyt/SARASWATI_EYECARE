export const publicNavItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Photos", "/photo"],
  ["Videos", "/video"],
  ["Equipment", "/equipment"],
  ["Empanelments", "/empanelment"],
  ["Career", "/career"],
  ["Contact", "/contact"],
] as const;

const publicPaths = new Set(["/", ...publicNavItems.map(([, path]) => path)]);

export function isAdminHashRoute(hash: string) {
  return hash === "#/admin" || hash === "#/admin/blog";
}

export function legacyPublicHashPath(hash: string) {
  if (!hash.startsWith("#/")) return null;
  const path = hash.slice(1) || "/";
  return publicPaths.has(path) ? path : null;
}
