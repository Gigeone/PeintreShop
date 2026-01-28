// Script pour récupérer des IDs d'œuvres depuis Sanity pour les tests
import { client } from '../lib/sanity/client.ts';

async function getArtworks() {
  try {
    const artworks = await client.fetch(`
      *[_type == "artwork"][0...3]{
        _id,
        title,
        isAvailable,
        price
      }
    `);

    console.log(JSON.stringify(artworks, null, 2));
  } catch (error) {
    console.error('Error fetching artworks:', error);
    process.exit(1);
  }
}

getArtworks();
