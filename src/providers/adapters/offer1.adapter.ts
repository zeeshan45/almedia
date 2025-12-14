import { ProviderAdapter } from "./provider.adapter";
import { Offer } from "../../entity/offer.entity";
import { generateSlug } from "../../utils/slug.util";

export class Offer1Adapter implements ProviderAdapter {
  readonly providerName = "offer1";

  transform(payload: any): Offer[] {
    return payload.response.offers.map((o: any) => {
      const offer = new Offer();

      offer.externalOfferId = String(o.offer_id);
      offer.name = o.offer_name;
      offer.description = o.offer_desc;
      offer.requirements = o.call_to_action;
      offer.thumbnail = o.image_url;
      offer.offerUrlTemplate = o.offer_url;
      offer.providerName = this.providerName;

      offer.isDesktop = o.platform === "desktop" ? 1 : 0;
      offer.isIos = o.device === "iphone_ipad" ? 1 : 0;
      offer.isAndroid = o.device !== "iphone_ipad" ? 1 : 0;

      offer.slug = generateSlug(
        offer.name,
        offer.providerName,
        offer.externalOfferId
      );

      return offer;
    });
  }
}
