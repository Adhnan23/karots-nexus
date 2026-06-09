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
  navCrops: { en: "Crops", si: "බෝග", ta: "பயிர்கள்" },
  navMyPlantings: { en: "My Plantings", si: "මගේ වගාවන්", ta: "எனது பயிர்கள்" },
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
