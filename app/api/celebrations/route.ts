import { asc, eq, like, or } from 'drizzle-orm';
import { getDb } from '@/db';
import { celebrations, readings, celebrationHymns, hymns } from '@/db/schema';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() ?? '';
  const db = getDb();
  const where = query ? or(like(celebrations.title, `%${query}%`), like(celebrations.season, `%${query}%`)) : undefined;
  const rows = await db.select().from(celebrations).where(where).orderBy(asc(celebrations.celebrationDate));
  const records = await Promise.all(rows.map(async (celebration) => {
    const readingRows = await db.select().from(readings).where(eq(readings.celebrationId, celebration.id)).orderBy(asc(readings.readingOrder));
    const hymnRows = await db.select({ id: hymns.id, title: hymns.title, composer: hymns.composer, liturgicalPart: hymns.liturgicalPart, format: hymns.format })
      .from(celebrationHymns).innerJoin(hymns, eq(celebrationHymns.hymnId, hymns.id))
      .where(eq(celebrationHymns.celebrationId, celebration.id)).orderBy(asc(celebrationHymns.sortOrder));
    return { ...celebration, readings: readingRows, hymns: hymnRows };
  }));
  return Response.json({ records });
}
