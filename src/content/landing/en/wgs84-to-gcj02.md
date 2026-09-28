---
from: wgs84
to: gcj02
title: WGS84 to GCJ02 (Mars) Coordinate Converter | XD Tools
description: Convert WGS-84 GPS coordinates to GCJ-02 (Mars coordinate system) used by AMap and Tencent Maps. Smart format parsing, ~1m precision, instant results.
h1: WGS-84 to GCJ-02 (Mars Coordinates) Converter
intro:
  - "WGS-84 is the global coordinate system used by GPS satellites and Google Earth. If you record GPS tracks in China and overlay them on AMap or Tencent Maps, you will notice a 50-700 meter offset — because Chinese mapping services use GCJ-02, a nationally encrypted coordinate system."
  - "GCJ-02 (Mars coordinates) applies a non-linear offset to WGS-84 positions within mainland China. This tool uses the publicly available approximation algorithm with ~1-2 meter accuracy."
  - "Paste your WGS-84 coordinates to get GCJ-02, BD-09, and CGCS2000 equivalents instantly."
faq:
  - q: How big is the WGS84 to GCJ02 offset?
    a: The offset ranges from approximately 50 to 700 meters depending on location within China. Shanghai sees ~480m while Ürümqi sees ~265m.
  - q: What map services use GCJ-02?
    a: AMap (Gaode), Tencent Maps, and most Chinese map services use GCJ-02. Baidu Maps uses BD-09 (further offset from GCJ-02).
  - q: Is this conversion exact?
    a: The official encryption algorithm is not publicly disclosed. This tool uses the community-maintained approximation with ~1-2 meter accuracy, sufficient for most consumer and developer use cases.
  - q: What about coordinates outside China?
    a: GCJ-02 encryption only applies within mainland China. Outside China, coordinates pass through unchanged.
---