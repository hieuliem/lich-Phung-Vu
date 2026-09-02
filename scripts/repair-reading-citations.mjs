import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL_UNPOOLED or DATABASE_URL before repairing.');
const sql = neon(connectionString);
const rows = await sql.query('SELECT id, celebration_date::text AS celebration_date FROM celebrations ORDER BY celebration_date');
const labels = [['firstReading', 'Bài đọc I'], ['psalm', 'Đáp ca'], ['secondReading', 'Bài đọc II'], ['gospel', 'Tin Mừng']];
let repaired = 0;
let unavailable = 0;

for (let i = 0; i < rows.length; i += 8) {
  const batch = rows.slice(i, i + 8);
  await Promise.all(batch.map(async (row) => {
    const date = String(row.celebration_date).slice(0, 10);
    const response = await fetch(`https://cpbjr.github.io/catholic-readings-api/readings/${date.slice(0, 4)}/${date.slice(5)}.json`);
    if (!response.ok) { unavailable += 1; return; }
    const payload = await response.json();
    const readings = labels.map(([key, kind]) => ({ kind, citation: payload.readings?.[key] })).filter((item) => item.citation);
    if (!readings.length) { unavailable += 1; return; }
    await sql.query('DELETE FROM readings WHERE celebration_id = $1', [row.id]);
    for (const [index, reading] of readings.entries()) {
      await sql.query('INSERT INTO readings (celebration_id, reading_order, kind, citation, excerpt) VALUES ($1,$2,$3,$4,$5)', [row.id, index + 1, reading.kind, reading.citation, reading.citation]);
    }
    await sql.query("UPDATE celebrations SET calendar_source = 'general-roman-verified', source_url = $1 WHERE id = $2 AND calendar_source <> 'vietnam'", [payload.usccbLink ?? payload.apiEndpoint, row.id]);
    repaired += 1;
  }));
  console.log(`Checked ${Math.min(i + 8, rows.length)}/${rows.length}`);
}
console.log(`Repaired ${repaired} celebrations; source unavailable for ${unavailable}.`);
