import type { Locale } from "./localized";

/**
 * UI chrome strings (nav, buttons, labels) in all three languages. Domain
 * content (crop names, stage text, etc.) is NOT here — it comes from the API as
 * Localized values. Keep this catalog small.
 */
export const UI = {
  appName: { en: "Karots Nexus", si: "කරොට්ස් නෙක්සස්", ta: "கரோட்ஸ் நெக்ஸஸ்" },
  tagline: {
    en: "Agriculture intelligence for Sri Lanka",
    si: "ශ්‍රී ලංකාව සඳහා කෘෂිකාර්මික බුද්ධිය",
    ta: "இலங்கைக்கான விவசாய நுண்ணறிவு",
  },
  navHome: { en: "Home", si: "මුල් පිටුව", ta: "முகப்பு" },
  navCrops: { en: "Crops", si: "බෝග", ta: "பயிர்கள்" },
  navKnowledge: { en: "Learn", si: "ඉගෙන", ta: "கற்க" },
  navMyPlantings: { en: "My Plantings", si: "මගේ වගාවන්", ta: "எனது பயிர்கள்" },

  // Hub
  district: { en: "District", si: "දිස්ත්‍රික්කය", ta: "மாவட்டம்" },
  selectDistrict: { en: "Select district", si: "දිස්ත්‍රික්කය තෝරන්න", ta: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" },
  explore: { en: "Explore", si: "ගවේෂණය කරන්න", ta: "ஆராயுங்கள்" },
  viewAll: { en: "View all", si: "සියල්ල බලන්න", ta: "அனைத்தையும் காண்க" },

  // Weather
  weather: { en: "Weather", si: "කාලගුණය", ta: "வானிலை" },
  todaysWeather: { en: "Today's weather", si: "අද කාලගුණය", ta: "இன்றைய வானிலை" },
  weatherUnavailable: {
    en: "Weather unavailable right now.",
    si: "කාලගුණ දත්ත දැනට නොමැත.",
    ta: "வானிலை தற்போது கிடைக்கவில்லை.",
  },
  humidity: { en: "Humidity", si: "ආර්ද්‍රතාව", ta: "ஈரப்பதம்" },
  wind: { en: "Wind", si: "සුළඟ", ta: "காற்று" },
  rain: { en: "Rain", si: "වර්ෂාව", ta: "மழை" },
  forecast: { en: "7-day forecast", si: "දින 7 අනාවැකිය", ta: "7 நாள் முன்னறிவிப்பு" },
  farmingRisks: { en: "Farming risks", si: "වගා අවදානම්", ta: "விவசாய அபாயங்கள்" },
  noRisks: {
    en: "No notable weather risks this week.",
    si: "මෙම සතියේ සැලකිය යුතු කාලගුණ අවදානම් නැත.",
    ta: "இந்த வாரம் குறிப்பிடத்தக்க வானிலை அபாயங்கள் இல்லை.",
  },

  // Recommendations
  recommendations: { en: "What to plant", si: "කුමක් වවන්නද", ta: "என்ன நடவு செய்வது" },
  recommendationsSub: {
    en: "Crop picks for your district this month",
    si: "මෙම මාසය සඳහා ඔබේ දිස්ත්‍රික්කයට බෝග තේරීම්",
    ta: "இந்த மாதம் உங்கள் மாவட்டத்திற்கான பயிர் தேர்வுகள்",
  },
  bestToPlantNow: { en: "Best to plant now", si: "දැන් වැවීමට හොඳම", ta: "இப்போது நடவு செய்ய சிறந்தது" },
  highProfit: { en: "High profit", si: "ඉහළ ලාභය", ta: "அதிக லாபம்" },
  lowRisk: { en: "Low risk", si: "අඩු අවදානම", ta: "குறைந்த அபாயம்" },
  noRecommendations: {
    en: "No recommendations for this district yet.",
    si: "මෙම දිස්ත්‍රික්කය සඳහා තවම නිර්දේශ නැත.",
    ta: "இந்த மாவட்டத்திற்கு இன்னும் பரிந்துரைகள் இல்லை.",
  },

  // Prices
  prices: { en: "Market prices", si: "වෙළඳපොළ මිල", ta: "சந்தை விலைகள்" },
  pricesSub: {
    en: "Latest recorded prices (LKR per kg)",
    si: "නවතම වාර්තා වූ මිල (රු. කිලෝවකට)",
    ta: "சமீபத்திய பதிவு செய்யப்பட்ட விலைகள் (ரூபாய்/கிலோ)",
  },
  wholesale: { en: "Wholesale", si: "තොග", ta: "மொத்த" },
  retail: { en: "Retail", si: "සිල්ලර", ta: "சில்லறை" },
  noPrices: {
    en: "No prices recorded yet.",
    si: "තවම මිල වාර්තා කර නැත.",
    ta: "இன்னும் விலைகள் பதிவு செய்யப்படவில்லை.",
  },

  // Knowledge
  knowledge: { en: "Knowledge base", si: "දැනුම් මූලාශ්‍රය", ta: "அறிவுத் தளம்" },
  knowledgeSub: {
    en: "Farming guides and articles",
    si: "වගා මාර්ගෝපදේශ සහ ලිපි",
    ta: "விவசாய வழிகாட்டிகள் மற்றும் கட்டுரைகள்",
  },
  searchPlaceholder: { en: "Search articles…", si: "ලිපි සොයන්න…", ta: "கட்டுரைகளைத் தேடு…" },
  allTopics: { en: "All topics", si: "සියලු මාතෘකා", ta: "அனைத்து தலைப்புகள்" },
  noArticles: {
    en: "No articles found.",
    si: "ලිපි හමු නොවීය.",
    ta: "கட்டுரைகள் எதுவும் இல்லை.",
  },

  // Knowledge category labels
  "cat.crop-guide": { en: "Crop guide", si: "බෝග මාර්ගෝපදේශය", ta: "பயிர் வழிகாட்டி" },
  "cat.technique": { en: "Technique", si: "ක්‍රමවේදය", ta: "நுட்பம்" },
  "cat.soil": { en: "Soil", si: "පස", ta: "மண்" },
  "cat.fertilizer": { en: "Fertilizer", si: "පොහොර", ta: "உரம்" },
  "cat.irrigation": { en: "Irrigation", si: "වාරිමාර්ග", ta: "நீர்ப்பாசனம்" },
  "cat.seasonal": { en: "Seasonal", si: "කන්නය", ta: "பருவகால" },
  "cat.pest": { en: "Pests", si: "පළිබෝධ", ta: "பூச்சிகள்" },
  crops: { en: "Crops", si: "බෝග", ta: "பயிர்கள்" },
  cropsSub: {
    en: "Browse crop guides and growth stages",
    si: "බෝග මාර්ගෝපදේශ සහ වර්ධන අවධීන් බලන්න",
    ta: "பயிர் வழிகாட்டிகள் மற்றும் வளர்ச்சி நிலைகளைக் காண்க",
  },
  myPlantings: { en: "My Plantings", si: "මගේ වගාවන්", ta: "எனது பயிர்கள்" },
  myPlantingsEmpty: {
    en: "You have not added any plantings yet. Open a crop and tap “I planted this”.",
    si: "ඔබ තවම වගාවක් එක් කර නැත. බෝගයක් විවෘත කර “මම මෙය වැවුවා” තට්ටු කරන්න.",
    ta: "நீங்கள் இன்னும் எந்தப் பயிரையும் சேர்க்கவில்லை. ஒரு பயிரைத் திறந்து “நான் இதை நட்டேன்” என்பதைத் தட்டவும்.",
  },
  iPlantedThis: { en: "I planted this", si: "මම මෙය වැවුවා", ta: "நான் இதை நட்டேன்" },
  plantingDate: { en: "Planting date", si: "වැවූ දිනය", ta: "நட்ட தேதி" },
  nicknameOptional: {
    en: "Nickname (optional)",
    si: "අන්වර්ථ නාමය (අත්‍යවශ්‍ය නොවේ)",
    ta: "புனைப்பெயர் (விருப்பம்)",
  },
  save: { en: "Save", si: "සුරකින්න", ta: "சேமி" },
  cancel: { en: "Cancel", si: "අවලංගු කරන්න", ta: "ரத்து செய்" },
  remove: { en: "Remove", si: "ඉවත් කරන්න", ta: "அகற்று" },
  back: { en: "Back", si: "ආපසු", ta: "பின்செல்" },
  viewProgress: { en: "View progress", si: "ප්‍රගතිය බලන්න", ta: "முன்னேற்றத்தைக் காண்க" },
  growthStages: { en: "Growth stages", si: "වර්ධන අවධීන්", ta: "வளர்ச்சி நிலைகள்" },
  diseasesPests: { en: "Diseases & pests", si: "රෝග හා පළිබෝධ", ta: "நோய்கள் & பூச்சிகள்" },
  climate: { en: "Climate", si: "දේශගුණය", ta: "காலநிலை" },
  soil: { en: "Soil", si: "පස", ta: "மண்" },
  farmingGuide: { en: "Farming guide", si: "වගා මාර්ගෝපදේශය", ta: "விவசாய வழிகாட்டி" },
  seasons: { en: "Seasons", si: "කන්න", ta: "பருவங்கள்" },
  waterNeed: { en: "Water need", si: "ජල අවශ්‍යතාව", ta: "நீர் தேவை" },
  currentStage: { en: "Current stage", si: "වත්මන් අවධිය", ta: "தற்போதைய நிலை" },
  dayN: { en: "Day", si: "දිනය", ta: "நாள்" },
  daysToHarvest: { en: "days to harvest", si: "අස්වැන්නට දින", ta: "அறுவடைக்கு நாட்கள்" },
  harvestReady: { en: "Ready to harvest", si: "අස්වනු නෙළීමට සූදානම්", ta: "அறுவடைக்குத் தயார்" },
  loading: { en: "Loading…", si: "පූරණය වෙමින්…", ta: "ஏற்றுகிறது…" },
  offlineNote: {
    en: "Offline — showing saved data",
    si: "අන්තර්ජාලයක් නැත — සුරැකි දත්ත පෙන්වයි",
    ta: "ஆஃப்லைன் — சேமித்த தரவைக் காட்டுகிறது",
  },
} as const;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, locale: Locale): string {
  const entry = UI[key] as Record<Locale, string>;
  return entry[locale] ?? entry.en;
}
