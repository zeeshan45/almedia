import "dotenv/config";  
import "reflect-metadata";

import { AppDataSource } from "./config/data-source";
import { runOfferImportJob } from "./job/offer-import.job";
import { startMockServer } from "./mock/mock-server";

async function bootstrap() {
  console.log("DB host",process.env.DB_HOST);
  if (process.env.USE_MOCK_PROVIDERS === "true") {
    await startMockServer(Number(process.env.MOCK_SERVER_PORT));
  }

  await AppDataSource.initialize();
  await runOfferImportJob();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
