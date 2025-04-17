const ordinalSuffix = (number: number) => {
  switch (number % 100) {
    case 11:
    case 12:
    case 13:
      return "th";
  }

  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const ordinal = (number: number) => `${number}${ordinalSuffix(number)}`;

export const getOnOptions = (date: Date) => {
  const dayOfMonth = date.getDate();

  return [
    {
      label: `${ordinal(dayOfMonth)} of every month`,
      value: "day-of-month",
    },
    {
      label: `${["First", "Second", "Third", "Fourth", "Last"][Math.ceil(dayOfMonth / 7) - 1]} ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)} of every month`,
      value: "day-of-week",
    },
  ];
};
