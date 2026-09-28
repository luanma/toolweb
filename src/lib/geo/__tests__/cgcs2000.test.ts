import { describe, it, expect } from 'vitest';
import { cgcs2000ToWgs84, wgs84ToCgcs2000 } from '../cgcs2000';
import { vectors } from './vectors';

describe('CGCS2000 ↔ WGS84 identity passthrough', () => {
  it.each(vectors)('$label: CGCS2000→WGS84 passthrough', ({ wgs84 }) => {
    const result = cgcs2000ToWgs84(wgs84.lng, wgs84.lat);
    expect(result.lng).toBe(wgs84.lng);
    expect(result.lat).toBe(wgs84.lat);
  });

  it.each(vectors)('$label: WGS84→CGCS2000 passthrough', ({ wgs84 }) => {
    const result = wgs84ToCgcs2000(wgs84.lng, wgs84.lat);
    expect(result.lng).toBe(wgs84.lng);
    expect(result.lat).toBe(wgs84.lat);
  });

  it('roundtrip is identity', () => {
    const lng = 116.397455;
    const lat = 39.909187;
    const cgcs = wgs84ToCgcs2000(lng, lat);
    const back = cgcs2000ToWgs84(cgcs.lng, cgcs.lat);
    expect(back.lng).toBe(lng);
    expect(back.lat).toBe(lat);
  });
});