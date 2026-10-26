import { CityLatLongResponse, WeatherResponse } from "@/types/weather";
import axios from "axios";

const weatherClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1/forecast",
  timeout: 5000,
});

const getcitylatlong = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 5000,
});

export const getweatherapi = async (lat: number, lon: number, signal?: AbortSignal) => {
  const response = await weatherClient.get<WeatherResponse>("", {
    signal,
    params: {
      latitude: lat,
      longitude: lon,
      current:
        "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,wind_direction_10m,visibility",
      hourly: "temperature_2m,rain,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max",
      forecast_days: 7,
      timezone: "auto",
    },
  });

  return response.data;
};

export const getcurrentlocation = async (signal?: AbortSignal) => {
  const response = await axios.get("https://ipwho.is/", { timeout: 5000, signal });
  const data = response.data;

  if (!data.success) {
    throw new Error("Could not determine current location.");
  }

  return {
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    name: data.city,
    country: data.country,
  };
}

export const getcitylatlongapi = async (city: string) => {
  const name = city.trim();
  if (name.length < 2) return { results: [] } satisfies CityLatLongResponse;

  const response = await getcitylatlong.get<CityLatLongResponse>("/search", {
    params: {
      name,
      count: 1,
      language: "en",
      format: "json",
    },
  });

  return response.data;
};
