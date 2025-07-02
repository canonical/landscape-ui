export const parseSchedule = (schedule: string) => {
  const map = new Map(
    schedule.split(";").map((part) => {
      const [key, value] = part.split("=");
      return [key.toUpperCase(), value];
    }),
  );

  const freq = map.get("FREQ")?.toLowerCase() ?? "";
  const at_hour = parseInt(map.get("BYHOUR") ?? "", 10);
  const at_minute = parseInt(map.get("BYMINUTE") ?? "", 10);
  const on_days = (map.get("BYDAY") ?? "")
    .split(",")
    .map((d) => d.toLowerCase());

  return {
    freq,
    at_hour,
    at_minute,
    on_days,
  };
};
