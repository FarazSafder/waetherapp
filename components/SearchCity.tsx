"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, type SubmitEvent } from "react";

interface SearchCityProps {
  oncitysend: (data: string) => void | Promise<void>;
  loading?: boolean;
}

export default function SearchCity({
  oncitysend,
  loading = false,
}: SearchCityProps) {
  const [city, setCity] = useState<string>("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.trim();
    if (loading || query.length < 2) return;
    void oncitysend(query);
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6">
      {/* <h1 className="text-2xl font-semibold tracking-tight">Search city</h1> */}

      <form
        role="search"
        aria-label="City search"
        className="relative"
        onSubmit={handleSubmit}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          name="city"
          aria-label="City name"
          placeholder="Search for a city..."
          autoComplete="address-level2"
          className="h-12 rounded-xl border-border bg-background pr-32 pl-10"
          required
          minLength={2}
          disabled={loading}
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
        <Button
          type="submit"
          className="absolute top-1/2 right-1.5 -translate-y-0.5 rounded-lg"
          disabled={loading || city.trim().length < 2}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
    </section>
  );
}
