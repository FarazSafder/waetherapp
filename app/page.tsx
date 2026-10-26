"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcurrentlocation, getweatherapi } from "@/services/weatherApi";
import { getweather, setCurrentLocation } from "@/redux/weatherSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import HomePage from "@/components/Homepage";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { temp, currentLocation } = useSelector((state: RootState) => state.weather);
  const [loading, setLoading] = useState(!temp);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (temp) return;
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const location = await getcurrentlocation(controller.signal);
        const weather = await getweatherapi(location.latitude, location.longitude, controller.signal);
        if (controller.signal.aborted) return;

        dispatch(setCurrentLocation({ city: location.name ?? "", country: location.country ?? "" }));
        dispatch(getweather(weather));
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load weather for your location. Please try again or search for a city.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadWeather();
    return () => controller.abort();
  }, [dispatch, temp, attempt]);

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((value) => value + 1);
  }

  return (
    <HomePage
      temp={temp}
      loading={loading && !temp}
      city={currentLocation?.city}
      country={currentLocation?.country}
      error={error}
      onRetry={retry}
    />
  );
}
