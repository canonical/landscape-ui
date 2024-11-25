export const getDateQuery = (fromDate?: string, toDate?: string): string => {
  if (fromDate && toDate) {
    return ` created-after:${fromDate} created-before:${toDate}`;
  } else if (fromDate) {
    return ` created-after:${fromDate}`;
  } else if (toDate) {
    return ` created-before:${toDate}`;
  }
  return "";
};

export const getTypeQuery = (type?: string): string => {
  return type ? ` type:${type}` : "";
};

export const getStatusQuery = (status?: string): string => {
  return status ? ` status:${status}` : "";
};
