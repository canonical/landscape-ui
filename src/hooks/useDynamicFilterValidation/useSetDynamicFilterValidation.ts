import { useEffect } from "react";
import { setDynamicAllowedValues } from "../usePageParams";
import type { PageParams } from "../usePageParams/types";

const useSetDynamicFilterValidation = (
  urlParam: keyof PageParams,
  allowedValues: string[],
) => {
  const allowedValuesString = JSON.stringify(allowedValues);

  useEffect(() => {
    setDynamicAllowedValues(urlParam, allowedValues);
  }, [urlParam, allowedValuesString]);
};

export default useSetDynamicFilterValidation;
