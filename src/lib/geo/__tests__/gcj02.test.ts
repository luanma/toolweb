import { describe, it, expect } from 'vitest';
import { wgs84ToGcj02, gcj02ToWgs84, isOutsideChina } from '../gcj02';
import { vectors, quickRoundtrip } from './vectors';

describe('wgs84ToGcj02', () => {
  // Reference vectors at precision 8 (5 cities pass, 3 may differ slightly
  // due to floating-point differences between Go/JS implementations)
  it.each(vectors)('$label: WGS→GCJ within 1e-8 of reference', ({ wgs84, gcj02 }) => {
    const result = wgs84ToGcj02(wgs84.lng, wgs84.lat);
    // 1e-8 degrees ≈ 1mm — tight enough to verify algorithm consistency
    expect(result.lng).toBeCloseTo(gcj02.lng, 8);
    expect(result.lat).toBeCloseTo(gcj02.lat, 8);
  });

  it('All Chinese cities have non-zero offset', () => {
    for (const v of vectors) {
      const result = wgs84ToGcj02(v.wgs84.lng, v.wgs84.lat);
      const dlng = Math.abs(result.lng - v.wgs84.lng);
      const dlat = Math.abs(result.lat - v.wgs84.lat);
      // Every Chinese city should have measurable offset (> 0.0001 deg ≈ 10m)
      expect(dlng + dlat).toBeGreaterThan(0.0001);
    }
  });
});

describe('gcj02ToWgs84 (exact iterative)', () => {
  it.each(vectors)('$label: GCJ→WGS roundtrip within 1e-10', ({ wgs84 }) => {
    const gcj = wgs84ToGcj02(wgs84.lng, wgs84.lat);
    const result = gcj02ToWgs84(gcj.lng, gcj.lat);
    expect(result.lng).toBeCloseTo(wgs84.lng, 10);
    expect(result.lat).toBeCloseTo(wgs84.lat, 10);
  });

  it.each(quickRoundtrip)(
    'quick: ($lng, $lat) roundtrip within 1e-10',
    ({ lng, lat }) => {
      const gcj = wgs84ToGcj02(lng, lat);
      const result = gcj02ToWgs84(gcj.lng, gcj.lat);
      expect(result.lng).toBeCloseTo(lng, 10);
      expect(result.lat).toBeCloseTo(lat, 10);
    },
  );
});

describe('isOutsideChina', () => {
  it('returns true for clearly international locations', () => {
    // New York — lng=-74, well outside 72-138 range
    expect(isOutsideChina(40.7128, -74.006)).toBe(true);
    // London — lng=-0.1278
    expect(isOutsideChina(51.5074, -0.1278)).toBe(true);
    // Anchorage — lat=61, outside 0.83-55.8 range
    expect(isOutsideChina(61.2181, -149.9003)).toBe(true);
    // Sydney — lng=151, outside 72-138 range
    expect(isOutsideChina(-33.8688, 151.2093)).toBe(true);
  });

  it('returns false for Chinese locations', () => {
    expect(isOutsideChina(39.909187, 116.397455)).toBe(false); // Beijing
    expect(isOutsideChina(31.230372, 121.473701)).toBe(false); // Shanghai
    expect(isOutsideChina(29.6547, 91.1145)).toBe(false); // Lhasa
    expect(isOutsideChina(45.803775, 126.534967)).toBe(false); // Harbin
  });

  it('passthrough: no GCJ offset for coordinates outside China', () => {
    // Singapore falls within China bounding box in the eviltransform algorithm,
    // so it gets a tiny offset. Use truly external coords instead.
    const london = { lng: -0.1278, lat: 51.5074 };
    const result = wgs84ToGcj02(london.lng, london.lat);
    expect(result.lng).toBe(london.lng);
    expect(result.lat).toBe(london.lat);

    const sydney = { lng: 151.2093, lat: -33.8688 };
    const result2 = wgs84ToGcj02(sydney.lng, sydney.lat);
    expect(result2.lng).toBe(sydney.lng);
    expect(result2.lat).toBe(sydney.lat);
  });

  it('gcj02ToWgs84 passthrough outside China', () => {
    const london = { lng: -0.1278, lat: 51.5074 };
    const result = gcj02ToWgs84(london.lng, london.lat);
    expect(result.lng).toBe(london.lng);
    expect(result.lat).toBe(london.lat);
  });
});