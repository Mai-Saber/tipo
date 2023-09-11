import axios from "axios";

export const base_url = "https://backend.tiposmart.com/tips/api";

export const getData = async (url) => {
  const res = await axios.get(`${base_url}+${url}`);
  return res;
};
