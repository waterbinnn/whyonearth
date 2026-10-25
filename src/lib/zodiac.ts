// Western (tropical) zodiac sign for a birth date. 0 = Aries … 11 = Pisces.
// The sign changes when the Sun crosses each 30° of ecliptic longitude, and that moment
// moves by up to a day from year to year. So instead of a fixed date table we compute
// where the Sun actually was on that date. Birth time is unknown, so we use noon in
// Korea (03:00 UTC) as the middle of the day.
// Formula: low-precision solar position from Meeus, "Astronomical Algorithms" ch. 25
// (good to about 0.01°, i.e. within ~15 minutes of the real crossing).

const rad = Math.PI / 180

// Apparent ecliptic longitude of the Sun in degrees, 0–360.
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545) / 36525
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M)
  const omega = (125.04 - 1934.136 * T) * rad
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega)
  return ((lambda % 360) + 360) % 360
}

// Julian day for a UTC date and hour.
function julianDay(year: number, month: number, day: number, hourUtc: number): number {
  return Date.UTC(year, month - 1, day, hourUtc) / 86400000 + 2440587.5
}

export function zodiacIndex(year: number, month: number, day: number): number {
  return Math.floor(sunLongitude(julianDay(year, month, day, 3)) / 30)
}
