import type { LngLat } from './types';

export function formatDecimal(lngLat: LngLat, precision = 6): string {
  return `${lngLat.lat.toFixed(precision)}, ${lngLat.lng.toFixed(precision)}`;
}

export function formatDMS(lngLat: LngLat): string {
  const latDir = lngLat.lat >= 0 ? 'N' : 'S';
  const lngDir = lngLat.lng >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lngLat.lat);
  const absLng = Math.abs(lngLat.lng);

  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = Math.round(((absLat - latDeg) * 60 - latMin) * 60 * 10) / 10;

  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = Math.round(((absLng - lngDeg) * 60 - lngMin) * 60 * 10) / 10;

  return `${latDeg}°${latMin}′${latSec}″${latDir}, ${lngDeg}°${lngMin}′${lngSec}″${lngDir}`;
}