import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

/**
 * Route API temporaire pour lister les œuvres avec leurs IDs
 * GET /api/artworks-list
 *
 * Utile pour trouver les IDs d'œuvres pour tester l'API checkout
 */
export async function GET() {
  try {
    const artworks = await client.fetch(
      `*[_type == "artwork"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        price,
        isAvailable
      }`
    );

    return NextResponse.json({
      count: artworks.length,
      artworks: artworks,
    });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}
