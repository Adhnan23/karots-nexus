/**
 * Map a WMO weather code (as returned by Open-Meteo) to an emoji for a quick,
 * language-neutral visual. Grouped by the documented code ranges.
 */
export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️"; // clear
  if (code <= 2) return "🌤️"; // mainly clear / partly cloudy
  if (code === 3) return "☁️"; // overcast
  if (code <= 48) return "🌫️"; // fog
  if (code <= 57) return "🌦️"; // drizzle
  if (code <= 67) return "🌧️"; // rain
  if (code <= 77) return "🌨️"; // snow
  if (code <= 82) return "🌧️"; // rain showers
  if (code <= 86) return "🌨️"; // snow showers
  return "⛈️"; // thunderstorm (95+)
}
