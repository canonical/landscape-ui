import { useEffect } from "react";
import type { PageParams } from "../usePageParams";
import { PageParamsManager } from "../usePageParams";

const useSetDynamicFilterValidation = (
  urlParam: keyof PageParams,
  allowedValues: string[],
): void => {
  const allowedValuesString = JSON.stringify(allowedValues);
  const pageParamsManager = PageParamsManager.getInstance();

  useEffect(() => {
    pageParamsManager.setDynamicAllowedValues(urlParam, allowedValues);
  }, [urlParam, allowedValuesString]);
};

export default useSetDynamicFilterValidation;
