"use client";
import SearchCity from "@/components/SearchCity";
import WeatherCard from "@/components/WeatherCard";
import { useState, Suspense, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bylocation } from "@/redux/weatherSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { getweatherapi, getcitylatlongapi } from "@/services/weatherApi";


export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");
  const { locationwise } = useSelector((state: RootState) => state.weather);

  const find_city = async (data: string) => {
    const query = data.trim();
    if (loading || query.length < 2) return;

    setLoading(true);
    setError("");
    setCityName("");

    try {
      const location = await getcitylatlongapi(query);
      const city = location.results?.[0];

      if (!city) {
        setError(
          "No city found. Check the spelling or include a country name.",
        );
        return;
      }

      const weather = await getweatherapi(city.latitude, city.longitude);
      dispatch(bylocation(weather));
      setCityName(
        [city.name, city.admin1, city.country].filter(Boolean).join(", "),
      );
    } catch {
      setError("Could not load city weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full flex-1">
      <SearchCity oncitysend={find_city} loading={loading} />
      {cityName && (
        <p className="mx-auto max-w-2xl px-4 pb-4 text-lg font-medium sm:px-6">
          Weather for {cityName}
        </p>
      )}
      <Suspense fallback={<p>Loading city...</p>}><WeatherCard loading={loading} error={error} temp={locationwise} /></Suspense>
    </main>
  );
}
