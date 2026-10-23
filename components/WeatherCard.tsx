"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Cloud,
    CloudRain,
    CloudSun,
    Sun,
    CloudSnow,
    CloudLightning,
    CloudFog,
    MapPin,
    Droplets,
    Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WeatherResponse } from "@/types/weather";

function getWeatherInfo(code: number): {
    label: string;
    Icon: LucideIcon;
} {
    if (code === 0) {
        return { label: "Clear sky", Icon: Sun };
    }

    if ([1, 2].includes(code)) {
        return { label: "Partly cloudy", Icon: CloudSun };
    }

    if (code === 3) {
        return { label: "Cloudy", Icon: Cloud };
    }

    if ([45, 48].includes(code)) {
        return { label: "Foggy", Icon: CloudFog };
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
        return { label: "Rainy", Icon: CloudRain };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { label: "Snowy", Icon: CloudSnow };
    }

    if ([95, 96, 99].includes(code)) {
        return { label: "Thunderstorm", Icon: CloudLightning };
    }

    return { label: "Unknown", Icon: Cloud };
}

export default function WeatherCard({
    loading = false,
    error = "",
    temp
}: {
    loading?: boolean;
    error?: string;
    temp: WeatherResponse | null
}) {
    // const { temp } = useSelector((state: RootState) => state.weather);

    if (loading) {
        return (
            <Card className="rounded-2xl m-5">
                <CardContent className="space-y-5 p-6">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-20 w-36" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="rounded-2xl m-5">
                <CardContent className="p-6">
                    <p role="alert" className="text-sm text-red-500">
                        {error}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (!temp) {
        return (
            <Card className="rounded-2xl m-5">
                <CardContent className="p-6 text-center">
                    <CloudSun className="mx-auto mb-3 h-12 w-12 text-blue-500" />
                    <p className="text-muted-foreground">
                        Use your current location to see the weather.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const current = temp.current;
    const { label, Icon } = getWeatherInfo(current.weather_code);

    return (
        <Card className="m-5 overflow-hidden rounded-2xl border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="space-y-6 p-6">
                {/* City information */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span>Current Weather</span>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {/* {city || "Your location"} */}
                        </h2>
                    </div>

                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                        Today
                    </span>
                </div>

                {/* Temperature and weather icon */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                            {Math.round(current.temperature_2m)}°
                        </h1>

                        <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-200">
                            {label}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Feels like {Math.round(current.apparent_temperature)}°C
                        </p>
                    </div>

                    <Icon
                        className="h-20 w-20 shrink-0 text-blue-500 sm:h-24 sm:w-24"
                        strokeWidth={1.5}
                    />
                </div>

                {/* Weather details */}
                <div className="grid grid-cols-2 gap-4 border-t border-blue-200/60 pt-5 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Droplets className="h-6 w-6 text-blue-500" />

                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Humidity
                            </p>

                            <p className="font-semibold text-slate-900 dark:text-white">
                                {current.relative_humidity_2m}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Wind className="h-6 w-6 text-blue-500" />

                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Wind Speed
                            </p>

                            <p className="font-semibold text-slate-900 dark:text-white">
                                {Math.round(current.wind_speed_10m)} km/h
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
