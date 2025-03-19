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

export const withNumberSuffix = (number: number) => {
  return `${number}${getNumberSuffix(number)}`;
};
