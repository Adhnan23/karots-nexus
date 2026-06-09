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

-- Enrich the seeded crops with agronomy used by the decision engine (seasons,
-- sow months, suitable districts, water need, yield) and localized display notes
-- (climate, soil, step-by-step guide). Idempotent UPDATEs so re-seeding refreshes
-- these without duplicating rows. Sri Lanka seasons: Maha (NE monsoon) + Yala (SW
-- monsoon). si/ta are best-effort — have an agronomist / native speaker review.

UPDATE crops SET
  seasons = '["maha","yala"]',
  planting_months = '[4,5,10,11]',
  suitable_districts = '["lk-anuradhapura","lk-polonnaruwa","lk-kurunegala","lk-ampara","lk-hambantota","lk-batticaloa"]',
  water_requirement = 'high',
  expected_yield_kg_per_acre = 1800,
  climate = '{"en":"Warm lowland tropics; needs assured water through the season.","si":"උණුසුම් පහත්බිම් කලාපය; සමස්ත කන්නය පුරා ජලය අවශ්‍යයි.","ta":"வெப்பமான தாழ்நில வெப்பமண்டலம்; பருவம் முழுவதும் நீர் தேவை."}',
  soil = '{"en":"Heavy clay or clay-loam that holds water well.","si":"ජලය හොඳින් රඳවා ගන්නා බර මැටි හෝ මැටි-ලෝම් පස.","ta":"நீரை நன்கு தாங்கும் களிமண் அல்லது களிமண்-வண்டல் மண்."}',
  guide = '[{"title":{"en":"Land preparation","si":"ඉඩම් සැකසීම","ta":"நிலம் தயாரித்தல்"},"body":{"en":"Plough and puddle the field, then level it before sowing.","si":"කුඹුර සී සෑ කර මඩ ගසා, වපුරීමට පෙර සමතලා කරන්න.","ta":"வயலை உழுது சேறாக்கி, விதைப்பதற்கு முன் சமன் செய்யவும்."}},{"title":{"en":"Sowing","si":"වැපිරීම","ta":"விதைப்பு"},"body":{"en":"Sow certified seed paddy or transplant healthy seedlings at recommended spacing.","si":"සහතික කළ වී බීජ වපුරන්න හෝ නිරෝගී පැළ නිර්දේශිත පරතරයකින් සිටුවන්න.","ta":"சான்றளிக்கப்பட்ட நெல் விதைகளை விதைக்கவும் அல்லது ஆரோக்கியமான நாற்றுகளை பரிந்துரைத்த இடைவெளியில் நடவும்."}},{"title":{"en":"Water and nutrients","si":"ජලය හා පෝෂණය","ta":"நீர் மற்றும் ஊட்டச்சத்து"},"body":{"en":"Keep shallow standing water and apply nitrogen in splits; weed early.","si":"නොගැඹුරු ජලය පවත්වා ගෙන නයිට්‍රජන් කොටස් වශයෙන් යොදන්න; කල් ඇතිව වල් මර්දනය කරන්න.","ta":"ஆழமற்ற நீரை வைத்திருந்து நைட்ரஜனை பகுதிபகுதியாக இடவும்; களைகளை முன்கூட்டியே அகற்றவும்."}}]'
WHERE id = 'crop-paddy';

UPDATE crops SET
  seasons = '["maha","yala"]',
  planting_months = '[4,5,9,10]',
  suitable_districts = '["lk-anuradhapura","lk-kurunegala","lk-monaragala","lk-hambantota"]',
  water_requirement = 'medium',
  expected_yield_kg_per_acre = 1200,
  climate = '{"en":"Warm, fairly dry conditions; sensitive to waterlogging.","si":"උණුසුම්, තරමක් වියළි කාලගුණය; ජලය එකතැන් වීමට සංවේදීයි.","ta":"வெப்பமான, ஓரளவு வறண்ட சூழல்; நீர் தேக்கத்திற்கு உணர்திறன்."}',
  soil = '{"en":"Well-drained sandy loam rich in organic matter.","si":"කාබනික ද්‍රව්‍ය බහුල, හොඳින් ජලය බැස යන වැලි-ලෝම් පස.","ta":"கரிமப் பொருள் நிறைந்த, நீர் வடியும் மணல்-வண்டல் மண்."}',
  guide = '[{"title":{"en":"Raise seedlings","si":"පැළ නිෂ්පාදනය","ta":"நாற்று வளர்த்தல்"},"body":{"en":"Grow seedlings in a nursery for 4-5 weeks before transplanting.","si":"සිටුවීමට පෙර සති 4-5ක් තවානක පැළ වවන්න.","ta":"நடவு செய்வதற்கு முன் 4-5 வாரங்கள் நாற்றங்காலில் நாற்று வளர்க்கவும்."}},{"title":{"en":"Transplant","si":"සිටුවීම","ta":"நடவு"},"body":{"en":"Transplant onto raised beds with good spacing for airflow.","si":"වාතාශ්‍රය සඳහා හොඳ පරතරයක් සහිතව උස් පාත්තිවල සිටුවන්න.","ta":"காற்றோட்டத்திற்காக நல்ல இடைவெளியுடன் உயர்த்திய பாத்திகளில் நடவும்."}},{"title":{"en":"Protect and feed","si":"ආරක්ෂාව හා පෝෂණය","ta":"பாதுகாப்பு மற்றும் ஊட்டம்"},"body":{"en":"Scout for thrips and anthracnose; mulch and feed regularly.","si":"ත්‍රිප්ස් හා ඇන්ත්‍රැක්නෝස් සඳහා නිරීක්ෂණය කරන්න; වසුන් යොදා නිතිපතා පොහොර දෙන්න.","ta":"த்ரிப்ஸ் மற்றும் அந்த்ராக்னோஸை கண்காணிக்கவும்; மூடாக்கிட்டு தவறாமல் ஊட்டமளிக்கவும்."}}]'
WHERE id = 'crop-chilli';

UPDATE crops SET
  seasons = '["maha","yala"]',
  planting_months = '[1,2,3,4,5,6,7,8,9,10,11,12]',
  suitable_districts = '["lk-nuwara-eliya","lk-badulla","lk-matale","lk-kandy"]',
  water_requirement = 'medium',
  expected_yield_kg_per_acre = 6000,
  climate = '{"en":"Mild to warm; upcountry areas suit year-round cultivation.","si":"මෘදු සිට උණුසුම්; උඩරට ප්‍රදේශ වසර පුරා වගාවට සුදුසුයි.","ta":"மிதமான முதல் வெப்பம்; மலைநாட்டுப் பகுதிகள் ஆண்டு முழுவதும் சாகுபடிக்கு ஏற்றது."}',
  soil = '{"en":"Fertile well-drained loam, slightly acidic.","si":"සරුසාර, හොඳින් ජලය බැස යන, මඳක් ආම්ලික ලෝම් පස.","ta":"வளமான, நீர் வடியும், சற்று அமிலத்தன்மை கொண்ட வண்டல் மண்."}',
  guide = '[{"title":{"en":"Raise seedlings","si":"පැළ නිෂ්පාදනය","ta":"நாற்று வளர்த்தல்"},"body":{"en":"Start seeds in trays and transplant after 3-4 weeks.","si":"බීජ ට්‍රේවල පටන් ගෙන සති 3-4කින් සිටුවන්න.","ta":"விதைகளை தட்டுகளில் தொடங்கி 3-4 வாரங்களில் நடவும்."}},{"title":{"en":"Stake and prune","si":"උඩුකුරු කිරීම හා කප්පාදුව","ta":"ஊன்றுகோல் மற்றும் கிளை நீக்கம்"},"body":{"en":"Support plants with stakes and remove side shoots.","si":"උල්වලින් පැළවලට ආධාර දී පැති දළු ඉවත් කරන්න.","ta":"செடிகளை ஊன்றுகோல்களால் தாங்கி பக்க தளிர்களை அகற்றவும்."}},{"title":{"en":"Water and guard","si":"ජලය හා ආරක්ෂාව","ta":"நீர் மற்றும் பாதுகாப்பு"},"body":{"en":"Irrigate evenly and watch for whitefly and early blight.","si":"ඒකාකාරව ජලය දී සුදු මැස්සා හා මුල් අංගමාරය ගැන විමසිලිමත් වන්න.","ta":"சீராக நீர்ப்பாய்ச்சி, வெள்ளை ஈ மற்றும் முன் கருகலை கவனிக்கவும்."}}]'
WHERE id = 'crop-tomato';

UPDATE crops SET
  seasons = '["yala"]',
  planting_months = '[4,5,6]',
  suitable_districts = '["lk-matale","lk-anuradhapura","lk-jaffna","lk-puttalam"]',
  water_requirement = 'medium',
  expected_yield_kg_per_acre = 5000,
  climate = '{"en":"Hot dry-zone weather with low rainfall during bulbing.","si":"බල්බ හටගැනීමේදී අඩු වර්ෂාපතනයක් සහිත උණුසුම් වියළි කලාපීය කාලගුණය.","ta":"கிழங்கு உருவாகும் போது குறைந்த மழையுடன் கூடிய வெப்பமான வறண்ட மண்டல வானிலை."}',
  soil = '{"en":"Well-drained sandy loam with good fertility.","si":"හොඳ සරුභාවයක් සහිත, ජලය බැස යන වැලි-ලෝම් පස.","ta":"நல்ல வளமுள்ள, நீர் வடியும் மணல்-வண்டல் மண்."}',
  guide = '[{"title":{"en":"Prepare beds","si":"පාත්ති සැකසීම","ta":"பாத்திகள் தயாரித்தல்"},"body":{"en":"Form raised beds and add well-rotted organic manure.","si":"උස් පාත්ති සාදා හොඳින් දිරාපත් කාබනික පොහොර එක් කරන්න.","ta":"உயர்த்திய பாத்திகளை அமைத்து நன்கு மக்கிய கரிம உரம் சேர்க்கவும்."}},{"title":{"en":"Plant sets","si":"බීජ ලූණු සිටුවීම","ta":"விதை வெங்காயம் நடவு"},"body":{"en":"Plant onion sets or seedlings at close spacing.","si":"බීජ ලූණු හෝ පැළ සමීප පරතරයකින් සිටුවන්න.","ta":"வெங்காய விதை அல்லது நாற்றுகளை நெருக்கமான இடைவெளியில் நடவும்."}},{"title":{"en":"Manage water","si":"ජල කළමනාකරණය","ta":"நீர் மேலாண்மை"},"body":{"en":"Irrigate regularly but stop before harvest to cure bulbs.","si":"නිතිපතා ජලය දෙන්න, නමුත් බල්බ සුව කිරීමට අස්වැන්නට පෙර නවත්වන්න.","ta":"தவறாமல் நீர்ப்பாய்ச்சவும், ஆனால் கிழங்குகளை பதப்படுத்த அறுவடைக்கு முன் நிறுத்தவும்."}}]'
WHERE id = 'crop-big-onion';

UPDATE crops SET
  seasons = '["maha","yala"]',
  planting_months = '[1,2,3,4,5,6,7,8,9,10,11,12]',
  suitable_districts = '[]',
  water_requirement = 'medium',
  expected_yield_kg_per_acre = 7000,
  climate = '{"en":"Warm tropical conditions; tolerant and long-bearing.","si":"උණුසුම් නිවර්තන කාලගුණය; ඔරොත්තු දෙන, දිගු කලක් අස්වනු දෙන.","ta":"வெப்பமண்டல சூழல்; தாங்கக்கூடிய, நீண்ட காலம் காய்க்கும்."}',
  soil = '{"en":"Deep fertile loam with good drainage.","si":"හොඳ ජල වහනයක් සහිත ගැඹුරු සරුසාර ලෝම් පස.","ta":"நல்ல வடிகால் கொண்ட ஆழமான வளமான வண்டல் மண்."}',
  guide = '[{"title":{"en":"Raise seedlings","si":"පැළ නිෂ්පාදනය","ta":"நாற்று வளர்த்தல்"},"body":{"en":"Grow seedlings for about 4 weeks before transplanting.","si":"සිටුවීමට පෙර සති 4ක් පමණ පැළ වවන්න.","ta":"நடவு செய்வதற்கு முன் சுமார் 4 வாரங்கள் நாற்று வளர்க்கவும்."}},{"title":{"en":"Transplant","si":"සිටුවීම","ta":"நடவு"},"body":{"en":"Transplant onto ridges with wide spacing.","si":"පුළුල් පරතරයක් සහිතව නෙරිවල සිටුවන්න.","ta":"அகலமான இடைவெளியுடன் வரப்புகளில் நடவும்."}},{"title":{"en":"Train and protect","si":"හික්මවීම හා ආරක්ෂාව","ta":"பராமரிப்பு மற்றும் பாதுகாப்பு"},"body":{"en":"Stake plants and control shoot and fruit borer promptly.","si":"පැළ උඩුකුරු කර දළු හා ගෙඩි විදින පණුවා වහාම පාලනය කරන්න.","ta":"செடிகளை ஊன்றி, தளிர் மற்றும் காய் துளைப்பானை உடனடியாக கட்டுப்படுத்தவும்."}}]'
WHERE id = 'crop-brinjal';
