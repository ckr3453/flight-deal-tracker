import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT, "email" TEXT NOT NULL, "emailVerified" DATETIME, "image" TEXT, "role" TEXT NOT NULL DEFAULT 'user', "isApproved" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Account" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "provider" TEXT NOT NULL, "providerAccountId" TEXT NOT NULL, "refresh_token" TEXT, "access_token" TEXT, "expires_at" INTEGER, "token_type" TEXT, "scope" TEXT, "id_token" TEXT, "session_state" TEXT, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Session" ("id" TEXT NOT NULL PRIMARY KEY, "sessionToken" TEXT NOT NULL, "userId" TEXT NOT NULL, "expires" DATETIME NOT NULL, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "VerificationToken" ("identifier" TEXT NOT NULL, "token" TEXT NOT NULL, "expires" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Monitor" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "flyFrom" TEXT NOT NULL, "flyTo" TEXT NOT NULL, "flightType" TEXT NOT NULL DEFAULT 'round', "adults" INTEGER NOT NULL DEFAULT 1, "children" INTEGER NOT NULL DEFAULT 0, "infants" INTEGER NOT NULL DEFAULT 0, "nightsFrom" INTEGER, "nightsTo" INTEGER, "dateFrom" TEXT, "dateTo" TEXT, "maxPrice" INTEGER, "status" TEXT NOT NULL DEFAULT 'active', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "PriceRecord" ("id" TEXT NOT NULL PRIMARY KEY, "monitorId" TEXT NOT NULL, "minPrice" INTEGER NOT NULL, "avgPrice" INTEGER NOT NULL, "maxPrice" INTEGER NOT NULL, "count" INTEGER NOT NULL, "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Deal" ("id" TEXT NOT NULL PRIMARY KEY, "monitorId" TEXT NOT NULL, "price" INTEGER NOT NULL, "dropRate" REAL, "dealType" TEXT NOT NULL, "airline" TEXT, "bookingUrl" TEXT, "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "Notification" ("id" TEXT NOT NULL PRIMARY KEY, "monitorId" TEXT NOT NULL, "dealType" TEXT NOT NULL, "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,
];

for (const sql of statements) {
  await client.execute(sql);
  console.log("OK:", sql.slice(0, 60) + "...");
}

console.log("\nAll tables created successfully!");
client.close();
