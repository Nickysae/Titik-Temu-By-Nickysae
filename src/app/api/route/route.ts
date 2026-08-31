import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinates } from "@/lib/geo";

// POST /api/route - fetch real road route from OpenRouteService
export async function POST(req: NextRequest) {
  try {
    const { locations } = await req.json();

    if (!locations || locations.length < 2) {
      return NextResponse.json({ error: "At least 2 locations required" }, { status: 400 });
    }

    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      // Fallback: return straight-line coordinates if no API key set
      const coords = locations.map((loc: string, i: number) => {
        const [lat, lng] = getCityCoordinates(loc, i);
        return [lng, lat]; // ORS uses [lng, lat] format
      });
      return NextResponse.json({ type: "straight", coordinates: coords });
    }

    // Build ORS coordinate pairs [lng, lat]
    const coordinates = locations.map((loc: string, i: number) => {
      const [lat, lng] = getCityCoordinates(loc, i);
      return [lng, lat];
    });

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
