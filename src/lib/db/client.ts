import fs from "fs";
import path from "path";
import { createClient, type Client, type InValue } from "@libsql/client";
import postgres from "postgres";

/**
 * One tiny database interface over two backends:
 *  - libSQL / SQLite (default; local file, Docker volume or remote libSQL)
 *  - PostgreSQL (when DATABASE_URL is a postgres:// URL, e.g. Supabase)
 * Queries are written once with `?` placeholders in portable SQL; they are rewritten to $1.. for Postgres.
 */

export type DbValue = InValue | Buffer | undefined;
export interface Statement {
  sql: string;
  args?: DbValue[];
}
export interface QueryResult {
  rows: Record<string, unknown>[];
  rowsAffected: number;
}

export const isPostgres = /^postgres(ql)?:\/\//i.test(process.env.DATABASE_URL ?? "");
export const dialect: "postgres" | "sqlite" = isPostgres ? "postgres" : "sqlite";

// ── PostgreSQL ──

let pgInstance: postgres.Sql | null = null;

function pg(): postgres.Sql {
  if (!pgInstance) {
    const url = process.env.DATABASE_URL!;
    const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
    pgInstance = postgres(url, {
      // Required for Supabase's transaction-mode pooler (no prepared statements).
      prepare: false,
      // The pooler cannot handle pipelined queries (concurrent queries on one connection hang), so one at a time.
      max_pipeline: 1,
      max: Number(process.env.DATABASE_POOL_MAX || 5),
      idle_timeout: 20,
      connect_timeout: 20,
      ssl: local ? false : "require",
    });
  }
  return pgInstance;
}

/** Rewrites `?` placeholders to Postgres `$1, $2, ...`. */
function toPostgres(sql: string): string {
  let n = 0;
  return sql.replace(/\?/g, () => `$${++n}`);
}

const pgArgs = (args: DbValue[] = []) => args.map((a) => (a === undefined ? null : a)) as never[];

async function pgRun(runner: postgres.Sql | postgres.TransactionSql, s: Statement): Promise<QueryResult> {
  const result = await runner.unsafe(toPostgres(s.sql), pgArgs(s.args));
  return { rows: result as unknown as Record<string, unknown>[], rowsAffected: result.count ?? 0 };
}

// ── libSQL / SQLite ──

let sqliteInstance: Client | null = null;
let pragmaDone = false;

export function getDatabasePath(): string {
  const dataDir = path.join(process.cwd(), "data");
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch {
    return path.join("/tmp", "sheikh_ferej.db");
  }
  return path.join(dataDir, "sheikh_ferej.db");
}

function sqlite(): Client {
  if (!sqliteInstance) {
    sqliteInstance = createClient({
      url: process.env.DATABASE_URL || `file:${getDatabasePath()}`,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return sqliteInstance;
}

async function sqliteReady(): Promise<Client> {
  const client = sqlite();
  if (!pragmaDone) {
    pragmaDone = true;
    const url = process.env.DATABASE_URL;
    if (!url || url.startsWith("file:")) {
      try {
        await client.execute("PRAGMA journal_mode = WAL;");
        await client.execute("PRAGMA foreign_keys = ON;");
      } catch (err) {
        console.warn("Notice: PRAGMA journal_mode/foreign_keys was not applied:", err);
      }
    }
  }
  return client;
}

// ── Public API ──

export async function execute(sql: string, args: DbValue[] = []): Promise<QueryResult> {
  if (isPostgres) return pgRun(pg(), { sql, args });
  const res = await (await sqliteReady()).execute({ sql, args: args as InValue[] });
  return { rows: res.rows as unknown as Record<string, unknown>[], rowsAffected: res.rowsAffected };
}

export async function queryAll<T = Record<string, unknown>>(sql: string, args: DbValue[] = []): Promise<T[]> {
  return (await execute(sql, args)).rows as unknown as T[];
}

export async function queryOne<T = Record<string, unknown>>(sql: string, args: DbValue[] = []): Promise<T | null> {
  const rows = await queryAll<T>(sql, args);
  return rows[0] ?? null;
}

/** Runs the statements in one transaction. */
export async function batch(statements: Statement[]): Promise<QueryResult[]> {
  if (isPostgres) {
    return (await pg().begin(async (tx) => {
      const out: QueryResult[] = [];
      for (const s of statements) out.push(await pgRun(tx, s));
      return out;
    })) as QueryResult[];
  }
  const client = await sqliteReady();
  const results = await client.batch(
    statements.map((s) => ({ sql: s.sql, args: (s.args ?? []) as InValue[] })),
    "write"
  );
  return results.map((r) => ({ rows: r.rows as unknown as Record<string, unknown>[], rowsAffected: r.rowsAffected }));
}

/** Column names of a table (empty when the table does not exist). */
export async function tableColumns(table: string): Promise<string[]> {
  if (isPostgres) {
    const rows = await queryAll<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = ?;",
      [table]
    );
    return rows.map((r) => r.column_name);
  }
  const rows = await queryAll<{ name: string }>(`PRAGMA table_info(${table});`);
  return rows.map((r) => r.name);
}

/** SQL type for binary data. */
export const BINARY_TYPE = isPostgres ? "BYTEA" : "BLOB";
