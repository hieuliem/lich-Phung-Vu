DO $$
BEGIN
  ALTER TABLE celebrations ADD COLUMN IF NOT EXISTS event_key text;
  UPDATE celebrations
  SET event_key = regexp_replace(slug, '-[0-9]{4}-[0-9]{2}-[0-9]{2}$', '')
  WHERE event_key IS NULL;
  CREATE INDEX IF NOT EXISTS idx_celebrations_event_key ON celebrations(event_key);
END $$;

