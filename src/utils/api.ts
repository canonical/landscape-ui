import {
  API_ACCESS_KEY,
  API_SECRET_KEY,
  API_SIGNATURE_METHOD,
  API_SIGNATURE_VERSION,
  API_URL,
  API_VERSION,
} from "../constants";
import { Buffer } from "buffer";
import Base64 from "crypto-js/enc-base64";
import hmacSHA256 from "crypto-js/hmac-sha256";
import { RequestSchema } from "../types/RequestSchema";
import { InternalAxiosRequestConfig } from "axios";

interface CreateSignatureProps {
  method: string;
  requestParams: Omit<RequestSchema, "signature">;
  urlParams: URLSearchParams;
}

const createSignature = ({
  method,
  requestParams,
  urlParams,
}: CreateSignatureProps) => {
  if (requestParams) {
    for (let i = 0; i < Object.keys(requestParams).length; i++) {
      urlParams.append(
        `${requestParams[Object.keys(requestParams)[i]]}.${i + 1}`,
        requestParams[Object.keys(requestParams)[i]]
      );
    }
  }

  const apiUrl = new URL(API_URL);

  const stringToSign = `${method.toUpperCase()}\n${apiUrl.host.toLowerCase()}\n${
    apiUrl.pathname
  }/\n${urlParams.toString()}`;

  const asciiQuery = Buffer.from(stringToSign, "ascii").toString();
  const asciiSecret = Buffer.from(API_SECRET_KEY, "ascii").toString();

  return Base64.stringify(hmacSHA256(asciiQuery, asciiSecret));
};

export const generateRequestParams = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const requestParams = ["get", "delete"].includes(config.method ?? "get")
    ? config.params
    : config.data;

  const urlParams = new URLSearchParams();

  const paramsToPass: Omit<RequestSchema, "signature"> = {
    access_key_id: API_ACCESS_KEY,
    action: config.url ?? "",
    signature_method: API_SIGNATURE_METHOD,
    signature_version: API_SIGNATURE_VERSION,
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  };

  for (let i = 0; i < Object.keys(requestParams ?? []).length; i++) {
    const param = Object.keys(requestParams)[i];
    paramsToPass[`${param}.${i + 1}`] = requestParams[param];
  }

  for (const param of Object.keys(paramsToPass)) {
    urlParams.append(param, paramsToPass[param]);
  }

  if (requestParams) {
    for (let i = 0; i < Object.keys(requestParams).length; i++) {
      urlParams.append(
        `${requestParams[Object.keys(requestParams)[i]]}.${i + 1}`,
        requestParams[Object.keys(requestParams)[i]]
      );
    }
  }

  paramsToPass.signature = createSignature({
    method: config.method ?? "get",
    urlParams,
    requestParams,
  });

  if (["get", "delete"].includes(config.method ?? "get")) {
    config.params = paramsToPass;
  } else {
    config.data = paramsToPass;
  }

  config.url = "";

  config.headers["Content-Type"] = "application/json";

  return config;
};
