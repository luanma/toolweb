import { A, EE } from './constants';
import type { LngLat } from './types';

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320.0 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLng(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0;
  return ret;
}

export function isOutsideChina(lat: number, lng: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

export function wgs84ToGcj02(lng: number, lat: number): LngLat {
  if (isOutsideChina(lat, lng)) {
    return { lng, lat };
  }
  const dLat = transformLat(lng - 105.0, lat - 35.0);
  const dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  const dLngFinal = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * Math.PI);
  const dLatFinal = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * Math.PI);
  return { lng: lng + dLngFinal, lat: lat + dLatFinal };
}

export function gcj02ToWgs84(lng: number, lat: number): LngLat {
  if (isOutsideChina(lat, lng)) {
    return { lng, lat };
  }
  const gcj02ToWgs84Exact = (gcjLng: number, gcjLat: number): LngLat => {
    let wgsLng = gcjLng;
    let wgsLat = gcjLat;
    // Iterative delta approximation (typically converges in 3-5 iterations)
    for (let i = 0; i < 10; i++) {
      const gcj = wgs84ToGcj02(wgsLng, wgsLat);
      const dLng = gcj.lng - gcjLng;
      const dLat = gcj.lat - gcjLat;
      const absErr = Math.abs(dLng) + Math.abs(dLat);
      if (absErr < 1e-13) {
        break;
      }
      wgsLng -= dLng;
      wgsLat -= dLat;
    }
    return { lng: wgsLng, lat: wgsLat };
  };
  return gcj02ToWgs84Exact(lng, lat);
}