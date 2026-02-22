import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const isLibsql = url.startsWith("libsql://");

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    // libsql은 어댑터로 연결하므로 더미 URL 사용
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
});
