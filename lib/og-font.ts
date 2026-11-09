/**
 * Charge la police Fraunces (Google Fonts) pour les images générées
 * avec next/og (favicon iPhone, image de partage).
 *
 * Seuls les caractères de `text` sont téléchargés. En cas d'échec réseau,
 * renvoie null : l'image est alors générée avec la police par défaut.
 */
export async function loadFraunces(text: string, weight = 500): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Fraunces:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const response = await fetch(fontUrl);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}
