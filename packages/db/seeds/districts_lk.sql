-- All 25 administrative districts of Sri Lanka with approximate centroid
-- coordinates (used for per-district weather lookups). Idempotent: re-running
-- leaves existing rows untouched.
INSERT OR IGNORE INTO districts (id, country, district, local_area, latitude, longitude, created_at) VALUES
  ('lk-colombo','Sri Lanka','Colombo',NULL,6.9271,79.8612,strftime('%s','now')),
  ('lk-gampaha','Sri Lanka','Gampaha',NULL,7.0917,79.9999,strftime('%s','now')),
  ('lk-kalutara','Sri Lanka','Kalutara',NULL,6.5854,79.9607,strftime('%s','now')),
  ('lk-kandy','Sri Lanka','Kandy',NULL,7.2906,80.6337,strftime('%s','now')),
  ('lk-matale','Sri Lanka','Matale',NULL,7.4675,80.6234,strftime('%s','now')),
  ('lk-nuwara-eliya','Sri Lanka','Nuwara Eliya',NULL,6.9497,80.7891,strftime('%s','now')),
  ('lk-galle','Sri Lanka','Galle',NULL,6.0535,80.2210,strftime('%s','now')),
  ('lk-matara','Sri Lanka','Matara',NULL,5.9549,80.5550,strftime('%s','now')),
  ('lk-hambantota','Sri Lanka','Hambantota',NULL,6.1240,81.1185,strftime('%s','now')),
  ('lk-jaffna','Sri Lanka','Jaffna',NULL,9.6615,80.0255,strftime('%s','now')),
  ('lk-kilinochchi','Sri Lanka','Kilinochchi',NULL,9.3803,80.3770,strftime('%s','now')),
  ('lk-mannar','Sri Lanka','Mannar',NULL,8.9810,79.9044,strftime('%s','now')),
  ('lk-vavuniya','Sri Lanka','Vavuniya',NULL,8.7514,80.4971,strftime('%s','now')),
  ('lk-mullaitivu','Sri Lanka','Mullaitivu',NULL,9.2671,80.8142,strftime('%s','now')),
  ('lk-batticaloa','Sri Lanka','Batticaloa',NULL,7.7170,81.7000,strftime('%s','now')),
  ('lk-ampara','Sri Lanka','Ampara',NULL,7.2912,81.6724,strftime('%s','now')),
  ('lk-trincomalee','Sri Lanka','Trincomalee',NULL,8.5874,81.2152,strftime('%s','now')),
  ('lk-kurunegala','Sri Lanka','Kurunegala',NULL,7.4863,80.3623,strftime('%s','now')),
  ('lk-puttalam','Sri Lanka','Puttalam',NULL,8.0362,79.8283,strftime('%s','now')),
  ('lk-anuradhapura','Sri Lanka','Anuradhapura',NULL,8.3114,80.4037,strftime('%s','now')),
  ('lk-polonnaruwa','Sri Lanka','Polonnaruwa',NULL,7.9403,81.0188,strftime('%s','now')),
  ('lk-badulla','Sri Lanka','Badulla',NULL,6.9934,81.0550,strftime('%s','now')),
  ('lk-monaragala','Sri Lanka','Monaragala',NULL,6.8728,81.3510,strftime('%s','now')),
  ('lk-ratnapura','Sri Lanka','Ratnapura',NULL,6.6828,80.3992,strftime('%s','now')),
  ('lk-kegalle','Sri Lanka','Kegalle',NULL,7.2513,80.3464,strftime('%s','now'));
