import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinates } from "@/lib/geo";

// POST /api/route - fetch real road route from OpenRouteService
export async function POST(req: NextRequest) {
  try {
    const { locations } = await req.json();

    if (!locations || locations.length < 2) {
      return NextResponse.json({ error: "At least 2 locations required" }, { status: 400 });
    }

    // Fetch dynamic OSM coordinates for specific desa/kecamatan/kota
    const coordinates: [number, number][] = [];
    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i].trim();
      try {
        const encoded = encodeURIComponent(loc);
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=id`,
          {
            headers: {
              "User-Agent": "TitikTemuApp/1.0 (contact: support@titiktemu.app)",
            },
          }
        );
        if (osmRes.ok) {
          const data = await osmRes.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            coordinates.push([lon, lat]); // [lng, lat] for ORS
            continue;
          }
        }
      } catch (e) {
        // Fallback below
      }

      // Static fallback if Nominatim empty
      const [fallbackLat, fallbackLng] = getCityCoordinates(loc, i);
      coordinates.push([fallbackLng, fallbackLat]);
    }

    // If only 2 locations and distance calculation requested
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      // Fallback: calculate Haversine distance if no ORS API key
      const [lng1, lat1] = coordinates[0];
      const [lng2, lat2] = coordinates[1];
      const { getDistanceKm } = await import("@/lib/geo");
      const straightKm = getDistanceKm([lat1, lng1], [lat2, lng2]);

      return NextResponse.json({
        type: "straight",
        coordinates: coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
        distanceKm: straightKm,
      });
    }

    // Call OpenRouteService Directions API
    const orsRes = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates }),
      }
    );

    if (!orsRes.ok) {
      const err = await orsRes.text();
      console.error("ORS error:", err);
      // Fallback to straight lines
      return NextResponse.json({ type: "straight", coordinates });
    }

    const geojson = await orsRes.json();
    const routeCoords =
      geojson?.features?.[0]?.geometry?.coordinates || coordinates;

    // ORS returns [lng, lat], Leaflet needs [lat, lng]
    const leafletCoords = routeCoords.map(([lng, lat]: [number, number]) => [lat, lng]);

    const distanceMeters = geojson?.features?.[0]?.properties?.summary?.distance || 0;
    const distanceKm = Math.round(distanceMeters / 1000);

    return NextResponse.json({
      type: "road",
      coordinates: leafletCoords,
      distanceKm,
    });
  } catch (error) {
    console.error("Route API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
