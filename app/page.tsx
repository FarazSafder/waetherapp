"use client";

import { useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import WeatherCard from "@/components/WeatherCard";
import { getcurrentlocation, getweatherapi } from "@/services/weatherApi";
import { getweather } from "@/redux/weatherSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { clearweather } from "@/redux/weatherSlice"

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather.temp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { temp } = useSelector((state: RootState) => state.weather);

  async function loadWeather() {
    if (weather || loading) return;

    setLoading(true);
    setError("");

    try {
      const { latitude, longitude } = await getcurrentlocation();
      const data = await getweatherapi(latitude, longitude);
      dispatch(getweather(data));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not fetch weather. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="text-center">

      <div className="flex gap-2.5 justify-center">
        <Button onClick={loadWeather} disabled={loading} variant="default">
          Get weather for my location
        </Button>
        <Button onClick={() => dispatch(clearweather())} disabled={loading} variant="default">
          clear State
        </Button>
      </div>

      <Suspense fallback={<p>Loading city...</p>}><WeatherCard loading={loading} error={error} temp={temp} /></Suspense>
    </main>
  );
}
