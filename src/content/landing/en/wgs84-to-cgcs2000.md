---
from: wgs84
to: cgcs2000
title: WGS84 to CGCS2000 Converter — China Geodetic Coordinate System | XD Tools
description: WGS-84 and CGCS2000 are identical at meter-level precision (2-5 cm difference). Learn about the relationship between GPS and China's national geodetic system.
h1: WGS-84 to CGCS2000 (China Geodetic Coordinate System 2000) Converter
intro:
  - "CGCS2000 is China's official geodetic coordinate system, used by the BeiDou navigation satellite system and all national surveying in China."
  - "CGCS2000 and WGS-84 use identical ellipsoid parameters. At meter-level precision they are effectively the same — the 2-5 cm difference comes from tectonic plate motion and time-dependent factors."
  - "This tool treats CGCS2000 as identical to WGS-84 (passthrough). For centimeter-level precision conversion, professional geodetic software with grid correction parameters is required."
faq:
  - q: Are CGCS2000 and WGS84 the same?
    a: At consumer precision (meter-level) — yes. They share the same ellipsoid (a=6378137m, f=1/298.257222101). The ~2-5 cm difference is negligible for GPS navigation, mapping, and outdoor activities.
  - q: Why does this tool show CGCS2000 as equal to WGS84?
    a: Because the 2-5 cm difference is far smaller than this tool's ~1m accuracy. We choose to be honest about the passthrough rather than simulate a fake conversion.
  - q: What is CGCS2000?
    a: China Geodetic Coordinate System 2000, adopted in 2008, referenced to ITRF97 at epoch 2000.0. Used by BeiDou, land surveying, and national geospatial data infrastructure.
---