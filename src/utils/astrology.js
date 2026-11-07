const DEG = Math.PI / 180;

const normalize = (value) => ((value % 360) + 360) % 360;
const sin = (value) => Math.sin(value * DEG);

function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function timeZoneOffsetMinutes(utcDate, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const zonePart = formatter.formatToParts(utcDate).find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
  if (zonePart === 'GMT') return 0;
  const match = zonePart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0);
  return match[1] === '-' ? -minutes : minutes;
}

function localCivilTimeToUtc(date, time, timeZone) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const localClockAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  let candidate = new Date(localClockAsUtc);
  let offset = timeZoneOffsetMinutes(candidate, timeZone);
  candidate = new Date(localClockAsUtc - offset * 60000);
  const correctedOffset = timeZoneOffsetMinutes(candidate, timeZone);
  if (correctedOffset !== offset) candidate = new Date(localClockAsUtc - correctedOffset * 60000);
  return candidate;
}

function sunLongitude(days) {
  const meanLongitude = normalize(280.460 + 0.9856474 * days);
  const meanAnomaly = normalize(357.528 + 0.9856003 * days);
  return normalize(meanLongitude + 1.915 * sin(meanAnomaly) + 0.020 * sin(2 * meanAnomaly));
}

function moonLongitude(days) {
  // Low-precision lunar orbit with the main solar/lunar perturbations.
  // It is sufficient for identifying the zodiac sign and is kept local so
  // the educational project does not depend on a remote service.
  const N = 125.1228 - 0.0529538083 * days;
  const inclination = 5.1454;
  const w = 318.0634 + 0.1643573223 * days;
  const eccentricity = 0.0549;
  const meanAnomaly = 115.3654 + 13.0649929509 * days;
  const eccentricAnomaly = meanAnomaly + (eccentricity / DEG) * sin(meanAnomaly) * (1 + eccentricity * Math.cos(meanAnomaly * DEG));
  const xv = 60.2666 * (Math.cos(eccentricAnomaly * DEG) - eccentricity);
  const yv = 60.2666 * Math.sqrt(1 - eccentricity ** 2) * Math.sin(eccentricAnomaly * DEG);
  const trueAnomaly = Math.atan2(yv, xv) / DEG;
  const distance = Math.sqrt(xv * xv + yv * yv);
  const longitude = normalize(N + Math.atan2(Math.sin((trueAnomaly + w) * DEG) * Math.cos(inclination * DEG), Math.cos((trueAnomaly + w) * DEG)) / DEG);
  const latitude = Math.atan2(Math.sin((trueAnomaly + w) * DEG) * Math.sin(inclination * DEG), Math.sqrt(Math.cos((trueAnomaly + w) * DEG) ** 2 + Math.sin((trueAnomaly + w) * DEG) ** 2 * Math.cos(inclination * DEG) ** 2)) / DEG;
  const sunMeanAnomaly = 356.0470 + 0.9856002585 * days;
  const sunLongitudeValue = sunLongitude(days);
  const lunarMeanLongitude = normalize(N + w + meanAnomaly);
  const elongation = normalize(lunarMeanLongitude - sunLongitudeValue);
  const argumentLatitude = normalize(lunarMeanLongitude - N);
  const correctedLongitude = longitude - 1.274 * sin(meanAnomaly - 2 * elongation) + 0.658 * sin(2 * elongation) - 0.186 * sin(sunMeanAnomaly) - 0.059 * sin(2 * meanAnomaly - 2 * elongation) - 0.057 * sin(meanAnomaly - 2 * elongation + sunMeanAnomaly) + 0.053 * sin(meanAnomaly + 2 * elongation) + 0.046 * sin(2 * elongation - sunMeanAnomaly) + 0.041 * sin(meanAnomaly - sunMeanAnomaly) - 0.035 * sin(elongation) - 0.031 * sin(meanAnomaly + sunMeanAnomaly) - 0.015 * sin(2 * argumentLatitude - 2 * elongation) + 0.011 * sin(meanAnomaly - 4 * elongation);
  void distance;
  void latitude;
  return normalize(correctedLongitude);
}

function siderealTime(jd, longitude) {
  const centuries = (jd - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * centuries ** 2 - centuries ** 3 / 38710000;
  return normalize(gmst + longitude);
}

function ascendantLongitude(jd, latitude, longitude) {
  const theta = siderealTime(jd, longitude) * DEG;
  const lat = latitude * DEG;
  const obliquity = 23.4392911 * DEG;
  const value = Math.atan2(-Math.cos(theta), Math.sin(theta) * Math.cos(obliquity) + Math.tan(lat) * Math.sin(obliquity)) / DEG + 180;
  return normalize(value);
}

function signFromLongitude(longitude) {
  const signs = ['ARIES', 'TAURO', 'GEMINIS', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'ESCORPIO', 'SAGITARIO', 'CAPRICORNIO', 'ACUARIO', 'PISCIS'];
  return signs[Math.floor(normalize(longitude) / 30)];
}

export function calculateSigns({ date, time, latitude, longitude, timeZone = 'America/Argentina/Buenos_Aires' }) {
  const localDate = localCivilTimeToUtc(date, time, timeZone);
  const jd = julianDay(localDate);
  const days = jd - 2451543.5;
  return {
    sol: signFromLongitude(sunLongitude(days)),
    luna: signFromLongitude(moonLongitude(days)),
    ascendente: signFromLongitude(ascendantLongitude(jd, latitude, longitude)),
  };
}
