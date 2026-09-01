CREATE TABLE IF NOT EXISTS celebrations (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  celebration_date date NOT NULL,
  liturgical_year text NOT NULL,
  season text NOT NULL,
  rank text NOT NULL,
  color text NOT NULL,
  summary text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_celebrations_date_rank ON celebrations (celebration_date, rank);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_celebrations_season ON celebrations (season);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS readings (
  id serial PRIMARY KEY,
  celebration_id integer NOT NULL REFERENCES celebrations(id) ON DELETE CASCADE,
  reading_order integer NOT NULL,
  kind text NOT NULL,
  citation text NOT NULL,
  excerpt text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_readings_celebration_order ON readings (celebration_id, reading_order);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS hymns (
  id serial PRIMARY KEY,
  title text NOT NULL,
  composer text,
  liturgical_part text NOT NULL,
  format text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_hymns_title ON hymns (title);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS celebration_hymns (
  celebration_id integer NOT NULL REFERENCES celebrations(id) ON DELETE CASCADE,
  hymn_id integer NOT NULL REFERENCES hymns(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT celebration_hymns_unique UNIQUE (celebration_id, hymn_id)
);
--> statement-breakpoint
INSERT INTO celebrations (slug,title,celebration_date,liturgical_year,season,rank,color,summary) VALUES
('duc-me-vo-nhiem-nguyen-toi-2026','Đức Mẹ Vô Nhiễm Nguyên Tội','2026-12-08','A','Mùa Vọng','Lễ Trọng','Trắng','Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà.'),
('chua-nhat-iii-mua-vong-a-2026','Chúa Nhật III Mùa Vọng – Năm A','2026-12-13','A','Mùa Vọng','Chúa Nhật','Hồng','Hãy vui lên vì Chúa đã gần đến.'),
('dai-le-chua-giang-sinh-2026','Đại Lễ Chúa Giáng Sinh','2026-12-25','A','Giáng Sinh','Lễ Trọng','Trắng','Ngôi Lời đã làm người và ở giữa chúng ta.')
ON CONFLICT (slug) DO NOTHING;
--> statement-breakpoint
INSERT INTO readings (celebration_id,reading_order,kind,citation,excerpt)
SELECT c.id, v.reading_order, v.kind, v.citation, v.excerpt
FROM celebrations c
CROSS JOIN (VALUES
  (1,'Bài đọc I','St 3, 9-15.20','Ta sẽ đặt mối thù giữa mi và người phụ nữ.'),
  (2,'Đáp ca','Tv 97','Hát lên mừng Chúa một bài ca mới.'),
  (3,'Bài đọc II','Ep 1, 3-6.11-12','Trong Đức Kitô, Người đã chọn ta trước cả khi tạo thành vũ trụ.'),
  (4,'Tin Mừng','Lc 1, 26-38','Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà.')
) AS v(reading_order,kind,citation,excerpt)
WHERE c.slug = 'duc-me-vo-nhiem-nguyen-toi-2026'
  AND NOT EXISTS (SELECT 1 FROM readings r WHERE r.celebration_id = c.id);
--> statement-breakpoint
INSERT INTO hymns (title,composer,liturgical_part,format)
SELECT * FROM (VALUES
  ('Kính chào Bà đầy ơn phúc','Lm. Kim Long','Ca nhập lễ','Dâng lễ'),
  ('Mẹ tinh tuyền','Mi Trầm','Dâng lễ','Cộng đoàn'),
  ('Linh hồn tôi ngợi khen Chúa','Phanxicô','Hiệp lễ','Hợp xướng'),
  ('Mẹ Maria đẹp tươi','Hải Linh','Kết lễ','Cộng đoàn')
) AS v(title,composer,liturgical_part,format)
WHERE NOT EXISTS (SELECT 1 FROM hymns);
--> statement-breakpoint
INSERT INTO celebration_hymns (celebration_id,hymn_id,sort_order)
SELECT c.id, h.id, row_number() OVER (ORDER BY h.id)
FROM celebrations c CROSS JOIN hymns h
WHERE c.slug = 'duc-me-vo-nhiem-nguyen-toi-2026'
ON CONFLICT (celebration_id,hymn_id) DO NOTHING;
