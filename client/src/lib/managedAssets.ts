export const MANAGED_ASSET_ORIGIN = "https://saraswatiec-c3na4ugb.manus.space";

export function managedAssetFallbackUrl(source: string) {
  const assetPathIndex = source.indexOf("/manus-storage/");
  if (assetPathIndex < 0) return source;
  return `${MANAGED_ASSET_ORIGIN}${source.slice(assetPathIndex)}`;
}

export function installManagedAssetFallback() {
  const handleAssetError = (event: Event) => {
    const target = event.target;
    const isImage = target instanceof HTMLImageElement;
    const isSource = target instanceof HTMLSourceElement;
    const isIconOrPreload = target instanceof HTMLLinkElement;
    if (!isImage && !isSource && !isIconOrPreload) return;
    if (target.dataset.managedAssetFallbackApplied === "true") return;

    const source = isImage ? target.currentSrc || target.src : isSource ? target.src : target.href;
    const fallback = managedAssetFallbackUrl(source);
    if (fallback === source) return;

    target.dataset.managedAssetFallbackApplied = "true";
    if (isIconOrPreload) target.href = fallback;
    else target.src = fallback;
  };

  document.addEventListener("error", handleAssetError, true);
  return () => document.removeEventListener("error", handleAssetError, true);
}
