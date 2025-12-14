import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { runOfferImportJob } from "./job/offer-import.job";

async function bootstrap() {
  await AppDataSource.initialize();
  await runOfferImportJob();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
