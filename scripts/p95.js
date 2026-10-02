// Loeb Newmani JSON-raporti ja arvutab iga päringu vastuseaegade keskmise, p95 ja maksimumi.
// Kasutus: npm run newman && npm run p95
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Kasutus: node scripts/p95.js postman/tulemus.json");
  process.exit(1);
}

const report = JSON.parse(readFileSync(file, "utf8"));
const byName = new Map();
for (const execution of report.run.executions) {
  const name = execution.item.name;
  const time = execution.response?.responseTime;
  if (typeof time !== "number") continue;
  if (!byName.has(name)) byName.set(name, []);
  byName.get(name).push(time);
}

// p95 "lähima järgu" meetodil: sorteeri kasvavalt, võta element kohal ceil(0.95 * n)
function percentile(sorted, p) {
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.max(0, rank - 1)];
}

console.log("päring".padEnd(34), "n".padStart(4), "keskm".padStart(7), "p95".padStart(7), "max".padStart(7));
for (const [name, times] of byName) {
  const sorted = [...times].sort((a, b) => a - b);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  console.log(
    name.padEnd(34),
    String(times.length).padStart(4),
    `${avg} ms`.padStart(7),
    `${percentile(sorted, 95)} ms`.padStart(7),
    `${sorted.at(-1)} ms`.padStart(7),
  );
}
