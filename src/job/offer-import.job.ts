//src/job/offer-import.job.ts
import { PROVIDERS } from "../providers/providers.config";
import { getProviderAdapter } from "../providers/provider.factory";
import { fetchProviderData } from "../services/http.service";
import { validateOffer } from "../services/validator.service";
import { OfferRepository } from "../services/offer.repository";
import { logger } from "../utils/logger";

export async function runOfferImportJob() {
  const repo = new OfferRepository();

  const results = await Promise.allSettled(
    PROVIDERS.map(async (provider) => {
      logger.info(`Fetching ${provider.name}`);
      const data = await fetchProviderData(provider.url);
      return { provider, data };
    })
  );
  // console.log(results,"results");
  
  for (const result of results) {
    if (result.status !== "fulfilled") {
      logger.error("Provider fetch failed");
      continue;
    }
    // console.log(result,"result");
    const { provider, data } = result.value;
    // console.log(data,"data");
    console.log(
  provider.name,
  "RAW RESPONSE:",
  JSON.stringify(data, null, 2)
);

    const adapter = getProviderAdapter(provider.name);
    const offers = adapter.transform(data);

    for (const offer of offers) {
      const errors = validateOffer(offer);
      if (errors.length) {
        logger.warn(`Skipping ${offer.externalOfferId}`);
        continue;
      }
      await repo.upsert(offer);
    }
  }

  logger.info("Offer import job completed");
}
