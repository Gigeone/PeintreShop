import { ImageResponse } from "next/og";
import { getAvailableArtworks, getFeaturedArtworks } from "@/lib/sanity";
import { loadFraunces } from "@/lib/og-font";

export const alt = "MNGH — Peintures originales, pièces uniques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image affichée lors du partage du site (réseaux sociaux, WhatsApp, SMS…)
 * Elle reprend la première œuvre en vedette, accrochée sur le "mur" du site.
 */
export default async function OpengraphImage() {
  const [featured, available] = await Promise.all([getFeaturedArtworks(), getAvailableArtworks()]);
  const artwork = featured[0] ?? available[0];
  const font = await loadFraunces("MNGHPeintures originales, pièces uniques");

  // Taille de la toile dans le cadre de droite (680 × 630 moins 56 px de marge), sans déformation
  const ratio = (artwork?.imageWidth ?? 4) / (artwork?.imageHeight ?? 3);
  const imageWidth = Math.round(Math.min(568, 518 * ratio));
  const imageHeight = Math.round(imageWidth / ratio);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F4EFE6", color: "#1D1B26" }}>
        <div
          style={{
            width: 520,
            padding: "0 72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            fontFamily: "Fraunces",
          }}
        >
          <div style={{ fontSize: 96, letterSpacing: "0.06em" }}>MNGH</div>
          <div style={{ width: 48, height: 3, background: "#2A3A8F" }} />
          <div style={{ fontSize: 36, lineHeight: 1.2, color: "#4A4654" }}>
            Peintures originales, pièces uniques
          </div>
        </div>
        <div
          style={{
            width: 680,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ECE5D8",
          }}
        >
          {artwork && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${artwork.imageUrl}?w=900&fm=jpg`}
              alt=""
              width={imageWidth}
              height={imageHeight}
              style={{
                boxShadow: "0 24px 48px -20px rgba(29,27,38,0.55)",
              }}
            />
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, weight: 500, style: "normal" }] : undefined,
    }
  );
}
