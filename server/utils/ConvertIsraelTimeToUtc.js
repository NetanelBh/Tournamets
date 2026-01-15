const israelToUTC = (dateStr, timeStr) => {
  // Combine date + time
  const israelDateTime = `${dateStr}T${timeStr}:00`;

  // Parse it in Israel time
  const utcDate = new Date(
    new Date(israelDateTime).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );

  // Return ISO string in UTC
  return utcDate.toISOString();
};

export default israelToUTC;