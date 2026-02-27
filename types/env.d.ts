// types/env.d.ts
// Centralized typing for process.env custom variables used by GAFAIG.
// IMPORTANT: keep `export {}` at the bottom so TypeScript treats this as a module.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GAFAIG_ADMIN_PASSWORD?: string;
      GAFAIG_ADMIN_DEMO_PASSWORD?: string;
      GAFAIG_SESSION_SECRET?: string;

      SNOWFLAKE_ACCOUNT?: string;
      SNOWFLAKE_USERNAME?: string;
      SNOWFLAKE_PASSWORD?: string;
      SNOWFLAKE_PRIVATE_KEY?: string;
      SNOWFLAKE_WAREHOUSE?: string;
      SNOWFLAKE_DATABASE?: string;
      SNOWFLAKE_SCHEMA?: string;
      SNOWFLAKE_ROLE?: string;

      // Optional public/query endpoint (if you use it)
      SNOWFLAKE_QUERY_ENDPOINT?: string;

      NEXT_PUBLIC_SITE_URL?: string;

      NODE_ENV?: "development" | "production" | "test";
    }
  }
}

export {};