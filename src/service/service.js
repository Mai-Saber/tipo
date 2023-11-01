import axios from "axios";

export const base_url = "https://backend.profitsway.net/erp/public/api";

export const config = {
  headers: {
    " Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const getData = async (url) => {
  const res = await axios.get(`${base_url}+${url}`);
  return res;
};
