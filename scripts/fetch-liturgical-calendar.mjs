import { mkdir, writeFile } from 'node:fs/promises';

const years = [2025, 2026, 2027];
const seasonNames = { ADVENT: 'Mùa Vọng', CHRISTMAS: 'Mùa Giáng Sinh', LENT: 'Mùa Chay', EASTER: 'Mùa Phục Sinh', ORDINARY_TIME: 'Mùa Thường Niên' };
const colorNames = { green: 'Xanh', purple: 'Tím', white: 'Trắng', red: 'Đỏ', rose: 'Hồng', black: 'Đen' };
const gradeNames = { 0: 'Ngày thường', 1: 'Kỷ niệm', 2: 'Lễ nhớ tùy chọn', 3: 'Lễ nhớ', 4: 'Lễ kính', 5: 'Lễ kính Chúa', 6: 'Lễ Trọng', 7: 'Lễ Trọng bậc cao' };
const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const celebrations = [];
for (const year of years) {
  const url = `https://litcal.johnromanodorazio.com/api/v5/calendar/${year}?locale=en&year_type=LITURGICAL`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Calendar API failed for ${year}: ${response.status}`);
  const { litcal } = await response.json();
  for (const event of litcal) {
    if (event.is_vigil_mass || !event.readings || !event.liturgical_year) continue;
    const date = event.date.slice(0, 10);
    const liturgicalYear = event.liturgical_year.replace(/^YEAR\s+/i, '').trim();
    const readings = Object.entries(event.readings).map(([key, citation]) => ({
      kind: key === 'first_reading' ? 'Bài đọc I' : key === 'responsorial_psalm' ? 'Đáp ca' : key === 'second_reading' ? 'Bài đọc II' : key === 'gospel_acclamation' ? 'Tung hô Tin Mừng' : 'Tin Mừng',
      citation,
      excerpt: citation,
    }));
    celebrations.push({
      slug: `${slugify(event.name)}-${date}`,
      title: event.name,
      celebrationDate: date,
      liturgicalYear,
      season: seasonNames[event.liturgical_season] ?? event.liturgical_season_lcl,
      rank: gradeNames[event.grade] ?? event.grade_lcl,
      color: (event.color?.[0] && colorNames[event.color[0]]) ?? 'Xanh',
      summary: `Nguồn: Liturgical Calendar API · ${event.name}`,
      readings,
      hymns: [],
    });
  }
}

celebrations.sort((a, b) => a.celebrationDate.localeCompare(b.celebrationDate) || a.title.localeCompare(b.title));
await mkdir(new URL('../data/generated/', import.meta.url), { recursive: true });
await writeFile(new URL('../data/generated/liturgical-abc.json', import.meta.url), JSON.stringify({ version: '2025-2028-general-roman', source: 'https://litcal.johnromanodorazio.com/', celebrations }, null, 2));
console.log(`Generated ${celebrations.length} celebrations and ${celebrations.reduce((sum, item) => sum + item.readings.length, 0)} reading citations.`);

