import { useEffect } from "react";
import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";

const useSetDynamicFilterValidation = (
  urlParam: keyof PageParams,
  allowedValues: string[],
): void => {
  const allowedValuesString = JSON.stringify(allowedValues);

  useEffect(() => {
    pageParamsManager.setDynamicAllowedValues(urlParam, allowedValues);
  }, [urlParam, allowedValuesString]);
};

export default useSetDynamicFilterValidation;
