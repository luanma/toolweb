import type { CoordSystem } from '../../lib/geo/types';

/** Localized labels for UI */
export const SYS_LABEL: Record<CoordSystem, string> = {
  wgs84: 'WGS-84',
  gcj02: 'GCJ-02',
  bd09: 'BD-09',
  cgcs2000: 'CGCS2000',
};

export const SYS_DESC: Record<CoordSystem, string> = {
  wgs84: 'GPS / 国际',
  gcj02: '高德 / 腾讯',
  bd09: '百度',
  cgcs2000: '≈WGS84',
};

export function systemColor(sys: CoordSystem): string {
  return `var(--color-${sys})`;
}