import { describe, it, expect } from 'vitest';
import { convert } from '../convert';
import { vectors } from './vectors';
import type { CoordSystem } from '../types';

describe('convert — unified entry', () => {
  it.each(vectors)('$label: WGS input produces all 4 systems', ({ wgs84 }) => {
    const result = convert(wgs84.lng, wgs84.lat, 'wgs84');

    // WGS should equal input
    expect(result.coords.wgs84.lng).toBe(wgs84.lng);
    expect(result.coords.wgs84.lat).toBe(wgs84.lat);

    // CGCS should equal WGS (identity)
    expect(result.coords.cgcs2000.lng).toBe(wgs84.lng);
    expect(result.coords.cgcs2000.lat).toBe(wgs84.lat);

    // All values should be finite
    const allCoords = Object.values(result.coords);
    for (const c of allCoords) {
      expect(Number.isFinite(c.lng)).toBe(true);
      expect(Number.isFinite(c.lat)).toBe(true);
    }
  });

  it('WGS→GCJ→WGS roundtrip via convert', () => {
    for (const v of vectors) {
      const result = convert(v.wgs84.lng, v.wgs84.lat, 'wgs84');
      // GCJ→WGS via convert should recover original
      const back = convert(
        result.coords.gcj02.lng,
        result.coords.gcj02.lat,
        'gcj02',
      );
      expect(back.coords.wgs84.lng).toBeCloseTo(v.wgs84.lng, 7);
      expect(back.coords.wgs84.lat).toBeCloseTo(v.wgs84.lat, 7);
    }
  });

  it('GCJ input produces correct WGS', () => {
    for (const v of vectors) {
      const result = convert(v.gcj02.lng, v.gcj02.lat, 'gcj02');
      expect(result.coords.gcj02.lng).toBe(v.gcj02.lng);
      expect(result.coords.gcj02.lat).toBe(v.gcj02.lat);
      expect(result.coords.wgs84.lng).toBeCloseTo(v.wgs84.lng, 7);
      expect(result.coords.wgs84.lat).toBeCloseTo(v.wgs84.lat, 7);
    }
  });

  it('BD09 input recovers BD09 identity', () => {
    const beijing = vectors[0];
    const result = convert(beijing.bd09.lng, beijing.bd09.lat, 'bd09');
    expect(result.coords.bd09.lng).toBe(beijing.bd09.lng);
    expect(result.coords.bd09.lat).toBe(beijing.bd09.lat);
  });

  it('CGCS2000 input is identity with WGS', () => {
    const lng = 116.397455;
    const lat = 39.909187;
    const result = convert(lng, lat, 'cgcs2000');
    expect(result.coords.wgs84.lng).toBe(lng);
    expect(result.coords.wgs84.lat).toBe(lat);
    expect(result.coords.cgcs2000.lng).toBe(lng);
    expect(result.coords.cgcs2000.lat).toBe(lat);
  });

  it('inputSystem is correctly set', () => {
    const systems: CoordSystem[] = ['wgs84', 'gcj02', 'bd09', 'cgcs2000'];
    for (const sys of systems) {
      const result = convert(116.404, 39.915, sys);
      expect(result.inputSystem).toBe(sys);
    }
  });

  it('London: WGS→GCJ passthrough outside China', () => {
    const result = convert(-0.1278, 51.5074, 'wgs84');
    const c = result.coords;
    expect(c.wgs84.lng).toBe(-0.1278);
    expect(c.gcj02.lng).toBe(-0.1278); // passthrough — outside China
    expect(c.cgcs2000.lng).toBe(-0.1278);
  });
});