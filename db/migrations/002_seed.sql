-- Seed riders
INSERT INTO rider (full_name, phone, email) VALUES
  ('Alice Rider','0712345678','alice@example.com'),
  ('Ben Turner',NULL,'ben@example.com')
ON CONFLICT DO NOTHING;

-- Seed horses
INSERT INTO horse (name, owner_name) VALUES
  ('Thunder','Alice Rider'),
  ('Blaze','Ben Turner')
ON CONFLICT DO NOTHING;

-- Seed classes
INSERT INTO class (name, category, max_entries) VALUES
  ('Show Jumping','Junior', 2),
  ('Dressage','Senior', 3)
ON CONFLICT DO NOTHING;
