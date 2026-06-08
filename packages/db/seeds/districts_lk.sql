-- All 25 administrative districts of Sri Lanka with approximate centroid
-- coordinates (used for per-district weather lookups) and localized names
-- (en/si/ta). Idempotent: re-running leaves existing rows untouched.
INSERT OR IGNORE INTO districts (id, country, district, local_area, latitude, longitude, created_at) VALUES
  ('lk-colombo','Sri Lanka','{"en":"Colombo","si":"කොළඹ","ta":"கொழும்பு"}',NULL,6.9271,79.8612,strftime('%s','now')),
  ('lk-gampaha','Sri Lanka','{"en":"Gampaha","si":"ගම්පහ","ta":"கம்பஹா"}',NULL,7.0917,79.9999,strftime('%s','now')),
  ('lk-kalutara','Sri Lanka','{"en":"Kalutara","si":"කළුතර","ta":"களுத்துறை"}',NULL,6.5854,79.9607,strftime('%s','now')),
  ('lk-kandy','Sri Lanka','{"en":"Kandy","si":"මහනුවර","ta":"கண்டி"}',NULL,7.2906,80.6337,strftime('%s','now')),
  ('lk-matale','Sri Lanka','{"en":"Matale","si":"මාතලේ","ta":"மாத்தளை"}',NULL,7.4675,80.6234,strftime('%s','now')),
  ('lk-nuwara-eliya','Sri Lanka','{"en":"Nuwara Eliya","si":"නුවරඑළිය","ta":"நுவரெலியா"}',NULL,6.9497,80.7891,strftime('%s','now')),
  ('lk-galle','Sri Lanka','{"en":"Galle","si":"ගාල්ල","ta":"காலி"}',NULL,6.0535,80.2210,strftime('%s','now')),
  ('lk-matara','Sri Lanka','{"en":"Matara","si":"මාතර","ta":"மாத்தறை"}',NULL,5.9549,80.5550,strftime('%s','now')),
  ('lk-hambantota','Sri Lanka','{"en":"Hambantota","si":"හම්බන්තොට","ta":"அம்பாந்தோட்டை"}',NULL,6.1240,81.1185,strftime('%s','now')),
  ('lk-jaffna','Sri Lanka','{"en":"Jaffna","si":"යාපනය","ta":"யாழ்ப்பாணம்"}',NULL,9.6615,80.0255,strftime('%s','now')),
  ('lk-kilinochchi','Sri Lanka','{"en":"Kilinochchi","si":"කිලිනොච්චිය","ta":"கிளிநொச்சி"}',NULL,9.3803,80.3770,strftime('%s','now')),
  ('lk-mannar','Sri Lanka','{"en":"Mannar","si":"මන්නාරම","ta":"மன்னார்"}',NULL,8.9810,79.9044,strftime('%s','now')),
  ('lk-vavuniya','Sri Lanka','{"en":"Vavuniya","si":"වවුනියාව","ta":"வவுனியா"}',NULL,8.7514,80.4971,strftime('%s','now')),
  ('lk-mullaitivu','Sri Lanka','{"en":"Mullaitivu","si":"මුලතිව්","ta":"முல்லைத்தீவு"}',NULL,9.2671,80.8142,strftime('%s','now')),
  ('lk-batticaloa','Sri Lanka','{"en":"Batticaloa","si":"මඩකලපුව","ta":"மட்டக்களப்பு"}',NULL,7.7170,81.7000,strftime('%s','now')),
  ('lk-ampara','Sri Lanka','{"en":"Ampara","si":"අම්පාර","ta":"அம்பாறை"}',NULL,7.2912,81.6724,strftime('%s','now')),
  ('lk-trincomalee','Sri Lanka','{"en":"Trincomalee","si":"ත්‍රිකුණාමලය","ta":"திருகோணமலை"}',NULL,8.5874,81.2152,strftime('%s','now')),
  ('lk-kurunegala','Sri Lanka','{"en":"Kurunegala","si":"කුරුණෑගල","ta":"குருணாகல்"}',NULL,7.4863,80.3623,strftime('%s','now')),
  ('lk-puttalam','Sri Lanka','{"en":"Puttalam","si":"පුත්තලම","ta":"புத்தளம்"}',NULL,8.0362,79.8283,strftime('%s','now')),
  ('lk-anuradhapura','Sri Lanka','{"en":"Anuradhapura","si":"අනුරාධපුරය","ta":"அனுராதபுரம்"}',NULL,8.3114,80.4037,strftime('%s','now')),
  ('lk-polonnaruwa','Sri Lanka','{"en":"Polonnaruwa","si":"පොළොන්නරුව","ta":"பொலன்னறுவை"}',NULL,7.9403,81.0188,strftime('%s','now')),
  ('lk-badulla','Sri Lanka','{"en":"Badulla","si":"බදුල්ල","ta":"பதுளை"}',NULL,6.9934,81.0550,strftime('%s','now')),
  ('lk-monaragala','Sri Lanka','{"en":"Monaragala","si":"මොණරාගල","ta":"மொணராகலை"}',NULL,6.8728,81.3510,strftime('%s','now')),
  ('lk-ratnapura','Sri Lanka','{"en":"Ratnapura","si":"රත්නපුර","ta":"இரத்தினபுரி"}',NULL,6.6828,80.3992,strftime('%s','now')),
  ('lk-kegalle','Sri Lanka','{"en":"Kegalle","si":"කෑගල්ල","ta":"கேகாலை"}',NULL,7.2513,80.3464,strftime('%s','now'));
