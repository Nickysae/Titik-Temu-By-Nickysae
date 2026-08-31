// Real geographic coordinates for Indonesian cities & landmarks
export const CITY_COORDINATES: Record<string, [number, number]> = {
  surabaya: [-7.2575, 112.7521],
  lamongan: [-7.1219, 112.4158],
  malang: [-7.9666, 112.6326],
  jogja: [-7.7956, 110.3695],
  yogyakarta: [-7.7956, 110.3695],
  jakarta: [-6.2088, 106.8456],
  bandung: [-6.9175, 107.6191],
  semarang: [-6.9667, 110.4167],
  solo: [-7.5755, 110.8243],
  surakarta: [-7.5755, 110.8243],
  denpasar: [-8.6705, 115.2126],
  bali: [-8.4095, 115.1889],
  banyuwangi: [-8.2192, 114.3691],
  bogor: [-6.5971, 106.8060],
  cirebon: [-6.7320, 108.5523],
  padang: [-0.9471, 100.4172],
  medan: [3.5952, 98.6722],
  makassar: [-5.1477, 119.4327],
};

export function getCityCoordinates(cityName: string, index = 0): [number, number] {
  const clean = cityName.trim().toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }

  // Fallback: generate nearby Jawa Timur / Jawa Tengah offset coordinates
  const baseLat = -7.3;
  const baseLng = 112.5;
  const offsetLat = (index * 0.35) % 1.5;
  const offsetLng = (index * 0.45) % 2.0;

  return [baseLat - offsetLat, baseLng + offsetLng];
}

// Calculate Haversine distance in KM
export function getDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
