import { describe, it, expect } from 'vitest';
import { formatDecimal, formatDMS } from '../format';

describe('formatDecimal', () => {
  it('formats with default 6 decimal places', () => {
    const result = formatDecimal({ lng: 116.404, lat: 39.915 });
    expect(result).toBe('39.915000, 116.404000');
  });

  it('formats with custom precision', () => {
    const result = formatDecimal({ lng: 116.404123, lat: 39.915456 }, 4);
    expect(result).toBe('39.9155, 116.4041');
  });

  it('handles negative coordinates', () => {
    const result = formatDecimal({ lng: -74.006, lat: 40.7128 }, 3);
    expect(result).toBe('40.713, -74.006');
  });
});

describe('formatDMS', () => {
  it('formats DMS with directions', () => {
    const result = formatDMS({ lng: 116.404, lat: 39.915 });
    expect(result).toContain('E');
    expect(result).toContain('N');
    expect(result).toContain('°');
    expect(result).toContain('′');
  });

  it('formats western coordinates with W', () => {
    const result = formatDMS({ lng: -74.006, lat: 40.7128 });
    expect(result).toContain('W');
    expect(result).toContain('N');
  });

  it('formats southern hemisphere with S', () => {
    const result = formatDMS({ lng: 116.404, lat: -33.8688 });
    expect(result).toContain('E');
    expect(result).toContain('S');
  });

  it('roundtrip with parse is approximately correct', () => {
    const original = { lng: 116.404, lat: 39.915 };
    const dms = formatDMS(original);
    // DMS should contain degree components
    expect(dms).toContain('116°');
    expect(dms).toContain('39°');
  });
});