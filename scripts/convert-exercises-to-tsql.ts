import { readFileSync, writeFileSync } from "fs";

function convertSqlBody(body: string) {
  let b = body;
  b = b.replace(/\bILIKE\b/g, "LIKE");
  b = b.replace(/\bTRUE\b/g, "1").replace(/\bFALSE\b/g, "0");
  b = b.replace(/\bNOW\(\)/gi, "GETDATE()");
  b = b.replace(/\bSERIAL\b/g, "INT IDENTITY(1,1)");
  b = b.replace(/\bTEXT\b/g, "NVARCHAR(MAX)");
  b = b.replace(/TIMESTAMP DEFAULT GETDATE\(\)/gi, "DATETIME2 DEFAULT GETDATE()");
  b = b.replace(/\bTIMESTAMP\b/g, "DATETIME2");
  const lim = b.match(/\bLIMIT\s+(\d+)\s*;?\s*$/i);
  if (lim && !/\bTOP\s+\d+/i.test(b)) {
    b = b.replace(/\bLIMIT\s+\d+\s*;?\s*$/i, "").replace(/\bSELECT\b/i, `SELECT TOP ${lim[1]}`);
  }
  return b;
}

function convertFile(path: string) {
  let s = readFileSync(path, "utf8");
  s = s.replace(/(referenceSql|compareSql|starterSql):\s*`([\s\S]*?)`/g, (_full, key, body) => {
    return `${key}: \`${convertSqlBody(body)}\``;
  });
  s = s.replace(/(referenceSql|compareSql|starterSql):\s*"([^"]*)"/g, (_full, key, body) => {
    return `${key}: "${convertSqlBody(body)}"`;
  });
  // educational prose / hints
  s = s.replace(/\bILIKE\b/g, "LIKE");
  s = s.replace(/LIMIT N/g, "TOP N");
  s = s.replace(/LIMIT (\d+)/g, "TOP $1");
  s = s.replace(/\bLIMIT\b(?!ED)/g, "TOP");
  s = s.replace(/\bSERIAL\b/g, "INT IDENTITY(1,1)");
  s = s.replace(/TIMESTAMP DEFAULT NOW\(\)/gi, "DATETIME2 DEFAULT GETDATE()");
  writeFileSync(path, s);
  console.log("converted", path);
}

for (const f of [
  "src/data/exercises/part1.ts",
  "src/data/exercises/part2.ts",
  "src/data/exercises/part3.ts",
]) {
  convertFile(f);
}
