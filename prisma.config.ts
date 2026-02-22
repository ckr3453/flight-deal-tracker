import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const isLibsql = url.startsWith("libsql://");

const config = {
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: isLibsql ? "file:./prisma/dev.db" : url,
  },
  migrate: {
    adapter: async () => {
      if (isLibsql) {
        return new PrismaLibSql({
          url,
          authToken: process.env.TURSO_AUTH_TOKEN,
        });
      }
      return new PrismaBetterSqlite3({ url });
    },
  },
};

export default defineConfig(config as Parameters<typeof defineConfig>[0]);
