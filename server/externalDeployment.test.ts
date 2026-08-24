import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("external static deployment safeguards", () => {
  it("forwards protected APIs and project-managed media through Vercel before the SPA fallback", () => {
    const config = JSON.parse(readFileSync(resolve(projectRoot, "vercel.json"), "utf8"));
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites[0]).toEqual({
      source: "/api/:path*",
      destination: "https://saraswatiec-c3na4ugb.manus.space/api/:path*",
    });
    expect(config.rewrites[1]).toEqual({
      source: "/manus-storage/:path*",
      destination: "https://saraswatiec-c3na4ugb.manus.space/manus-storage/:path*",
    });
    expect(config.rewrites[2]).toEqual({ source: "/(.*)", destination: "/index.html" });
  });

  it("ships public security reporting metadata and baseline browser protections", () => {
    const securityTxt = readFileSync(resolve(projectRoot, "client/public/.well-known/security.txt"), "utf8");
    const config = JSON.parse(readFileSync(resolve(projectRoot, "vercel.json"), "utf8"));
    const headers = config.headers[0].headers as Array<{ key: string; value: string }>;
    expect(securityTxt).toContain("Contact: mailto:");
    expect(headers).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "Content-Security-Policy" }),
      expect.objectContaining({ key: "X-Content-Type-Options", value: "nosniff" }),
      expect.objectContaining({ key: "Permissions-Policy" }),
    ]));
  });

  it("does not ship unresolved analytics placeholders in the public document", () => {
    const html = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(html).not.toContain("%VITE_ANALYTICS_WEBSITE_ID%");
  });
});
