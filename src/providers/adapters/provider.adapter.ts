import { Offer } from "../../entity/offer.entity";

export interface ProviderAdapter {
  readonly providerName: string;
  transform(payload: unknown): Offer[];
}
