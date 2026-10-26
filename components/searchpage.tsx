import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Link, LucideIcon, Sun } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { WeatherResponse } from "@/types/weather";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

interface props {
    tempdata: WeatherResponse | null,
    loading: boolean,
    error: string
}

function getWeatherInfo(code: number): {
    label: string;
    Icon: LucideIcon;
} {
    if (code === 0) {
        return { label: "Clear sky", Icon: Sun };
    }

    if ([1, 2].includes(code)) {
        return { label: code === 1 ? "Mainly clear" : "Partly cloudy", Icon: CloudSun };
    }

    if (code === 3) {
        return { label: "Cloudy", Icon: Cloud };
    }

    if ([45, 48].includes(code)) {
        return { label: "Foggy", Icon: CloudFog };
    }

    if ([56, 57, 66, 67].includes(code)) {
        return { label: "Freezing precipitation", Icon: CloudRain };
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
        return { label: "Rainy", Icon: CloudRain };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { label: "Snowy", Icon: CloudSnow };
    }

    if ([95, 96, 97, 99].includes(code)) {
        return { label: "Thunderstorm", Icon: CloudLightning };
    }

    return { label: "Unknown", Icon: Cloud };
}
type Unit = "C" | "F"
type Metric = "temperature" | "rain" | "wind"

function convertTemperature(value: number, unit: Unit) {
    return Math.round(unit === "F" ? value * 1.8 + 32 : value)
}

const panelClass =
    "gap-0 rounded-xl border-zinc-200 bg-white py-0 shadow-none"

function Placeholder({ className }: { className: string }) {
    return (
        <Skeleton
            className={`bg-zinc-100 motion-reduce:animate-none ${className}`}
        />
    )
}

export default function searchpage({ tempdata, loading = false, error }: props) {
    const [unit, setUnit] = useState<Unit>("C")

    const temperature = (value: number | null | undefined) =>
        value == null || !Number.isFinite(value) ? "—" : `${convertTemperature(value, unit)}°`



    if (loading) {
        return <>
            <section>
                <Card
                    className={`${panelClass} border-emerald-100 bg-gradient-to-br from-emerald-50 to-white`}
                >
                    <CardContent className="flex h-full flex-col p-6">
                        <Placeholder className="h-6 w-36" />

                        <div className="my-8 flex items-center justify-between gap-2">
                            <Placeholder className="h-[72px] w-32" />
                            <Placeholder className="size-24 shrink-0 rounded-full" />
                        </div>

                        <div className="mt-auto">
                            <Placeholder className="h-7 w-40" />
                            <Placeholder className="mt-2 h-5 w-28" />
                            <Placeholder className="mt-1 h-5 w-36" />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </>
    }

    if (error) {
        return (
            <section className="mx-auto max-w-2xl space-y-4 p-8 text-center">
                <h1 className="text-2xl font-semibold">Weather unavailable or something wrong</h1>
                <p role={error ? "alert" : "status"}>
                    {error || "We couldn't load weather for your location."}
                </p>
                {/* {onRetry && <Button onClick={onRetry}>Try again</Button>} */}
                {/* <Link href="/getbylocation" className="block underline">Search for a city</Link> */}
            </section>
        )
    }
    if (!tempdata) {
        return (
            <section className="space-y-2 p-8 text-center">
                <h2 className="text-xl font-semibold">
                    Search for a city
                </h2>
                <p className="text-zinc-500">
                    Enter a city name above to see its weather forecast.
                </p>
            </section>
        )
    }
    const { label: condition, Icon: WeatherIcon } = getWeatherInfo(tempdata.current.weather_code)
    return (
        <section>
            <Card
                className={`${panelClass} border-emerald-100 bg-gradient-to-br from-emerald-50 to-white`}
            >
                <CardContent className="flex h-full flex-col p-6">
                    <h2 className="text-base font-semibold">
                        Current weather
                    </h2>

                    <div className="my-8 flex items-center justify-between gap-2">
                        <span className="text-7xl font-semibold tracking-tighter">
                            {temperature(tempdata.current.temperature_2m)}
                        </span>
                        <WeatherIcon
                            aria-hidden="true"
                            className="size-24 shrink-0 text-amber-400"
                            strokeWidth={1.25}
                        />
                    </div>

                    <div className="mt-auto">
                        <h3 className="text-xl font-semibold">
                            {condition}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500">
                            Feels like {temperature(tempdata.current.apparent_temperature)}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            High {temperature(tempdata.daily.temperature_2m_max[0])} · Low {temperature(tempdata.daily.temperature_2m_min[0])}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
