import { getProviderAdapter } from "../providers/provider.factory";
import { validateOffer } from "../services/validator.service";
import { OfferRepository } from "../services/offer.repository";
import { logger } from "../utils/logger";

import { payload as offer1Payload } from "../payloads/offer1.payload";
import { payload as offer2Payload } from "../payloads/offer2.payload";

export async function runOfferImportJob() {
  const repo = new OfferRepository();

  const providers = [
    { name: "offer1", payload: offer1Payload },
    { name: "offer2", payload: offer2Payload },
  ];

  for (const provider of providers) {
    logger.info(`Processing provider: ${provider.name}`);

    const adapter = getProviderAdapter(provider.name);
    const offers = adapter.transform(provider.payload);

    for (const offer of offers) {
      const errors = validateOffer(offer);

      if (errors.length > 0) {
        logger.warn(
          `Skipping offer ${offer.externalOfferId}: ${errors.join(", ")}`
        );
        continue;
      }

      await repo.upsert(offer);
    }
  }
}
