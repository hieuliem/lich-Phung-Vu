ALTER TABLE celebrations ADD COLUMN IF NOT EXISTS calendar_source text NOT NULL DEFAULT 'general-roman';
--> statement-breakpoint
ALTER TABLE celebrations ADD COLUMN IF NOT EXISTS source_url text;
--> statement-breakpoint
ALTER TABLE celebrations ADD COLUMN IF NOT EXISTS regional_note text;
--> statement-breakpoint
INSERT INTO celebrations (slug, title, celebration_date, liturgical_year, season, rank, color, summary, calendar_source, source_url, regional_note)
VALUES
  ('thu-tu-le-tro-2026-vietnam', 'Thứ Tư Lễ Tro (cử hành tại Việt Nam)', '2026-02-18', 'A', 'Mùa Chay', 'Lễ Trọng bậc cao', 'Tím', 'Ngày theo lịch chung; tại Việt Nam ngày này cử hành Thánh lễ Mồng 2 Tết.', 'vietnam', 'https://hdgmvietnam.com/chi-tiet/uy-ban-phung-tu-thong-bao-ve-viec-cu-hanh-le-tro-nam-2026', 'Lịch Việt Nam: cử hành Thánh lễ Mồng 2 Tết; Lễ Tro được cử hành ngày 20/02/2026.'),
  ('thu-sau-sau-le-tro-2026-vietnam', 'Thứ Sáu sau Lễ Tro (cử hành Lễ Tro tại Việt Nam)', '2026-02-20', 'A', 'Mùa Chay', 'Lễ Trọng bậc cao', 'Tím', 'Cử hành Lễ Tro, làm phép và xức tro, ăn chay và kiêng thịt.', 'vietnam', 'https://hdgmvietnam.com/chi-tiet/uy-ban-phung-tu-thong-bao-ve-viec-cu-hanh-le-tro-nam-2026', 'Điều chỉnh riêng của Giáo Hội tại Việt Nam năm 2026.')
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, celebration_date=EXCLUDED.celebration_date, summary=EXCLUDED.summary, calendar_source=EXCLUDED.calendar_source, source_url=EXCLUDED.source_url, regional_note=EXCLUDED.regional_note;
--> statement-breakpoint
INSERT INTO readings (celebration_id, reading_order, kind, citation, excerpt)
SELECT c.id, v.reading_order, v.kind, v.citation, v.citation
FROM celebrations c
CROSS JOIN (VALUES
  (1,'Bài đọc I','Ge 2,12-18'),
  (2,'Đáp ca','Tv 50'),
  (3,'Bài đọc II','2 Cr 5,20–6,2'),
  (4,'Tin Mừng','Mt 6,1-6.16-18')
) AS v(reading_order, kind, citation)
WHERE c.slug = 'thu-tu-le-tro-2026-vietnam'
  AND NOT EXISTS (SELECT 1 FROM readings r WHERE r.celebration_id = c.id);
--> statement-breakpoint
INSERT INTO readings (celebration_id, reading_order, kind, citation, excerpt)
SELECT c.id, v.reading_order, v.kind, v.citation, v.citation
FROM celebrations c
CROSS JOIN (VALUES
  (1,'Bài đọc I','Is 58,1-9a'),
  (2,'Đáp ca','Tv 50'),
  (3,'Tin Mừng','Mt 9,14-15')
) AS v(reading_order, kind, citation)
WHERE c.slug = 'thu-sau-sau-le-tro-2026-vietnam'
  AND NOT EXISTS (SELECT 1 FROM readings r WHERE r.celebration_id = c.id);

