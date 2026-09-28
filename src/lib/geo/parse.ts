import type { LngLat } from './types';

// Degree-Minute-Second (DMS) patterns
const DMS_RE =
  /^([+-]?)(\d{1,3})[°度]\s*(\d{1,2})[′分']\s*(\d{1,2}(?:\.\d+)?)[″秒"]?\s*([NSEW]?)\s*[,，\s]\s*([+-]?)(\d{1,3})[°度]\s*(\d{1,2})[′分']\s*(\d{1,2}(?:\.\d+)?)[″秒"]?\s*([NSEW]?)$/i;

// Degree-Minute (DDM) pattern
const DDM_RE =
  /^([+-]?)(\d{1,3})[°度]\s*(\d{1,2}(?:\.\d+)?)[′分']\s*([NSEW]?)\s*[,，\s]\s*([+-]?)(\d{1,3})[°度]\s*(\d{1,2}(?:\.\d+)?)[′分']\s*([NSEW]?)$/i;

// Decimal degrees pattern — lng,lat with various separators
const DECIMAL_RE =
  /^([+-]?)(\d{1,3}(?:\.\d+)?)\s*[,，;\s]+\s*([+-]?)(\d{1,3}(?:\.\d+)?)$/;

// Lat/lng with N/S/E/W markers (first = lat, second = lng)
const LL_NS_RE = /^([+-]?\d{1,3}(?:\.\d+)?)\s*[NnSs]\s*[,，\s]+\s*([+-]?\d{1,3}(?:\.\d+)?)\s*[EeWw]$/;

function parseDMS(str: string): LngLat | null {
  const m = str.trim().match(DMS_RE);
  if (!m) return null;

  const v1 = parseFloat(m[2]) + parseInt(m[3], 10) / 60 + parseFloat(m[4]) / 3600;
  const v2 = parseFloat(m[7]) + parseInt(m[8], 10) / 60 + parseFloat(m[9]) / 3600;

  const dir1 = (m[5] || '').toUpperCase();
  const dir2 = (m[10] || '').toUpperCase();

  const sign1 = m[1] === '-' ? -1 : 1;
  const sign2 = m[6] === '-' ? -1 : 1;

  let lng: number, lat: number;

  // N/S markers determine latitude, E/W markers determine longitude
  if (dir1 === 'N' || dir1 === 'S') {
    lat = (dir1 === 'S' ? -1 : 1) * sign1 * v1;
    lng = (dir2 === 'W' ? -1 : 1) * sign2 * v2;
  } else if (dir1 === 'E' || dir1 === 'W') {
    lng = (dir1 === 'W' ? -1 : 1) * sign1 * v1;
    lat = (dir2 === 'S' ? -1 : 1) * sign2 * v2;
  } else {
    // No markers — assume lng, lat order (Chinese convention)
    lng = sign1 * v1;
    lat = sign2 * v2;
  }

  return { lng, lat };
}

function parseDDM(str: string): LngLat | null {
  const m = str.trim().match(DDM_RE);
  if (!m) return null;

  const v1 = parseFloat(m[2]) + parseFloat(m[3]) / 60;
  const v2 = parseFloat(m[6]) + parseFloat(m[7]) / 60;

  const dir1 = (m[4] || '').toUpperCase();
  const dir2 = (m[8] || '').toUpperCase();

  const sign1 = m[1] === '-' ? -1 : 1;
  const sign2 = m[5] === '-' ? -1 : 1;

  let lng: number, lat: number;

  if (dir1 === 'N' || dir1 === 'S') {
    lat = (dir1 === 'S' ? -1 : 1) * sign1 * v1;
    lng = (dir2 === 'W' ? -1 : 1) * sign2 * v2;
  } else if (dir1 === 'E' || dir1 === 'W') {
    lng = (dir1 === 'W' ? -1 : 1) * sign1 * v1;
    lat = (dir2 === 'S' ? -1 : 1) * sign2 * v2;
  } else {
    lng = sign1 * v1;
    lat = sign2 * v2;
  }

  return { lng, lat };
}

function parseDecimal(str: string): LngLat | null {
  // Input convention: lng, lat (经度在前)
  let m = str.trim().match(DECIMAL_RE);
  if (m) {
    const v1 = parseFloat(m[2]);
    const v2 = parseFloat(m[4]);
    const lng = (m[1] === '-' ? -1 : 1) * v1;
    const lat = (m[3] === '-' ? -1 : 1) * v2;
    return { lng, lat };
  }

  // Lat/lng with N/S/E/W markers (first = lat, second = lng)
  m = str.trim().match(LL_NS_RE);
  if (m) {
    let lat = parseFloat(m[1]);
    let lng = parseFloat(m[2]);
    return { lng, lat };
  }

  return null;
}

export function parseCoord(input: string): LngLat | null {
  const s = input.trim();
  if (!s) return null;

  return parseDMS(s) ?? parseDDM(s) ?? parseDecimal(s);
}