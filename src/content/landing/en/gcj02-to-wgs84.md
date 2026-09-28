---
from: gcj02
to: wgs84
title: GCJ02 to WGS84 (GPS) Converter — Reverse Mars Coordinates | XD Tools
description: Convert AMap/Mars GCJ-02 coordinates back to international WGS-84 GPS standard. Iterative approximation with ~1m accuracy. Instant client-side conversion.
h1: GCJ-02 to WGS-84 (Mars to GPS) Converter
intro:
  - "GCJ-02 is the encrypted coordinate system mandated by Chinese law for all domestic mapping services, including AMap and Tencent Maps. To export coordinates from these services to GPS devices or Google Earth, you need to reverse the GCJ-02 offset back to WGS-84."
  - "Since the exact reverse formula is not publicly available, this tool uses iterative delta approximation — each iteration computes the forward transform and corrects the estimate. Converges in 3-5 iterations to < 0.01mm precision."
  - "Supports decimal degrees, DMS, and DDM input formats with automatic detection."
faq:
  - q: Can I use AMap coordinates directly in Google Earth?
    a: No. AMap uses GCJ-02 which is offset 50-700m from WGS-84 within China. Use this tool to convert GCJ-02 to WGS-84 first.
  - q: How accurate is the reverse conversion?
    a: The iterative approximation achieves ~1m accuracy, sufficient for navigation, outdoor activities, and data export.
  - q: Does this require a server?
    a: No — all computation happens in your browser. No data is ever sent to a server.
---