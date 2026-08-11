import type { Express } from "express";
import sharp from "sharp";
import { siteMetadata, siteShareVersion } from "@shared/siteMetadata";

type RequestLike = {
  headers: {
    host?: string;
    "x-forwarded-host"?: string | string[];
    "x-forwarded-proto"?: string | string[];
  };
};

const PREVIEW_WIDTH = 1200;
const PREVIEW_HEIGHT = 630;

function firstHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value?.split(",")[0]?.trim();
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, character => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character] ?? character;
  });
}

export function getSocialOrigin(req: RequestLike) {
  const forwardedHost = firstHeaderValue(req.headers["x-forwarded-host"]);
  const host = (forwardedHost || req.headers.host || "osamah711x.com")
    .replace(/[^a-zA-Z0-9.:-]/g, "")
    .replace(/:\d+$/, "");
  const forwardedProtocol = firstHeaderValue(req.headers["x-forwarded-proto"]);
  const protocol = forwardedProtocol === "http" ? "http" : "https";
  return `${protocol}://${host}`;
}

export function injectSocialMetadata(template: string, req: RequestLike) {
  const origin = getSocialOrigin(req);
  return template
    .replaceAll("{{SOCIAL_ORIGIN}}", origin)
    .replaceAll("{{SOCIAL_PREVIEW_VERSION}}", siteShareVersion);
}

function buildPreviewBackgroundSvg() {
  const title = escapeXml(siteMetadata.name);
  const subtitle = escapeXml(siteMetadata.description);
  const services = escapeXml(siteMetadata.featuredServices.join("  •  "));

  return `
    <svg width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#07172e"/>
          <stop offset="0.55" stop-color="#102646"/>
          <stop offset="1" stop-color="#3e1e67"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#31d5ff"/>
          <stop offset="1" stop-color="#9c5cff"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#background)"/>
      <circle cx="110" cy="110" r="215" fill="#1e70dc" opacity="0.20"/>
      <circle cx="650" cy="590" r="260" fill="#9c5cff" opacity="0.14"/>
      <path d="M0 510 C260 430 430 610 760 490 C940 420 1030 420 1200 470 V630 H0Z" fill="#07172e" opacity="0.55"/>
      <g opacity="0.18" stroke="#73ceff" stroke-width="1">
        <path d="M60 86H700M60 150H620M60 214H700M60 278H600M60 342H720M60 406H620"/>
        <path d="M80 62V450M160 62V450M240 62V450M320 62V450M400 62V450M480 62V450M560 62V450M640 62V450"/>
      </g>
      <rect x="726" y="70" width="406" height="490" rx="44" fill="#0b1731" stroke="url(#accent)" stroke-width="4" opacity="0.9"/>
      <rect x="76" y="105" width="172" height="44" rx="22" fill="#163c68" stroke="#4dcfff" stroke-width="1"/>
      <text x="162" y="135" text-anchor="middle" fill="#bfeeff" font-family="Arial, sans-serif" font-size="21" font-weight="700">خدمات هندسية موثوقة</text>
      <text x="76" y="238" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${title}</text>
      <text x="76" y="302" fill="#8cd7ff" font-family="Arial, sans-serif" font-size="28" font-weight="600">${subtitle}</text>
      <text x="76" y="385" fill="#e6eefb" font-family="Arial, sans-serif" font-size="25">${services}</text>
      <rect x="76" y="452" width="350" height="4" rx="2" fill="url(#accent)"/>
      <text x="76" y="505" fill="#c8d5eb" font-family="Arial, sans-serif" font-size="21">حلول منزلية احترافية في مكة المكرمة</text>
    </svg>`;
}

async function createRoundedProfile() {
  const response = await fetch(siteMetadata.profileImageUrl);
  if (!response.ok) {
    throw new Error(`Unable to load profile image: ${response.status}`);
  }

  const profileImage = Buffer.from(await response.arrayBuffer());
  const mask = Buffer.from(`
    <svg width="360" height="440" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="440" rx="34" fill="white"/>
    </svg>`);

  return sharp(profileImage)
    .resize(360, 440, { fit: "cover", position: "centre" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

export async function createSocialPreviewPng() {
  const background = await sharp(Buffer.from(buildPreviewBackgroundSvg())).png().toBuffer();

  try {
    const profile = await createRoundedProfile();
    return sharp(background)
      .composite([{ input: profile, left: 749, top: 94 }])
      .png()
      .toBuffer();
  } catch (error) {
    console.warn("[Social Preview] Profile image unavailable; returning branded preview.", error);
    return background;
  }
}

export function registerSocialPreviewRoutes(app: Express) {
  app.get("/social-preview.png", async (_req, res) => {
    try {
      const image = await createSocialPreviewPng();
      res
        .status(200)
        .set({
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          "Content-Type": "image/png",
        })
        .send(image);
    } catch (error) {
      console.error("[Social Preview] Failed to create preview.", error);
      res.status(500).send("Unable to create social preview");
    }
  });
}
