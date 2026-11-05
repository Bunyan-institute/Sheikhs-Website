import fs from "fs";
import path from "path";
import { createClient, type Client, type InArgs, type InStatement, type ResultSet } from "@libsql/client";

let dbInstance: Client | null = null;
let isPragmaConfigured = false;

/**
 * Returns the path to the local SQLite database file, ensuring the target directory exists.
 */
export function getDatabasePath(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join("/tmp", "sheikh_ferej.db");
    }
  }
  return path.join(dataDir, "sheikh_ferej.db");
}

/**
 * Gets or initializes the LibSQL / SQLite client instance.
 * Automatically supports production remote connections via DATABASE_URL and DATABASE_AUTH_TOKEN.
 */
export function getDb(): Client {
  if (dbInstance) {
    return dbInstance;
  }

  const customUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const url = customUrl ? customUrl : `file:${getDatabasePath()}`;

  dbInstance = createClient({
    url,
    authToken,
  });

  return dbInstance;
}

/**
 * Initializes PRAGMA settings (WAL mode and foreign keys) for local SQLite connections.
 */
export async function initializePragma(): Promise<void> {
  if (isPragmaConfigured) {
    return;
  }
  const client = getDb();
  try {
    // Only attempt PRAGMAs on local file or compatible SQLite/LibSQL endpoints
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
      await client.execute("PRAGMA journal_mode = WAL;");
      await client.execute("PRAGMA foreign_keys = ON;");
    }
    isPragmaConfigured = true;
  } catch (err) {
    // Non-blocking in serverless environments where PRAGMA might not be supported
    console.warn("Notice: PRAGMA journal_mode/foreign_keys was not applied:", err);
  }
}

/**
 * Executes a single parameterized SQL query.
 */
export async function execute(sql: string, args: InArgs = []): Promise<ResultSet> {
  const client = getDb();
  await initializePragma();
  return client.execute({ sql, args });
}

/**
 * Queries multiple rows and casts them to the desired type.
 */
export async function queryAll<T = Record<string, unknown>>(sql: string, args: InArgs = []): Promise<T[]> {
  const res = await execute(sql, args);
  return res.rows as unknown as T[];
}

/**
 * Queries a single row or returns null if not found.
 */
export async function queryOne<T = Record<string, unknown>>(sql: string, args: InArgs = []): Promise<T | null> {
  const res = await execute(sql, args);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0] as unknown as T;
}

/**
 * Executes a batch of statements in a single transaction.
 */
export async function batch(statements: InStatement[]): Promise<ResultSet[]> {
  const client = getDb();
  await initializePragma();
  return client.batch(statements, "write");
}
