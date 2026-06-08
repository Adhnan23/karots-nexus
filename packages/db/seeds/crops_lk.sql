-- Starter crop catalog for Sri Lanka: 5 common crops with localized names
-- (en/si/ta) and growth-stage timelines (day offsets from planting). Stage
-- descriptions are left NULL for an admin/native speaker to fill in.
-- Idempotent via INSERT OR IGNORE on stable ids.

INSERT OR IGNORE INTO crops (id, name, category, cultivation_duration_days, created_at) VALUES
  ('crop-paddy','{"en":"Paddy (Rice)","si":"වී","ta":"நெல்"}','{"en":"Cereal","si":"ධාන්‍ය","ta":"தானியம்"}',120,strftime('%s','now')),
  ('crop-chilli','{"en":"Chilli","si":"මිරිස්","ta":"மிளகாய்"}','{"en":"Vegetable","si":"එළවළු","ta":"காய்கறி"}',120,strftime('%s','now')),
  ('crop-tomato','{"en":"Tomato","si":"තක්කාලි","ta":"தக்காளி"}','{"en":"Vegetable","si":"එළවළු","ta":"காய்கறி"}',95,strftime('%s','now')),
  ('crop-big-onion','{"en":"Big Onion","si":"ලොකු ලූණු","ta":"பெரிய வெங்காயம்"}','{"en":"Vegetable","si":"එළවළු","ta":"காய்கறி"}',90,strftime('%s','now')),
  ('crop-brinjal','{"en":"Brinjal","si":"වම්බටු","ta":"கத்தரிக்காய்"}','{"en":"Vegetable","si":"එළවළු","ta":"காய்கறி"}',100,strftime('%s','now'));

INSERT OR IGNORE INTO crop_stages (id, crop_id, name, start_day, end_day, description, sort_order) VALUES
  -- Paddy
  ('stg-paddy-1','crop-paddy','{"en":"Germination","si":"පැළවීම","ta":"முளைத்தல்"}',0,10,NULL,1),
  ('stg-paddy-2','crop-paddy','{"en":"Tillering","si":"අතු හටගැනීම","ta":"கிளைத்தல்"}',11,45,NULL,2),
  ('stg-paddy-3','crop-paddy','{"en":"Panicle / Flowering","si":"කරල් හටගැනීම","ta":"பூக்கும் நிலை"}',46,75,NULL,3),
  ('stg-paddy-4','crop-paddy','{"en":"Grain Filling","si":"ධාන්‍ය පිරවීම","ta":"தானிய நிரப்புதல்"}',76,105,NULL,4),
  ('stg-paddy-5','crop-paddy','{"en":"Maturity & Harvest","si":"මේරීම හා අස්වැන්න","ta":"முதிர்ச்சி மற்றும் அறுவடை"}',106,120,NULL,5),
  -- Chilli
  ('stg-chilli-1','crop-chilli','{"en":"Germination","si":"පැළවීම","ta":"முளைத்தல்"}',0,10,NULL,1),
  ('stg-chilli-2','crop-chilli','{"en":"Vegetative","si":"වර්ධන අවධිය","ta":"வளர்ச்சி நிலை"}',11,45,NULL,2),
  ('stg-chilli-3','crop-chilli','{"en":"Flowering","si":"මල් හටගැනීම","ta":"பூக்கும் நிலை"}',46,75,NULL,3),
  ('stg-chilli-4','crop-chilli','{"en":"Fruiting","si":"ඵල හටගැනීම","ta":"காய்க்கும் நிலை"}',76,110,NULL,4),
  ('stg-chilli-5','crop-chilli','{"en":"Harvest","si":"අස්වැන්න","ta":"அறுவடை"}',111,120,NULL,5),
  -- Tomato
  ('stg-tomato-1','crop-tomato','{"en":"Germination","si":"පැළවීම","ta":"முளைத்தல்"}',0,8,NULL,1),
  ('stg-tomato-2','crop-tomato','{"en":"Vegetative","si":"වර්ධන අවධිය","ta":"வளர்ச்சி நிலை"}',9,35,NULL,2),
  ('stg-tomato-3','crop-tomato','{"en":"Flowering","si":"මල් හටගැනීම","ta":"பூக்கும் நிலை"}',36,55,NULL,3),
  ('stg-tomato-4','crop-tomato','{"en":"Fruiting","si":"ඵල හටගැනීම","ta":"காய்க்கும் நிலை"}',56,85,NULL,4),
  ('stg-tomato-5','crop-tomato','{"en":"Harvest","si":"අස්වැන්න","ta":"அறுவடை"}',86,95,NULL,5),
  -- Big Onion
  ('stg-bonion-1','crop-big-onion','{"en":"Germination","si":"පැළවීම","ta":"முளைத்தல்"}',0,10,NULL,1),
  ('stg-bonion-2','crop-big-onion','{"en":"Vegetative","si":"වර්ධන අවධිය","ta":"வளர்ச்சி நிலை"}',11,45,NULL,2),
  ('stg-bonion-3','crop-big-onion','{"en":"Bulb Formation","si":"බල්බ හටගැනීම","ta":"கிழங்கு உருவாதல்"}',46,75,NULL,3),
  ('stg-bonion-4','crop-big-onion','{"en":"Maturity & Harvest","si":"මේරීම හා අස්වැන්න","ta":"முதிர்ச்சி மற்றும் அறுவடை"}',76,90,NULL,4),
  -- Brinjal
  ('stg-brinjal-1','crop-brinjal','{"en":"Germination","si":"පැළවීම","ta":"முளைத்தல்"}',0,10,NULL,1),
  ('stg-brinjal-2','crop-brinjal','{"en":"Vegetative","si":"වර්ධන අවධිය","ta":"வளர்ச்சி நிலை"}',11,40,NULL,2),
  ('stg-brinjal-3','crop-brinjal','{"en":"Flowering","si":"මල් හටගැනීම","ta":"பூக்கும் நிலை"}',41,65,NULL,3),
  ('stg-brinjal-4','crop-brinjal','{"en":"Fruiting","si":"ඵල හටගැනීම","ta":"காய்க்கும் நிலை"}',66,90,NULL,4),
  ('stg-brinjal-5','crop-brinjal','{"en":"Harvest","si":"අස්වැන්න","ta":"அறுவடை"}',91,100,NULL,5);
