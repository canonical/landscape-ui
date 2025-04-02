const getNumberSuffix = (number: number) => {
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

const withNumberSuffix = (number: number) => {
  return `${number}${getNumberSuffix(number)}`;
};

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
