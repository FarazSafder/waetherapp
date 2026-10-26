"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bylocation } from "@/redux/weatherSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { getweatherapi, getcitylatlongapi } from "@/services/weatherApi";

import { SearchIcon, Loader2 } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton
} from "@/components/ui/input-group"

import Searchpage from "@/components/searchpage";

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");
  const { locationwise } = useSelector((state: RootState) => state.weather);

  const handleSearch = async () => {
    if (loading || cityName.length < 2) return;
    setLoading(true);
    setError("");
    setCityName("");
    console.log("Search value:", cityName);
    try {
      const location = await getcitylatlongapi(cityName);
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
    <main className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Find your next forecast
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Search a city postal code to explore the weather.
        </p>
      </div>
      <div className="w-full">
        <InputGroup className="max-w-sm min-w-full py-2.5 rounded-none">
          <InputGroupInput value={cityName} placeholder="Search..." onChange={(e) => setCityName(e.target.value)} />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary" className={`rounded-none`} onClick={handleSearch} disabled={loading}>{(loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : ("Search"))}</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      {/* <Suspense fallback={<p>Loading city...</p>}><WeatherCard loading={loading} error={error} temp={locationwise} /></Suspense> */}
      <Searchpage tempdata={locationwise} loading={loading} error={error} />
    </main>
  );
}
