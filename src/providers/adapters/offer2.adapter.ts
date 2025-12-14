import { ProviderAdapter } from "./provider.adapter";
import { Offer } from "../../entity/offer.entity";
import { generateSlug } from "../../utils/slug.util";

export class Offer2Adapter implements ProviderAdapter {
  readonly providerName = "offer2";

  transform(payload: any): Offer[] {
    return Object.values(payload.data).map((entry: any) => {
      const o = entry.Offer;
      const os = entry.OS;

      const offer = new Offer();

      offer.externalOfferId = String(o.campaign_id);
      offer.name = o.name;
      offer.description = o.description;
      offer.requirements = o.instructions;
      offer.thumbnail = o.icon;
      offer.offerUrlTemplate = o.tracking_url;
      offer.providerName = this.providerName;

      offer.isDesktop = os.web ? 1 : 0;
      offer.isIos = os.ios ? 1 : 0;
      offer.isAndroid = os.android ? 1 : 0;

      offer.slug = generateSlug(
        offer.name,
        offer.providerName,
        offer.externalOfferId
      );

      return offer;
    });
  }
}
