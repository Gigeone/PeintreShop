import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Icône affichée quand le site est ajouté à l'écran d'accueil (iPhone, iPad)
 */
export default async function AppleIcon() {
  const font = await loadFraunces("MNGH");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1D1B26",
          color: "#F4EFE6",
          fontFamily: "Fraunces",
          fontSize: 46,
          letterSpacing: "0.06em",
        }}
      >
        MNGH
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, weight: 500, style: "normal" }] : undefined,
    }
  );
}
