import SwissEPH from 'sweph-wasm';

let swissPromise;

const getSwiss = () => {
  swissPromise ??= SwissEPH.init(`${import.meta.env.BASE_URL}swiss/swisseph.wasm`);
  return swissPromise;
};

const timeZoneOffsetMinutes = (utcDate, timeZone) => {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const zonePart = formatter.formatToParts(utcDate).find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
  if (zonePart === 'GMT') return 0;
  const match = zonePart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0);
  return match[1] === '-' ? -minutes : minutes;
};

const localCivilTimeToUtc = (date, time, timeZone) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const localClockAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  let candidate = new Date(localClockAsUtc);
  let offset = timeZoneOffsetMinutes(candidate, timeZone);
  candidate = new Date(localClockAsUtc - offset * 60000);
  const correctedOffset = timeZoneOffsetMinutes(candidate, timeZone);
  if (correctedOffset !== offset) candidate = new Date(localClockAsUtc - correctedOffset * 60000);
  return candidate;
};

const signFromLongitude = (longitude) => {
  const signs = ['ARIES', 'TAURO', 'GEMINIS', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'ESCORPIO', 'SAGITARIO', 'CAPRICORNIO', 'ACUARIO', 'PISCIS'];
  return signs[Math.floor((((longitude % 360) + 360) % 360) / 30)];
};

export async function calculateSignsSwiss({ date, time, latitude, longitude, timeZone = 'America/Argentina/Buenos_Aires' }) {
  const swe = await getSwiss();
  const utcDate = localCivilTimeToUtc(date, time, timeZone);
  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth() + 1;
  const day = utcDate.getUTCDate();
  const utcHour = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60;
  const julianDay = swe.swe_julday(year, month, day, utcHour, swe.SE_GREG_CAL);
  const flags = swe.SEFLG_MOSEPH;
  const sun = swe.swe_calc_ut(julianDay, swe.SE_SUN, flags);
  const moon = swe.swe_calc_ut(julianDay, swe.SE_MOON, flags);
  const houses = swe.swe_houses(julianDay, latitude, longitude, 'P');
  const ascendantLongitude = houses.ascmc[0];
  return {
    sol: signFromLongitude(sun[0]),
    luna: signFromLongitude(moon[0]),
    ascendente: signFromLongitude(ascendantLongitude),
    details: { utc: utcDate.toISOString(), timeZone, latitude, longitude, ascendantLongitude }
  };
}
