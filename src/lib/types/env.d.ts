namespace NodeJS {
  interface ProcessEnv {
    D1: D1Database;
    KV: KVNamespace;
    R2: R2Bucket;
  }
}

interface CloudflareEnv {
  D1: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
}
