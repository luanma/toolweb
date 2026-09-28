import { describe, it, expect } from 'vitest';
import { gcj02ToBd09, bd09ToGcj02 } from '../bd09';
import { wgs84ToGcj02 } from '../gcj02';
import { vectors } from './vectors';

describe('gcj02ToBd09', () => {
  // Test first vector at high precision, others at lower precision
  it('Beijing: GCJ→BD matches reference exactly', () => {
    const gcj = wgs84ToGcj02(vectors[0].wgs84.lng, vectors[0].wgs84.lat);
    const result = gcj02ToBd09(gcj.lng, gcj.lat);
    // Reference BD09 values are pre-computed; 8 decimal places accounts for
    // floating-point differences across implementations
    expect(result.lng).toBeCloseTo(vectors[0].bd09.lng, 8);
    expect(result.lat).toBeCloseTo(vectors[0].bd09.lat, 8);
  });

  // For other cities, verify consistency (offset exists, direction correct)
  it.each(vectors.slice(1))(
    '$label: GCJ→BD offset in expected range',
    ({ wgs84 }) => {
      const gcj = wgs84ToGcj02(wgs84.lng, wgs84.lat);
      const bd = gcj02ToBd09(gcj.lng, gcj.lat);
      const dlng = Math.abs(bd.lng - gcj.lng);
      const dlat = Math.abs(bd.lat - gcj.lat);
      // BD offset from GCJ is ~0.006 deg (~600m) — significant
      expect(dlng).toBeGreaterThan(0.001);
      expect(dlng).toBeLessThan(0.008);
      expect(dlat).toBeGreaterThan(0.001);
      expect(dlat).toBeLessThan(0.008);
    },
  );
});

describe('bd09ToGcj02', () => {
  it('BD→GCJ→BD roundtrip within 1e-5 degrees (~1m)', () => {
    for (const v of vectors) {
      const gcj = wgs84ToGcj02(v.wgs84.lng, v.wgs84.lat);
      const bd = gcj02ToBd09(gcj.lng, gcj.lat);
      const back = bd09ToGcj02(bd.lng, bd.lat);
      // BD formulas use polar coordinates (sqrt+atan2) which inherently
      // lose precision — roundtrip error ~1e-6 deg (~10cm) is expected
      expect(back.lng).toBeCloseTo(gcj.lng, 5);
      expect(back.lat).toBeCloseTo(gcj.lat, 5);
    }
  });

  it('GCJ→BD→GCJ roundtrip within 1e-5 degrees (~1m)', () => {
    for (const v of vectors) {
      const gcj = wgs84ToGcj02(v.wgs84.lng, v.wgs84.lat);
      const bd = gcj02ToBd09(gcj.lng, gcj.lat);
      const back = bd09ToGcj02(bd.lng, bd.lat);
      const reBd = gcj02ToBd09(back.lng, back.lat);
      expect(reBd.lng).toBeCloseTo(bd.lng, 5);
      expect(reBd.lat).toBeCloseTo(bd.lat, 5);
    }
  });
});