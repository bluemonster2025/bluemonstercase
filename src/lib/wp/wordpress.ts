import axios, { AxiosInstance } from "axios";

const WP_URL = process.env.WOO_SITE_URL;

export const createWpApi = (token?: string): AxiosInstance => {
  return axios.create({
    baseURL: `${WP_URL}/wp-json`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
};
