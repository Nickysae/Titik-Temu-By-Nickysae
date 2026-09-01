import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinates } from "@/lib/geo";

// Server-side in-memory cache to be polite to Nominatim OSM rate limits
const geoCache: Record<string, { lat: number; lng: number; displayName: string }> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const cleanQuery = query.toLowerCase();

    // Check memory cache first
    if (geoCache[cleanQuery]) {
      return NextResponse.json({
        results: [
          {
            lat: geoCache[cleanQuery].lat,
            lng: geoCache[cleanQuery].lng,
            displayName: geoCache[cleanQuery].displayName,
          },
        ],
      });
    }

    // Call Nominatim OpenStreetMap API scoped to Indonesia (countrycodes=id)
    const encoded = encodeURIComponent(query);
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5&countrycodes=id`;

    const res = await fetch(osmUrl, {
      headers: {
        "User-Agent": "TitikTemuApp/1.0 (contact: support@titiktemu.app)",
        "Accept-Language": "id,en;q=0.8",
      },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!res.ok) {
      // Fallback to static coordinates if OSM temporarily throttled
      const [fallbackLat, fallbackLng] = getCityCoordinates(query, 0);
      return NextResponse.json({
        results: [
          {
            lat: fallbackLat,
            lng: fallbackLng,
            displayName: query,
          },
        ],
      });
    }

    const items = await res.json();

    if (!items || items.length === 0) {
      const [fallbackLat, fallbackLng] = getCityCoordinates(query, 0);
      return NextResponse.json({
        results: [
          {
            lat: fallbackLat,
            lng: fallbackLng,
            displayName: query,
          },
        ],
      });
    }

    const results = items.map((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      return {
        lat,
        lng,
        displayName: item.display_name,
        type: item.type || "place",
      };
    });

    // Save top result in cache
    if (results[0]) {
      geoCache[cleanQuery] = {
        lat: results[0].lat,
        lng: results[0].lng,
        displayName: results[0].displayName,
      };
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Geocode API error:", error);
    return NextResponse.json(
      { error: "Gagal mencari geolokasi" },
      { status: 500 }
    );
  }
}
