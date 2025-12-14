const useMock = process.env.USE_MOCK_PROVIDERS === "true";

export type ProviderConfig = {
  name: string;
  url: string;
};

export const PROVIDERS: ProviderConfig[] = [
  {
    name: "offer1",
    url: useMock
      ? "http://localhost:4000/offer1"
      : "https://api.offer1.com/offers",
  },
  {
    name: "offer2",
    url: useMock
      ? "http://localhost:4000/offer2"
      : "https://api.offer2.com/offers",
  },
];
