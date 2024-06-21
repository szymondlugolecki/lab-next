namespace NodeJS {
  interface ProcessEnv {
    D1: D1Database;
    KV: KVNamespace;
    R2: R2Bucket;
    GITHUB_ACCESS_TOKEN: string;
    GH_REPO_OWNER: string;
    GH_REPO_NAME: string;
  }
}

interface CloudflareEnv {
  D1: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
}
