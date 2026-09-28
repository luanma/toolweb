---
from: gcj02
to: bd09
title: GCJ02 to BD09 Converter — AMap to Baidu Coordinates | XD Tools
description: Convert GCJ-02 (AMap/Tencent) coordinates to BD-09 (Baidu Maps). Deterministic formula, exact precision, instant client-side results.
h1: GCJ-02 to BD-09 (AMap to Baidu) Converter
intro:
  - "GCJ-02 is used by AMap and Tencent Maps. BD-09 is Baidu's proprietary coordinate system with an additional 5-10 meter offset on top of GCJ-02. The conversion between the two is a deterministic mathematical formula."
  - "The transform uses polar coordinate rotation plus a fixed offset — no accuracy loss, perfectly reversible within floating-point precision (~1cm)."
faq:
  - q: What is the difference between GCJ-02 and BD-09?
    a: BD-09 adds an additional 5-10 meter offset on top of GCJ-02. Combined with GCJ-02's 50-700m offset from WGS-84, BD-09 is 55-710m off from true GPS coordinates within China.
  - q: Can I convert GCJ-02 to BD-09 exactly?
    a: Yes. The formula is mathematically exact (polar transform). The only imprecision comes from floating-point arithmetic (~0.01mm).
  - q: Why does Baidu use a different coordinate system?
    a: Baidu applied an additional encryption layer on top of the national GCJ-02 standard for regulatory compliance and to create a proprietary mapping ecosystem.
---