/**
 * Asset QR encodes a public verify URL so phone cameras open the web app.
 * Legacy payloads used raw JSON; both formats are accepted when scanning.
 */

export function getPublicAppOrigin() {
  const explicit = process.env.FRONTEND_URL?.trim().replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }
  return "http://localhost:5173";
}

export function buildAssetVerifyUrl(assetId, assetToken) {
  const base = getPublicAppOrigin();
  const url = new URL("/stock/assets-management/verify", `${base}/`);
  url.searchParams.set("id", assetId);
  url.searchParams.set("token", assetToken);
  return url.toString();
}

const readPipeField = (trimmed, key) => {
  const pattern = new RegExp(`\\|?${key}:([^|]+)`, "i");
  return trimmed.match(pattern)?.[1]?.trim() || "";
};

const parseCompactAssetPayload = (trimmed) => {
  if (!/ASSETTAG:|ASSET\|TAG:|IID:|(?:^|\|)ID:/i.test(trimmed)) {
    return null;
  }

  const assetTag =
    readPipeField(trimmed, "ASSETTAG") ||
    (trimmed.startsWith("ASSET|") ? readPipeField(trimmed, "TAG") : "");
  const assetId = readPipeField(trimmed, "ID") || readPipeField(trimmed, "IID");
  const location = readPipeField(trimmed, "LOCATION");
  const assetToken = readPipeField(trimmed, "TOKEN");

  if (!assetId && !assetTag) {
    return null;
  }

  return {
    assetId: assetId || undefined,
    assetTag: assetTag || undefined,
    location: location || undefined,
    assetToken: assetToken || undefined,
    format: trimmed.startsWith("ASSET|") ? "legacy-pipe" : "compact",
  };
};

export function parseAssetQrPayload(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const id = url.searchParams.get("id") ?? url.searchParams.get("assetId");
      const token = url.searchParams.get("token") ?? url.searchParams.get("t");
      if (id && token) {
        return { assetId: id.trim(), assetToken: token.trim(), format: "url" };
      }
    } catch {
      return null;
    }
    return null;
  }

  const compact = parseCompactAssetPayload(trimmed);
  if (compact) {
    return compact;
  }

  try {
    const parsed = JSON.parse(trimmed);
    const assetId = String(parsed.assetId || parsed.id || "").trim();
    const assetToken = String(parsed.assetToken || parsed.token || "").trim();
    if (assetId && assetToken) {
      return { assetId, assetToken, format: "json" };
    }
  } catch {
    return null;
  }

  return null;
}
