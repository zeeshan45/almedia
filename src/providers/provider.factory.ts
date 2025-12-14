import { ProviderAdapter } from "./adapters/provider.adapter";
import { Offer1Adapter } from "./adapters/offer1.adapter";
import { Offer2Adapter } from "./adapters/offer2.adapter";

const registry: Record<string, ProviderAdapter> = {
  offer1: new Offer1Adapter(),
  offer2: new Offer2Adapter(),
};

export function getProviderAdapter(name: string): ProviderAdapter {
  const adapter = registry[name];
  if (!adapter) throw new Error(`Unknown provider: ${name}`);
  return adapter;
}
