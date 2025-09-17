import type { AxiosError } from "axios";
import { createWpApi } from "./wp/wordpress";

export async function getPageACFById(id: number) {
  const wpApi = createWpApi();
  try {
    const { data } = await wpApi.get(`/acf/v3/pages/${id}`);
    return data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(axiosError.response?.data || axiosError.message);
    throw new Error("Erro ao buscar ACF");
  }
}
