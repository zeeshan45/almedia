import express from "express";
import { payload as offer1Payload } from "../payloads/offer1.payload";
import { payload as offer2Payload } from "../payloads/offer2.payload";

export async function startMockServer(port = 4000): Promise<void> {
  const app = express();

  app.get("/offer1", (_, res) => res.json(offer1Payload));
  app.get("/offer2", (_, res) => res.json(offer2Payload));

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`[MOCK] Server running on http://localhost:${port}`);
      resolve();
    });
  });
}
