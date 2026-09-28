import type { LngLat } from './types';

// CGCS2000 and WGS-84 differ by < 5 cm for consumer purposes.
// We treat them as identical with a documentation note.

export function cgcs2000ToWgs84(lng: number, lat: number): LngLat {
  return { lng, lat };
}

export function wgs84ToCgcs2000(lng: number, lat: number): LngLat {
  return { lng, lat };
}