import { AppDataSource } from "../config/data-source";
import { Offer } from "../entity/offer.entity";

export class OfferRepository {
  private repo = AppDataSource.getRepository(Offer);

  async upsert(offer: Offer): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(Offer)
      .values({
        name: offer.name,
        slug: offer.slug,
        description: offer.description,
        requirements: offer.requirements,
        thumbnail: offer.thumbnail,
        isDesktop: offer.isDesktop,
        isAndroid: offer.isAndroid,
        isIos: offer.isIos,
        offerUrlTemplate: offer.offerUrlTemplate,
        providerName: offer.providerName,
        externalOfferId: offer.externalOfferId,
      })
      .orUpdate(
        [
          "name",
          "slug",
          "description",
          "requirements",
          "thumbnail",
          "is_desktop",
          "is_android",
          "is_ios",
          "offer_url_template",
        ],
        ["provider_name", "external_offer_id"]
      )
      .updateEntity(false) // 🔥 THIS IS THE KEY LINE
      .execute();
  }
}
