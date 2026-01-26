import { getAllArtworks } from '@/lib/sanity'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const artworks = await getAllArtworks()

    return NextResponse.json({
      success: true,
      count: artworks.length,
      artworks: artworks,
      env: {
        hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
