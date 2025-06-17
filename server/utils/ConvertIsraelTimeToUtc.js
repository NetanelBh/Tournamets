const israelToUTC = (dateStr, timeStr) => {
  // Combine into ISO-like string without timezone
  const localStr = `${dateStr}T${timeStr}:00`;

  // Create a date object assuming it's Israel time
  const dt = new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(new Date(localStr))
  );

  // Convert to UTC ISO string
  return new Date(dt).toISOString();
};

export default israelToUTC;