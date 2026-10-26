"use client"

import { useId, useState } from "react"
import Link from "next/link"
import {
    Cloud,
    CloudRain,
    CloudSun,
    CloudFog,
    CloudSnow,
    CloudLightning,
    Droplets,
    Eye,
    Search,
    Sun,
    Wind,
    type LucideIcon,
} from "lucide-react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { WeatherResponse } from "@/types/weather"
import HomePageSkeleton from "./homepage-skeleton"

type Unit = "C" | "F"
type Metric = "temperature" | "rain" | "wind"

const metricOptions: { key: Metric; label: string }[] = [
    { key: "temperature", label: "Temperature" },
    { key: "rain", label: "Rain" },
    { key: "wind", label: "Wind" },
]

const chartConfig = {
    temperature: {
        label: "Temperature",
        color: "#10b981",
    },
    rain: {
        label: "Rainfall",
        color: "#3b82f6",
    },
    wind: {
        label: "Wind speed",
        color: "#8b5cf6",
    },
} satisfies ChartConfig

const panelClass =
    "gap-0 rounded-xl border-zinc-200 bg-white py-0 shadow-none"

function convertTemperature(value: number, unit: Unit) {
    return Math.round(unit === "F" ? value * 1.8 + 32 : value)
}

function formatForecastDate(date: string, weekdayOnly = false) {
    // Keep the API's local calendar date independent of the browser's timezone.
    return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
        timeZone: "UTC",
        weekday: weekdayOnly ? "short" : "long",
        ...(weekdayOnly ? {} : { month: "long", day: "numeric" } as const),
    })
}

function MetricCard({
    icon: Icon,
    label,
    value,
    description,
}: {
    icon: LucideIcon
    label: string
    value: string
    description: string
}) {
    return (
        <Card className={panelClass}>
            <CardContent className="flex items-start gap-4 p-5">
                <Icon
                    aria-hidden="true"
                    className="mt-1 size-7 shrink-0 text-zinc-400"
                    strokeWidth={1.5}
                />

                <div>
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
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

function getWindDirection(degrees?: number | null): string {
    if (degrees == null || !Number.isFinite(degrees)) {
        return "Unavailable"
    }

    const directions = [
        "North",
        "Northeast",
        "East",
        "Southeast",
        "South",
        "Southwest",
        "West",
        "Northwest",
    ]

    const normalized = ((degrees % 360) + 360) % 360
    const index = Math.round(normalized / 45) % 8

    return directions[index]!
}

interface HomePageProps {
    temp: WeatherResponse | null
    loading?: boolean
    city?: string
    country?: string
    error?: string
    onRetry?: () => void
}

export default function HomePage({ temp, loading = false, city, country, error, onRetry }: HomePageProps) {
    const [unit, setUnit] = useState<Unit>("C")
    const [metric, setMetric] = useState<Metric>("temperature")
    const gradientId = useId().replace(/:/g, "")

    const temperature = (value: number | null | undefined) =>
        value == null || !Number.isFinite(value) ? "—" : `${convertTemperature(value, unit)}°`

    const chartData = temp?.hourly.time.slice(0, 24).map((time, index) => {
        const hour = Number(time.slice(11, 13))
        const hourlyTemperature = temp.hourly.temperature_2m[index]

        return {
            time: `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`,
            temperature: hourlyTemperature == null
                ? null
                : convertTemperature(hourlyTemperature, unit),
            rain: temp.hourly.rain[index] ?? null,
            wind: temp.hourly.wind_speed_10m[index] ?? null,
        }
    }) ?? []

    const suffix =
        metric === "temperature" ? `°${unit}` :
            metric === "rain" ? " mm" : " km/h"

    const chartColor = chartConfig[metric].color

    const forecast = temp?.daily.time.slice(0, 7).map((date, index) => {
        const { label, Icon } = getWeatherInfo(temp.daily.weather_code[index])
        return {
            date,
            day: index === 0 ? "Today" : formatForecastDate(date, true),
            condition: label,
            icon: Icon,
            rain: temp.daily.precipitation_probability_max?.[index],
            low: temp.daily.temperature_2m_min[index],
            high: temp.daily.temperature_2m_max[index],
        }
    }) ?? []

    const lows = forecast.map((day) => day.low).filter((value) => value != null && Number.isFinite(value))
    const highs = forecast.map((day) => day.high).filter((value) => value != null && Number.isFinite(value))
    const weekLow = lows.length ? Math.min(...lows) : 0
    const weekHigh = highs.length ? Math.max(...highs) : 0
    const weekRange = Math.max(weekHigh - weekLow, 1)

    if (loading) {
        return <HomePageSkeleton />
    }

    if (error || !temp) {
        return (
            <main className="mx-auto max-w-2xl space-y-4 p-8 text-center">
                <h1 className="text-2xl font-semibold">Weather unavailable</h1>
                <p role={error ? "alert" : "status"}>
                    {error || "We couldn't load weather for your location."}
                </p>
                {onRetry && <Button onClick={onRetry}>Try again</Button>}
                <Link href="/getbylocation" className="block underline">Search for a city</Link>
            </main>
        )
    }

    const { label: condition, Icon: WeatherIcon } = getWeatherInfo(temp.current.weather_code)
    const forecastDate = temp.current.time || temp.daily.time[0]
    return (<>
        {/* Top bar */}

        <main className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-8">
            {/* Page heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {[city, country].filter(Boolean).join(", ") || "Your location"}
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                        {forecastDate ? formatForecastDate(forecastDate) : "Current forecast"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div role="group" aria-label="Temperature units" className="flex rounded-lg border border-zinc-200 p-1">
                        {(["C", "F"] as const).map((value) => (
                            <Button key={value} variant={unit === value ? "secondary" : "ghost"} size="sm"
                                aria-pressed={unit === value} onClick={() => setUnit(value)}>
                                °{value}
                            </Button>
                        ))}
                    </div>
                <Link
                    href="/getbylocation"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium transition-colors hover:bg-zinc-50"
                >
                    <Search className="size-4" />
                    Search cities
                </Link>
                </div>
            </div>

            {/* Current weather and chart */}
            <section
                aria-label="Current and hourly weather"
                className="grid gap-4 xl:grid-cols-3"
            >
                <Card
                    className={`${panelClass} border-emerald-100 bg-gradient-to-br from-emerald-50 to-white`}
                >
                    <CardContent className="flex h-full flex-col p-6">
                        <h2 className="text-base font-semibold">
                            Current weather
                        </h2>

                        <div className="my-8 flex items-center justify-between gap-2">
                            <span className="text-7xl font-semibold tracking-tighter">
                                {temperature(temp?.current.temperature_2m)}
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
                                Feels like {temperature(temp?.current.apparent_temperature)}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                High {temperature(temp.daily.temperature_2m_max[0])} · Low {temperature(temp.daily.temperature_2m_min[0])}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`${panelClass} min-w-0 xl:col-span-2`}>
                    <CardContent className="p-5">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-base font-semibold">
                                Today&apos;s hourly forecast
                            </h2>

                            <div
                                role="group"
                                aria-label="Forecast metric"
                                className="flex rounded-lg border border-zinc-200 p-1"
                            >
                                {metricOptions.map((option) => (
                                    <Button
                                        key={option.key}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        aria-pressed={metric === option.key}
                                        onClick={() => setMetric(option.key)}
                                        className={`h-7 px-2 text-xs sm:px-3 ${metric === option.key
                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "text-zinc-500"
                                            }`}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <ChartContainer
                            config={chartConfig}
                            className="h-[250px] w-full aspect-auto"
                            aria-label={`Hourly ${chartConfig[metric].label}`}
                        >
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{ top: 20, right: 16, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient
                                        id={gradientId}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={chartColor}
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={chartColor}
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid vertical={false} />

                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={12}
                                    minTickGap={20}
                                />

                                <YAxis
                                    width={48}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={8}
                                    domain={
                                        metric === "temperature"
                                            ? ["dataMin - 4", "dataMax + 4"]
                                            : [0, "auto"]
                                    }
                                    tickFormatter={(value: number) =>
                                        `${metric === "rain" ? Number(value.toFixed(1)) : Math.round(value)}${metric === "temperature"
                                            ? "°"
                                            : metric === "rain"
                                                ? " mm"
                                                : ""
                                        }`
                                    }
                                />

                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value) => (
                                                <div className="flex w-full items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        {chartConfig[metric].label}
                                                    </span>
                                                    <span className="font-mono font-medium">
                                                        {Number(value)}
                                                        {suffix}
                                                    </span>
                                                </div>
                                            )}
                                        />
                                    }
                                />

                                <Area
                                    key={`${metric}-${unit}`}
                                    dataKey={metric}
                                    type="monotone"
                                    stroke={chartColor}
                                    strokeWidth={2}
                                    fill={`url(#${gradientId})`}
                                    isAnimationActive={false}
                                    dot={{
                                        r: 4,
                                        fill: chartColor,
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </section>

            {/* Metric cards */}
            <section
                aria-label="Weather details"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <MetricCard
                    icon={Wind}
                    label="Wind"
                    value={temp?.current.wind_speed_10m + ' km/h'}
                    description={getWindDirection(temp.current.wind_direction_10m)}
                />
                <MetricCard
                    icon={Droplets}
                    label="Humidity"
                    value={temp.current.relative_humidity_2m + ' %'}
                    description="Relative humidity"
                />
                <MetricCard
                    icon={Sun}
                    label="Today's max UV"
                    value={temp.daily.uv_index_max?.[0]?.toString() ?? "—"}
                    description="Daily maximum"
                />
                <MetricCard
                    icon={Eye}
                    label="Visibility"
                    value={temp.current.visibility == null ? "—" : `${(temp.current.visibility / 1000).toFixed(1)} km`}
                    description="Current visibility"
                />
            </section>

            {/* Forecast and daylight */}
            <section
                aria-label="Weekly forecast"
                className="grid items-start gap-4"
            >
                <Card className={`${panelClass} min-w-0`}>
                    <CardContent className="p-5">
                        <h2 className="mb-4 text-base font-semibold">
                            7-day forecast
                        </h2>

                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Day</TableHead>
                                    <TableHead>Conditions</TableHead>
                                    <TableHead>Precipitation chance</TableHead>
                                    <TableHead className="min-w-[180px]">
                                        Low / High
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {forecast.map((day) => {
                                    const Icon = day.icon
                                    const left =
                                        ((day.low - weekLow) / weekRange) * 100
                                    const width =
                                        ((day.high - day.low) / weekRange) * 100

                                    return (
                                        <TableRow key={day.date}>
                                            <TableCell className="py-4 font-medium">
                                                {day.day}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Icon
                                                        aria-hidden="true"
                                                        className={`size-6 shrink-0 ${day.icon === CloudRain
                                                            ? "text-sky-500"
                                                            : day.icon === Cloud
                                                                ? "text-slate-400"
                                                                : "text-amber-400"
                                                            }`}
                                                    />
                                                    <span className="whitespace-nowrap text-zinc-500">
                                                        {day.condition}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Droplets className="size-4" />
                                                    {day.rain == null ? "—" : `${day.rain}%`}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 text-right text-zinc-500">
                                                        {temperature(day.low)}
                                                    </span>

                                                    <div
                                                        aria-hidden="true"
                                                        className="relative h-1.5 min-w-16 flex-1 rounded-full bg-zinc-100"
                                                    >
                                                        <div
                                                            className="absolute top-0 h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-400"
                                                            style={{
                                                                left: `${Number.isFinite(left) ? left : 0}%`,
                                                                width: `${Number.isFinite(width) ? Math.max(width, 1) : 0}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="w-8 text-right">
                                                        {temperature(day.high)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </main>
    </>
    )
}
