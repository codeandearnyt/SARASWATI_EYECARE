import { describe, expect, it } from "vitest";
import { MANAGED_ASSET_ORIGIN, managedAssetFallbackUrl } from "../client/src/lib/managedAssets";

describe("managed asset fallback", () => {
  it("maps relative and failed external managed-storage paths to the published asset origin", () => {
    expect(managedAssetFallbackUrl("/manus-storage/clinic-logo.avif")).toBe(`${MANAGED_ASSET_ORIGIN}/manus-storage/clinic-logo.avif`);
    expect(managedAssetFallbackUrl("https://example.vercel.app/manus-storage/clinic-logo.avif")).toBe(`${MANAGED_ASSET_ORIGIN}/manus-storage/clinic-logo.avif`);
  });

  it("leaves unrelated URLs unchanged", () => {
    expect(managedAssetFallbackUrl("https://images.example.org/photo.jpg")).toBe("https://images.example.org/photo.jpg");
  });
});
