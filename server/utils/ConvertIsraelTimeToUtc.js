const israelToUTC = (dateStr, timeStr) => {
  // Combine date and time as a local Israel string
  const israelDateTime = `${dateStr}T${timeStr}:00`;

  // Create a Date object in Israel time zone using Intl
  const utcDate = new Date(
    new Date(israelDateTime).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );

  // Return UTC ISO string
  return utcDate.toISOString();
};

export default israelToUTC;