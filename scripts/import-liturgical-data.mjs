import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npm run db:import -- data/liturgical-a.json');
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL_UNPOOLED or DATABASE_URL before importing.');

const payload = JSON.parse(await readFile(inputPath, 'utf8'));
if (!payload.version || !Array.isArray(payload.celebrations)) {
  throw new Error('Input must contain { version, celebrations[] }.');
}

const sql = neon(connectionString);
let imported = 0;

for (const item of payload.celebrations) {
  if (!['A', 'B', 'C', 'I', 'II'].includes(item.liturgicalYear)) throw new Error(`Invalid liturgicalYear for ${item.slug}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.celebrationDate)) throw new Error(`Invalid date for ${item.slug}`);
  if (!item.slug || !item.title || !item.season || !item.rank || !item.color) throw new Error(`Missing required fields for ${item.slug ?? '(unknown)'}`);

  const [celebration] = await sql.query(
    `INSERT INTO celebrations (slug, event_key, title, celebration_date, liturgical_year, season, rank, color, summary)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (slug) DO UPDATE SET event_key=EXCLUDED.event_key, title=EXCLUDED.title, celebration_date=EXCLUDED.celebration_date,
       liturgical_year=EXCLUDED.liturgical_year, season=EXCLUDED.season, rank=EXCLUDED.rank,
       color=EXCLUDED.color, summary=EXCLUDED.summary
     RETURNING id`,
    [item.slug, item.eventKey ?? item.slug.replace(/-[0-9]{4}-[0-9]{2}-[0-9]{2}$/, ''), item.title, item.celebrationDate, item.liturgicalYear, item.season, item.rank, item.color, item.summary ?? null],
  );

  await sql.query('DELETE FROM readings WHERE celebration_id = $1', [celebration.id]);
  await sql.query('DELETE FROM celebration_hymns WHERE celebration_id = $1', [celebration.id]);

  for (const [index, reading] of (item.readings ?? []).entries()) {
    await sql.query(
      'INSERT INTO readings (celebration_id, reading_order, kind, citation, excerpt) VALUES ($1,$2,$3,$4,$5)',
      [celebration.id, index + 1, reading.kind, reading.citation, reading.excerpt ?? reading.citation],
    );
  }

  for (const [index, hymn] of (item.hymns ?? []).entries()) {
    const [existing] = await sql.query(
      'SELECT id FROM hymns WHERE title = $1 AND liturgical_part = $2 LIMIT 1',
      [hymn.title, hymn.liturgicalPart],
    );
    const hymnId = existing?.id ?? (await sql.query(
      'INSERT INTO hymns (title, composer, liturgical_part, format) VALUES ($1,$2,$3,$4) RETURNING id',
      [hymn.title, hymn.composer ?? null, hymn.liturgicalPart, hymn.format ?? null],
    ))[0].id;
    await sql.query(
      'INSERT INTO celebration_hymns (celebration_id, hymn_id, sort_order) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [celebration.id, hymnId, index + 1],
    );
  }
  imported += 1;
}

console.log(`Imported ${imported} celebrations (version ${payload.version}).`);

