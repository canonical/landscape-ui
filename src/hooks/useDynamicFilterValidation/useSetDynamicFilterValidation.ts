import { useEffect } from "react";
import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";

const useSetDynamicFilterValidation = (
  urlParam: keyof PageParams,
  allowedValues: string[],
): void => {
  const allowedValuesString = JSON.stringify(allowedValues);

  useEffect(() => {
    if (!allowedValues.length) {
      return;
    }

    const registrationId = pageParamsManager.registerDynamicAllowedValues(
      urlParam,
      allowedValues,
    );

    return () => {
      pageParamsManager.unregisterDynamicAllowedValues(
        urlParam,
        registrationId,
      );
    };
  }, [urlParam, allowedValuesString]);
};

export default useSetDynamicFilterValidation;
