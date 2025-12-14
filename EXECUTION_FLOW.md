# 📚 Execution Flow - Simple Explanation for Beginners

## 🎯 What This Application Does
This is an **offer fetcher** application. It:
1. Connects to a database
2. Reads offer data from different providers (like offer1 and offer2)
3. Transforms the data into a standard format
4. Validates the data
5. Saves it to the database

---

## 🚀 Where to Start? (The Entry Point)

**Start here:** `src/index.ts` - This is where your program begins!

Think of it like the **main door** of a house. When you run `npm start`, this file runs first.

---

## 📖 Step-by-Step Execution Flow

### **Step 1: Program Starts** (`src/index.ts`)

```typescript
// Line 1: Import special TypeScript features
import "reflect-metadata";

// Line 2-3: Import what we need
import { AppDataSource } from "./config/data-source";
import { runOfferImportJob } from "./job/offer-import.job";

// Line 5-9: The main function that runs everything
async function bootstrap() {
  await AppDataSource.initialize();  // Connect to database
  await runOfferImportJob();          // Do the actual work
  process.exit(0);                    // Exit when done
}

// Line 11-14: Start the program and handle errors
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**What happens:**
- The `bootstrap()` function is called
- It connects to the database first
- Then it runs the job to import offers
- Finally, it exits

---

### **Step 2: Connect to Database** (`src/config/data-source.ts`)

```typescript
// This creates a connection to MySQL database
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "PAss123",
  database: "almedia",
  entities: [Offer],  // Tells TypeORM about our Offer table
  synchronize: true,
});
```

**What happens:**
- Creates a connection to your MySQL database
- Sets up TypeORM (a tool to work with databases)
- Makes sure the database is ready to use

---

### **Step 3: Run the Import Job** (`src/job/offer-import.job.ts`)

This is where the **real work** happens!

```typescript
export async function runOfferImportJob() {
  // Step 3.1: Create a repository (helper to save data)
  const repo = new OfferRepository();

  // Step 3.2: List of providers to process
  const providers = [
    { name: "offer1", payload: offer1Payload },
    { name: "offer2", payload: offer2Payload },
  ];

  // Step 3.3: Loop through each provider
  for (const provider of providers) {
    // Step 3.4: Get the right adapter (transformer)
    const adapter = getProviderAdapter(provider.name);
    
    // Step 3.5: Transform the data to standard format
    const offers = adapter.transform(provider.payload);

    // Step 3.6: Loop through each offer
    for (const offer of offers) {
      // Step 3.7: Validate the offer
      const errors = validateOffer(offer);

      // Step 3.8: If there are errors, skip this offer
      if (errors.length > 0) {
        logger.warn(`Skipping offer...`);
        continue;
      }

      // Step 3.9: Save to database
      await repo.upsert(offer);
    }
  }
}
```

**What happens:**
1. Creates a repository (helper to save data)
2. Loops through each provider (offer1, offer2)
3. For each provider:
   - Gets the right adapter (transformer)
   - Transforms the data
   - Validates each offer
   - Saves valid offers to database

---

### **Step 4: Get the Right Adapter** (`src/providers/provider.factory.ts`)

```typescript
// A registry (like a phone book) of adapters
const registry: Record<string, ProviderAdapter> = {
  offer1: new Offer1Adapter(),
  offer2: new Offer2Adapter(),
};

// Function to get the right adapter
export function getProviderAdapter(name: string): ProviderAdapter {
  const adapter = registry[name];
  if (!adapter) throw new Error(`Unknown provider: ${name}`);
  return adapter;
}
```

**What happens:**
- This is like a **phone book** - it knows which adapter to use for each provider
- If you ask for "offer1", it gives you `Offer1Adapter`
- If you ask for "offer2", it gives you `Offer2Adapter`

**Why?** Different providers send data in different formats. Each adapter knows how to convert its provider's format into the standard format.

---

### **Step 5: Transform the Data** (`src/providers/adapters/offer1.adapter.ts` or `offer2.adapter.ts`)

Each adapter has a `transform()` method that:
- Takes the raw data from the provider
- Converts it into the standard `Offer` format
- Returns an array of offers

**Example:**
```typescript
// offer1 might send: { id: 123, title: "Job" }
// The adapter converts it to: { externalOfferId: "123", name: "Job", ... }
```

---

### **Step 6: Validate the Offer** (`src/services/validator.service.ts`)

```typescript
export function validateOffer(offer: Offer): string[] {
  const errors: string[] = [];

  // Check if required fields are present
  if (!offer.externalOfferId) errors.push("externalOfferId missing");
  if (!offer.name) errors.push("name missing");
  if (!offer.slug) errors.push("slug missing");
  // ... more checks

  return errors;
}
```

**What happens:**
- Checks if all required fields are present
- Returns an array of errors (empty if everything is OK)
- If there are errors, the offer is skipped

---

### **Step 7: Save to Database** (`src/services/offer.repository.ts`)

```typescript
async upsert(offer: Offer): Promise<void> {
  await this.repo
    .createQueryBuilder()
    .insert()
    .into(Offer)
    .values(offer)
    .orUpdate([...fields], ["provider_name", "external_offer_id"])
    .execute();
}
```

**What happens:**
- **Upsert** = Update if exists, Insert if new
- Saves the offer to the database
- If an offer with the same provider and ID already exists, it updates it
- Otherwise, it creates a new one

---

## 🔄 Complete Flow Diagram

```
START
  ↓
src/index.ts (bootstrap function)
  ↓
1. Connect to Database (data-source.ts)
  ↓
2. Run Import Job (offer-import.job.ts)
  ↓
3. For each provider:
   ├─→ Get Adapter (provider.factory.ts)
   ├─→ Transform Data (offer1.adapter.ts or offer2.adapter.ts)
   └─→ For each offer:
       ├─→ Validate (validator.service.ts)
       └─→ Save to Database (offer.repository.ts)
  ↓
END
```

---

## 🎓 Key TypeScript Concepts Used

1. **async/await**: Used to wait for database operations to complete
2. **import/export**: Used to share code between files
3. **interfaces**: Define what data structures should look like
4. **classes**: Used to organize code (like `OfferRepository`)
5. **functions**: Reusable blocks of code

---

## 🏃 How to Run

1. Make sure your database is running
2. Run: `npm start`
3. The program will:
   - Connect to the database
   - Process all providers
   - Save offers
   - Exit

---

## 📁 File Structure Overview

```
src/
├── index.ts                    ← START HERE! Entry point
├── config/
│   └── data-source.ts         ← Database connection
├── job/
│   └── offer-import.job.ts    ← Main business logic
├── providers/
│   ├── provider.factory.ts    ← Gets the right adapter
│   └── adapters/
│       ├── offer1.adapter.ts  ← Transforms offer1 data
│       └── offer2.adapter.ts  ← Transforms offer2 data
├── services/
│   ├── validator.service.ts   ← Validates offers
│   └── offer.repository.ts   ← Saves to database
├── entity/
│   └── offer.entity.ts        ← Defines the Offer structure
└── payloads/
    ├── offer1.payload.ts      ← Sample data for offer1
    └── offer2.payload.ts      ← Sample data for offer2
```

---

## 💡 Tips for Beginners

1. **Start with `index.ts`** - Always start reading from the entry point
2. **Follow the imports** - When you see `import`, go to that file to understand what it does
3. **Read top to bottom** - Code usually flows from top to bottom
4. **Use console.log** - Add `console.log()` statements to see what's happening
5. **One file at a time** - Don't try to understand everything at once!

---

## ❓ Common Questions

**Q: What is `async/await`?**
A: It's a way to wait for things that take time (like database operations) without blocking your program.

**Q: What is `import`?**
A: It brings code from another file into the current file so you can use it.

**Q: What is a `repository`?**
A: It's a helper class that makes it easier to save and retrieve data from the database.

**Q: What is an `adapter`?**
A: It's a transformer that converts data from one format to another format.

---

Happy coding! 🎉

