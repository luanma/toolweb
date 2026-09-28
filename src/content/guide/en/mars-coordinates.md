---
title: What Is the Mars Coordinate System (GCJ-02)?
description: A technical deep-dive into GCJ-02 — why it exists, how the encryption works, offset ranges, and what it means for developers working with Chinese map APIs.
h1: What Is the Mars Coordinate System (GCJ-02)?
order: 1
---
GCJ-02 (commonly called "Mars coordinates") is China's national geographic coordinate encryption standard. This article explains why it exists, how the encryption works, and how developers should handle coordinate conversion when working with Chinese mapping services.

## Why Does Coordinate Encryption Exist?

Chinese surveying law requires all publicly available maps within mainland China to use encrypted coordinates. GCJ-02 satisfies this requirement by applying a non-linear offset of 50-700 meters to real WGS-84 (GPS) positions.

## How the Encryption Works

GCJ-02 uses the Krasovsky 1940 ellipsoid:
- Semi-major axis a = 6,378,245 m
- First eccentricity squared ee = 0.00669342162296594323

The transform applies trigonometric and polynomial functions to the WGS-84 coordinates, producing an unpredictable spatial offset. The magnitude varies by location — largest in eastern and central China (~500-700m), smaller near western borders (~200-300m).

**Critical detail:** The offset only applies within mainland China. Coordinates outside the bounding box (longitude 72°-138°E, latitude 0.8°-56°N) are unchanged.

## Which Services Use GCJ-02?

| Service | Coordinate System |
|---------|------------------|
| AMap (Gaode) | GCJ-02 |
| Tencent Maps | GCJ-02 |
| Baidu Maps | BD-09 (further encrypted from GCJ-02) |
| Google Maps (China) | GCJ-02 |
| OpenStreetMap | WGS-84 |
| Google Earth | WGS-84 |

## What This Means for Developers

1. **GPS device coordinates (WGS-84) cannot be placed directly on AMap** — expect ~500m offset
2. **Convert WGS84 → GCJ02** before using AMap/Tencent Maps APIs
3. **Convert GCJ02 → WGS84** to use AMap coordinates for GPS navigation or Google Earth
4. **Baidu Maps requires an additional GCJ02 → BD09 step**

## Accuracy Notes

The official GCJ-02 encryption algorithm is not publicly available. Community-maintained approximations (e.g., eviltransform) achieve ~1-2 meter accuracy, which is sufficient for the vast majority of development and navigation use cases. For centimeter precision, consult official surveying data.