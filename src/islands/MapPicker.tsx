import { useSignal, useSignalEffect } from '@preact/signals';
import type { LngLat } from '../lib/geo/types';

interface CoordChangeEvent {
  wgs84: LngLat;
  gcj02: LngLat;
}

export default function MapPicker() {
  const loaded = useSignal(false);
  const mapInstance = useSignal<unknown>(null);
  const markers = useSignal<unknown[]>([]);
  const currentWgs = useSignal<LngLat | null>(null);
  const currentGcj = useSignal<LngLat | null>(null);

  useSignalEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for converter events
    function onCoordChange(e: Event) {
      const detail = (e as CustomEvent<CoordChangeEvent>).detail;
      if (detail?.gcj02) {
        currentGcj.value = detail.gcj02;
        currentWgs.value = detail.wgs84;
        updateMapMarkers(detail.wgs84, detail.gcj02);
      }
    }
    window.addEventListener('coordchange', onCoordChange);
    return () => window.removeEventListener('coordchange', onCoordChange);
  });

  useSignalEffect(() => {
    if (!loaded.value && typeof window !== 'undefined') {
      initMap();
    }
  });

  async function initMap() {
    try {
      const key = import.meta.env.PUBLIC_AMAP_KEY;
      const sc = import.meta.env.PUBLIC_AMAP_SECURITY_CODE;
      if (!key) {
        console.warn('AMap key not configured');
        return;
      }
      (window as Record<string, unknown>)._AMapSecurityConfig = { securityJsCode: sc };
      const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
      const AMap = await AMapLoader.load({ key, version: '2.0', plugins: [] });

      const map = new AMap.Map('map-container', {
        viewMode: '2D',
        zoom: 12,
        center: [116.404, 39.915], // Beijing default
      });

      // Click to pick coordinates
      map.on('click', (e: { lnglat: { lng: number; lat: number } }) => {
        const gcj = { lng: e.lnglat.lng, lat: e.lnglat.lat };
        // Dispatch picked GCJ coord for converter
        window.dispatchEvent(
          new CustomEvent('mappick', { detail: { lng: gcj.lng, lat: gcj.lat, from: 'gcj02' } }),
        );
      });

      mapInstance.value = map;
      loaded.value = true;
    } catch (err) {
      console.error('Map init failed:', err);
    }
  }

  function updateMapMarkers(wgs: LngLat, gcj: LngLat) {
    const AMap = (window as Record<string, unknown>).AMap as Record<string, unknown> | undefined;
    if (!AMap || !mapInstance.value) return;
    const map = mapInstance.value as {
      remove: (items: unknown[]) => void;
      add: (items: unknown[]) => void;
      setFitView: (overlays?: unknown[]) => void;
    };

    // Clear old markers
    if (markers.value.length) {
      map.remove(markers.value);
      markers.value = [];
    }

    const newMarkers: unknown[] = [];

    // Red marker at GCJ position (AMap native coords)
    const gcjMarker = new (AMap.Marker as new (opts: Record<string, unknown>) => unknown)({
      position: [gcj.lng, gcj.lat],
      icon: new (AMap.Icon as new (opts: Record<string, unknown>) => unknown)({
        size: [16, 16],
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        imageSize: [16, 16],
      }),
      title: 'GCJ-02 (高德)',
    });
    newMarkers.push(gcjMarker);

    // Blue marker at WGS position (offset)
    const wgsOnMap = { lng: gcj.lng + (wgs.lng - gcj.lng), lat: gcj.lat + (wgs.lat - gcj.lat) };
    // The GCJ map shows GCJ; WGS is offset. Show the offset visually.
    // Actually: to show WGS on a GCJ map, we need WGS→GCJ transform.
    // Since we already have gcj value (map position) and wgs value (true position),
    // the offset line connects map-center-gcj to map-center-wgs-in-gcj-space.
    // For now: draw line connecting the two points
    const wgsMarker = new (AMap.Marker as new (opts: Record<string, unknown>) => unknown)({
      position: [gcj.lng, gcj.lat],
      offset: [
        ((gcj.lng - wgs.lng) * 111000 * Math.cos((gcj.lat * Math.PI) / 180)) / 11,
        ((gcj.lat - wgs.lat) * 111000) / 11,
      ],
      icon: new (AMap.Icon as new (opts: Record<string, unknown>) => unknown)({
        size: [12, 12],
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        imageSize: [12, 12],
      }),
      title: 'WGS-84 (GPS)',
    });
    newMarkers.push(wgsMarker);

    map.add(newMarkers);
    map.setFitView();
    markers.value = newMarkers;
  }

  return (
    <div class="map-wrapper">
      <div
        id="map-container"
        style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }}
      />
      {currentWgs.value && currentGcj.value && (
        <p class="map-offset-note">
          🟢 WGS-84 真实位置 &nbsp; 🔴 GCJ-02 火星位置 &nbsp; 偏移约{' '}
          {Math.round(
            Math.sqrt(
              Math.pow((currentGcj.value.lng - currentWgs.value.lng) * 111000, 2) +
                Math.pow((currentGcj.value.lat - currentWgs.value.lat) * 111000, 2),
            ),
          )}
          m
        </p>
      )}
    </div>
  );
}