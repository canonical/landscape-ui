import { useEffect, useState } from "react";

const useTotalPages = (totalItems: number | undefined, pageSize: number) => {
  const [totalPages, setTotalPages] = useState(
    totalItems ? Math.ceil(totalItems / pageSize) : 1,
  );

  useEffect(() => {
    if (totalItems === undefined) {
      return;
    }

    setTotalPages(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  return totalPages;
};

export default useTotalPages;
