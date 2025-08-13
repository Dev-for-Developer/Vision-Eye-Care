// src/utils/vision.js

// 5 arcminutes in radians for a full optotype height
export const FIVE_ARCMIN_RAD = (5 / 60) * (Math.PI / 180);

/**
 * Physical height (mm) of a 20/20 optotype at distance (meters)
 * h = L * tan(5')
 */
export function mmFor20_20(distanceMeters) {
  const meters = Number(distanceMeters || 0);
  const h_m = meters * Math.tan(FIVE_ARCMIN_RAD); // meters
  return h_m * 1000; // mm
}

/**
 * Height (pixels) for a given Snellen line denominator at distance (meters).
 * Example: denom = 40 -> 20/40 line. 20/20 * (40/20) = 2x taller than 20/20.
 */
export function pxForSnellenDenom(denom, distanceMeters, pxPerMM) {
  const h20mm = mmFor20_20(distanceMeters);
  const h_mm = h20mm * (denom / 20);
  return h_mm * pxPerMM;
}
