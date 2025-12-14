import axios from "axios";

export async function fetchProviderData(url: string) {
  const timeout = Number(process.env.PROVIDER_REQUEST_TIMEOUT_MS) || 10000;

  const response = await axios.get(url, { timeout });
  return response.data;
}
