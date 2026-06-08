/**
 * Thin client for the Open-Meteo forecast API (https://open-meteo.com).
 *
 * Free, no API key, JSON over HTTP GET, CC BY 4.0. We request only the fields
 * the platform needs and normalise them into our own shape so the rest of the
 * app never depends on Open-Meteo's response format.
 */

const BASE = "https://api.open-meteo.com/v1/forecast";

/** Normalised "right now" conditions for a coordinate. */
export interface CurrentWeather {
  time: string;
  temperatureC: number;
  humidity: number;
  precipitationMm: number;
  windSpeedKmh: number;
  weatherCode: number;
}

/** One day of the forecast horizon. */
export interface ForecastDay {
  date: string;
  tMaxC: number;
  tMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
}

export interface WeatherBundle {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: ForecastDay[];
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  forecastDays = 7,
): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code",
    timezone: "auto",
    forecast_days: String(forecastDays),
  });

  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as OpenMeteoResponse;

  const daily: ForecastDay[] = data.daily.time.map((date, i) => ({
    date,
    tMaxC: data.daily.temperature_2m_max[i],
    tMinC: data.daily.temperature_2m_min[i],
    precipitationSumMm: data.daily.precipitation_sum[i],
    precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
    weatherCode: data.daily.weather_code[i],
  }));

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperatureC: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitationMm: data.current.precipitation,
      windSpeedKmh: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    daily,
  };
}
