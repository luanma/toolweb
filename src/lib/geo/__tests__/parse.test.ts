import { describe, it, expect } from 'vitest';
import { parseCoord } from '../parse';

describe('parseCoord — decimal format', () => {
  it('parses comma-separated decimal lng,lat', () => {
    const result = parseCoord('116.404, 39.915');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 6);
    expect(result!.lat).toBeCloseTo(39.915, 6);
  });

  it('parses lat,lng order with N/S/E/W markers', () => {
    const result = parseCoord('39.915N, 116.404E');
    expect(result).not.toBeNull();
    expect(result!.lat).toBeCloseTo(39.915, 6);
    expect(result!.lng).toBeCloseTo(116.404, 6);
  });

  it('parses with tab separator', () => {
    const result = parseCoord('116.404\t39.915');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 6);
    expect(result!.lat).toBeCloseTo(39.915, 6);
  });

  it('parses with semicolon separator', () => {
    const result = parseCoord('116.404; 39.915');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 6);
    expect(result!.lat).toBeCloseTo(39.915, 6);
  });

  it('parses negative longitude', () => {
    const result = parseCoord('-74.006, 40.7128');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(-74.006, 6);
    expect(result!.lat).toBeCloseTo(40.7128, 6);
  });

  it('parses with extra spaces', () => {
    const result = parseCoord('  116.404  ,  39.915  ');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 6);
    expect(result!.lat).toBeCloseTo(39.915, 6);
  });
});

describe('parseCoord — DMS format', () => {
  it('parses Chinese degree symbols: 度分秒', () => {
    const result = parseCoord('116°24′14.4″E, 39°54′54″N');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 3);
    expect(result!.lat).toBeCloseTo(39.915, 3);
  });

  it('parses with 度分秒 Chinese characters', () => {
    const result = parseCoord('116度24分14.4秒E, 39度54分54秒N');
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 3);
    expect(result!.lat).toBeCloseTo(39.915, 3);
  });

  it('parses DMS with NSEW', () => {
    const result = parseCoord("40°26'46\"N, 79°56'56\"W");
    expect(result).not.toBeNull();
    expect(result!.lat).toBeCloseTo(40.446111, 4);
    expect(result!.lng).toBeCloseTo(-79.948889, 4);
  });
});

describe('parseCoord — DDM format', () => {
  it('parses degree-minute format', () => {
    const result = parseCoord("116°24.24'E, 39°54.90'N");
    expect(result).not.toBeNull();
    expect(result!.lng).toBeCloseTo(116.404, 3);
    expect(result!.lat).toBeCloseTo(39.915, 3);
  });
});

describe('parseCoord — invalid input', () => {
  it('returns null for empty string', () => {
    expect(parseCoord('')).toBeNull();
    expect(parseCoord('   ')).toBeNull();
  });

  it('returns null for garbage input', () => {
    expect(parseCoord('hello world')).toBeNull();
    expect(parseCoord('abc, def')).toBeNull();
  });

  it('returns null for single number', () => {
    expect(parseCoord('116.404')).toBeNull();
  });
});