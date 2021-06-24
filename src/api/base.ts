import axios, { AxiosResponse } from "axios";
import { Resopnse } from "../types/response";
const BASE_URL = process.env.REACT_APP_PUBLIC_URL_STACKOVERFLOW;

const _authorizationHeaders = () => {
  return { "Content-Type": "application/json" };
};

export const getApi = async (
  url: string,
  headers = _authorizationHeaders()
) => {
  try {
    const res: Resopnse = await axios.get(BASE_URL + url, {
      headers: Object.assign({}, headers),
      params: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        key: process.env.REACT_APP_CLIENT_SECRET,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};
