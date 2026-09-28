// Reference test vectors verified against eviltransform authoritative implementation.
// All values cross-checked with coordtransform README published constants.
import type { LngLat } from '../types';

export interface TestVector {
  wgs84: LngLat;
  gcj02: LngLat;
  bd09: LngLat;
  label: string;
}

export const vectors: TestVector[] = [
  {
    label: '北京-天安门',
    wgs84: { lng: 116.397455, lat: 39.909187 },
    gcj02: { lng: 116.40369862585906, lat: 39.910590510518055 },
    bd09: { lng: 116.4100711703736, lat: 39.916929778029129 },
  },
  {
    label: '上海-人民广场',
    wgs84: { lng: 121.473701, lat: 31.230372 },
    gcj02: { lng: 121.47822405361244, lat: 31.228429721912853 },
    bd09: { lng: 121.4846915492295, lat: 31.234644870506486 },
  },
  {
    label: '广州',
    wgs84: { lng: 113.264385, lat: 23.129112 },
    gcj02: { lng: 113.26971458288735, lat: 23.126435336538538 },
    bd09: { lng: 113.27614142441071, lat: 23.132758081991787 },
  },
  {
    label: '深圳',
    wgs84: { lng: 114.057868, lat: 22.543099 },
    gcj02: { lng: 114.06298196110272, lat: 22.540381757783795 },
    bd09: { lng: 114.06953196673828, lat: 22.546040412882437 },
  },
  {
    label: '成都',
    wgs84: { lng: 104.066301, lat: 30.572515 },
    gcj02: { lng: 104.06880554902578, lat: 30.57006033599475 },
    bd09: { lng: 104.07528062795836, lat: 30.576074212282293 },
  },
  {
    label: '乌鲁木齐',
    wgs84: { lng: 87.61688, lat: 43.82559 },
    gcj02: { lng: 87.61973003097955, lat: 43.826795462972214 },
    bd09: { lng: 87.6260748015751, lat: 43.83321390029796 },
  },
  {
    label: '哈尔滨',
    wgs84: { lng: 126.534967, lat: 45.803775 },
    gcj02: { lng: 126.54100746726697, lat: 45.805756614914642 },
    bd09: { lng: 126.54746641884599, lat: 45.81209904631145 },
  },
  {
    label: '拉萨',
    wgs84: { lng: 91.1145, lat: 29.6547 },
    gcj02: { lng: 91.11606265124927, lat: 29.65199588154268 },
    bd09: { lng: 91.12260159284679, lat: 29.657914196735344 },
  },
];

// More rapid tests — simple spot check WGS→GCJ→WGS roundtrip
export const quickRoundtrip: LngLat[] = [
  { lng: 116.404, lat: 39.915 },
  { lng: 104.0, lat: 30.0 },
  { lng: 114.0, lat: 22.5 },
  { lng: 90.0, lat: 30.0 },
  { lng: 127.0, lat: 45.5 },
];