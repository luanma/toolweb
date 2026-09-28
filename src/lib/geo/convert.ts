import type { CoordSystem, CoordRecord, ConvertResult, LngLat } from './types';
import { wgs84ToGcj02, gcj02ToWgs84 } from './gcj02';
import { gcj02ToBd09, bd09ToGcj02 } from './bd09';
import { cgcs2000ToWgs84, wgs84ToCgcs2000 } from './cgcs2000';

function getWgs84(from: CoordSystem, lng: number, lat: number): LngLat {
  switch (from) {
    case 'wgs84':
      return { lng, lat };
    case 'gcj02':
      return gcj02ToWgs84(lng, lat);
    case 'bd09': {
      const gcj = bd09ToGcj02(lng, lat);
      return gcj02ToWgs84(gcj.lng, gcj.lat);
    }
    case 'cgcs2000':
      return cgcs2000ToWgs84(lng, lat);
  }
}

function getGcj02(from: CoordSystem, lng: number, lat: number): LngLat {
  switch (from) {
    case 'wgs84':
      return wgs84ToGcj02(lng, lat);
    case 'gcj02':
      return { lng, lat };
    case 'bd09':
      return bd09ToGcj02(lng, lat);
    case 'cgcs2000':
      // CGCS2000 ≈ WGS84
      return wgs84ToGcj02(lng, lat);
  }
}

function getBd09(from: CoordSystem, lng: number, lat: number): LngLat {
  switch (from) {
    case 'wgs84': {
      const gcj = wgs84ToGcj02(lng, lat);
      return gcj02ToBd09(gcj.lng, gcj.lat);
    }
    case 'gcj02':
      return gcj02ToBd09(lng, lat);
    case 'bd09':
      return { lng, lat };
    case 'cgcs2000': {
      // CGCS2000 ≈ WGS84
      const gcj = wgs84ToGcj02(lng, lat);
      return gcj02ToBd09(gcj.lng, gcj.lat);
    }
  }
}

function getCgcs2000(from: CoordSystem, lng: number, lat: number): LngLat {
  switch (from) {
    case 'wgs84':
      return wgs84ToCgcs2000(lng, lat);
    case 'gcj02': {
      const wgs = gcj02ToWgs84(lng, lat);
      return wgs84ToCgcs2000(wgs.lng, wgs.lat);
    }
    case 'bd09': {
      const gcj = bd09ToGcj02(lng, lat);
      const wgs = gcj02ToWgs84(gcj.lng, gcj.lat);
      return wgs84ToCgcs2000(wgs.lng, wgs.lat);
    }
    case 'cgcs2000':
      return { lng, lat };
  }
}

export function convert(lng: number, lat: number, from: CoordSystem): ConvertResult {
  const coords: CoordRecord = {
    wgs84: getWgs84(from, lng, lat),
    gcj02: getGcj02(from, lng, lat),
    bd09: getBd09(from, lng, lat),
    cgcs2000: getCgcs2000(from, lng, lat),
  };

  return {
    coords,
    input: { lng, lat },
    inputSystem: from,
  };
}