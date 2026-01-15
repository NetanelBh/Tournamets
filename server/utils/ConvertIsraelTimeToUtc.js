import { zonedTimeToUtc } from 'date-fns-tz'; // lightweight and reliable

const israelToUTC = (dateStr, timeStr) => {
  // Combine date and time
  const israelTime = `${dateStr}T${timeStr}:00`;

  // Convert from Israel time to UTC
  const utcDate = zonedTimeToUtc(israelTime, 'Asia/Jerusalem');

  return utcDate.toISOString();
};

export default israelToUTC;
