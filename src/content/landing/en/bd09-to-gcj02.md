---
from: bd09
to: gcj02
title: BD09 to GCJ02 Converter — Baidu to AMap Coordinates | XD Tools
description: Convert Baidu Maps BD-09 coordinates to GCJ-02 (AMap/Tencent). Exact inverse formula, ~1cm precision, instant browser-based conversion.
h1: BD-09 to GCJ-02 (Baidu to AMap) Converter
intro:
  - "BD-09 is Baidu Maps' proprietary coordinate system and GCJ-02 is the national standard used by AMap and Tencent Maps. The conversion between them is a deterministic inverse transform."
  - "The formula reverses Baidu's additional encryption — polar coordinate transform plus fixed offset subtraction — with ~1cm precision limited only by floating-point arithmetic."
faq:
  - q: Can I use Baidu coordinates on AMap?
    a: No — Baidu uses BD-09 and AMap uses GCJ-02. Convert BD-09 to GCJ-02 first with this tool for accurate positioning on AMap.
  - q: How accurate is BD09 to GCJ02 conversion?
    a: The inverse transform is mathematically exact. Floating-point precision limits the result to ~1cm, which is negligible for all practical purposes.
---