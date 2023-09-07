import axios from "axios";

export const getUsers = async () => {
  const res = await axios.get(
    "https://backend.tiposmart.com/tips/api/country/countries"
  );
  return res;
};
