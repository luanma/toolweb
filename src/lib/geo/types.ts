export type CoordSystem = 'wgs84' | 'gcj02' | 'bd09' | 'cgcs2000';

export const ALL_SYSTEMS: CoordSystem[] = ['wgs84', 'gcj02', 'bd09', 'cgcs2000'];

export interface LngLat {
  lng: number;
  lat: number;
}

export type CoordRecord = Record<CoordSystem, LngLat>;

export interface ConvertMeta {
  from: CoordSystem;
  algorithm: string;
  precision: string; // expected precision note
}

export interface ConvertResult {
  coords: CoordRecord;
  input: LngLat;
  inputSystem: CoordSystem;
}

export interface DirectionMeta {
  key: string;
  from: CoordSystem;
  to: CoordSystem;
  fromLabel: string;
  fromLabelEn: string;
  toLabel: string;
  toLabelEn: string;
  algorithm: string;
  precision: string;
}

export const SYSTEM_LABELS: Record<CoordSystem, { zh: string; en: string; color: string }> = {
  wgs84: { zh: 'WGS-84', en: 'WGS-84', color: 'var(--color-wgs84)' },
  gcj02: { zh: 'GCJ-02', en: 'GCJ-02', color: 'var(--color-gcj02)' },
  bd09: { zh: 'BD-09', en: 'BD-09', color: 'var(--color-bd09)' },
  cgcs2000: { zh: 'CGCS2000', en: 'CGCS2000', color: 'var(--color-cgcs2000)' },
};

export const ALL_DIRECTIONS: DirectionMeta[] = [
  {
    key: 'wgs84-to-gcj02',
    from: 'wgs84',
    to: 'gcj02',
    fromLabel: 'WGS-84',
    fromLabelEn: 'WGS-84',
    toLabel: 'GCJ-02',
    toLabelEn: 'GCJ-02',
    algorithm: 'Krasovsky 1940 ellipsoid nonlinear shift (public approximation)',
    precision: '~1-2 meters',
  },
  {
    key: 'gcj02-to-wgs84',
    from: 'gcj02',
    to: 'wgs84',
    fromLabel: 'GCJ-02',
    fromLabelEn: 'GCJ-02',
    toLabel: 'WGS-84',
    toLabelEn: 'WGS-84',
    algorithm: 'Iterative reverse approximation (3-5 iterations to 1e-7°)',
    precision: '~1-2 meters',
  },
  {
    key: 'gcj02-to-bd09',
    from: 'gcj02',
    to: 'bd09',
    fromLabel: 'GCJ-02',
    fromLabelEn: 'GCJ-02',
    toLabel: 'BD-09',
    toLabelEn: 'BD-09',
    algorithm: 'Deterministic formula (X_PI, polar offset)',
    precision: 'exact (reversible)',
  },
  {
    key: 'bd09-to-gcj02',
    from: 'bd09',
    to: 'gcj02',
    fromLabel: 'BD-09',
    fromLabelEn: 'BD-09',
    toLabel: 'GCJ-02',
    toLabelEn: 'GCJ-02',
    algorithm: 'Deterministic inverse formula',
    precision: 'exact (reversible)',
  },
  {
    key: 'wgs84-to-bd09',
    from: 'wgs84',
    to: 'bd09',
    fromLabel: 'WGS-84',
    fromLabelEn: 'WGS-84',
    toLabel: 'BD-09',
    toLabelEn: 'BD-09',
    algorithm: 'WGS84→GCJ02→BD09 (composed)',
    precision: '~1-2 meters',
  },
  {
    key: 'bd09-to-wgs84',
    from: 'bd09',
    to: 'wgs84',
    fromLabel: 'BD-09',
    fromLabelEn: 'BD-09',
    toLabel: 'WGS-84',
    toLabelEn: 'WGS-84',
    algorithm: 'BD09→GCJ02→WGS84 (composed, reverse iterated)',
    precision: '~1-2 meters',
  },
  {
    key: 'cgcs2000-to-wgs84',
    from: 'cgcs2000',
    to: 'wgs84',
    fromLabel: 'CGCS2000',
    fromLabelEn: 'CGCS2000',
    toLabel: 'WGS-84',
    toLabelEn: 'WGS-84',
    algorithm: 'Identity (cm-level difference, treated as identical)',
    precision: '< 5 cm (treated as identical for consumer purposes)',
  },
  {
    key: 'wgs84-to-cgcs2000',
    from: 'wgs84',
    to: 'cgcs2000',
    fromLabel: 'WGS-84',
    fromLabelEn: 'WGS-84',
    toLabel: 'CGCS2000',
    toLabelEn: 'CGCS2000',
    algorithm: 'Identity (cm-level difference, treated as identical)',
    precision: '< 5 cm (treated as identical for consumer purposes)',
  },
  {
    key: 'cgcs2000-to-gcj02',
    from: 'cgcs2000',
    to: 'gcj02',
    fromLabel: 'CGCS2000',
    fromLabelEn: 'CGCS2000',
    toLabel: 'GCJ-02',
    toLabelEn: 'GCJ-02',
    algorithm: 'CGCS2000≈WGS84→GCJ02 (identity + public approximation)',
    precision: '~1-2 meters',
  },
  {
    key: 'gcj02-to-cgcs2000',
    from: 'gcj02',
    to: 'cgcs2000',
    fromLabel: 'GCJ-02',
    fromLabelEn: 'GCJ-02',
    toLabel: 'CGCS2000',
    toLabelEn: 'CGCS2000',
    algorithm: 'GCJ02→WGS84≈CGCS2000 (reverse iterated + identity)',
    precision: '~1-2 meters',
  },
  {
    key: 'cgcs2000-to-bd09',
    from: 'cgcs2000',
    to: 'bd09',
    fromLabel: 'CGCS2000',
    fromLabelEn: 'CGCS2000',
    toLabel: 'BD-09',
    toLabelEn: 'BD-09',
    algorithm: 'CGCS2000≈WGS84→GCJ02→BD09 (composed)',
    precision: '~1-2 meters',
  },
  {
    key: 'bd09-to-cgcs2000',
    from: 'bd09',
    to: 'cgcs2000',
    fromLabel: 'BD-09',
    fromLabelEn: 'BD-09',
    toLabel: 'CGCS2000',
    toLabelEn: 'CGCS2000',
    algorithm: 'BD09→GCJ02→WGS84≈CGCS2000 (composed, reverse iterated)',
    precision: '~1-2 meters',
  },
];

export const DIRECTION_MAP = new Map(ALL_DIRECTIONS.map((d) => [d.key, d]));