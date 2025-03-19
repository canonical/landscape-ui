import { withNumberSuffix } from "../../helpers";

export const getOnOptions = (date: Date) => {
  const dayOfMonth = date.getDate();

  return [
    {
      label: `${withNumberSuffix(dayOfMonth)} of every month`,
      value: "dateNumber",
    },
    {
      label: `${["First", "Second", "Third", "Fourth", "Last"][Math.floor((dayOfMonth - 1) / 7)]} ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)} of every month`,
      value: "weekDay",
    },
  ];
};
