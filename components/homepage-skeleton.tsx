"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const panelClass =
    "gap-0 rounded-xl border-zinc-200 bg-white py-0 shadow-none"

function Placeholder({ className }: { className: string }) {
    return (
        <Skeleton
            className={`bg-zinc-100 motion-reduce:animate-none ${className}`}
        />
    )
}

export default function HomePageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Weather dashboard"
            className="mx-auto max-w-[1600px] p-5 lg:p-8"
        >
            <span role="status" className="sr-only">
                Loading weather forecast…
            </span>

            <div aria-hidden="true" className="space-y-5">
                {/* Page heading */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-full">
                        <Placeholder className="h-9 w-72 max-w-full" />
                        <Placeholder className="mt-2 h-5 w-64 max-w-full" />
                    </div>

                    <Placeholder className="h-10 w-36 rounded-lg" />
                </div>

                {/* Current weather and chart */}
                <section className="grid gap-4 xl:grid-cols-3">
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

                    <Card className={`${panelClass} min-w-0 xl:col-span-2`}>
                        <CardContent className="p-5">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <Placeholder className="h-6 w-32" />

                                <div className="flex gap-1 rounded-lg border border-zinc-200 p-1">
                                    <Placeholder className="h-7 w-20" />
                                    <Placeholder className="h-7 w-12" />
                                    <Placeholder className="h-7 w-12" />
                                </div>
                            </div>

                            {/* Same height as your ChartContainer */}
                            <div className="flex h-[250px] gap-4">
                                <div className="flex w-8 shrink-0 flex-col justify-between pb-8 pt-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Placeholder key={index} className="h-3 w-7" />
                                    ))}
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <Placeholder className="mt-4 min-h-0 flex-1 rounded-lg" />

                                    <div className="mt-4 flex h-4 justify-between gap-2">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <Placeholder
                                                key={index}
                                                className="h-3 w-9 min-w-0"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Four metric cards */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className={panelClass}>
                            <CardContent className="flex items-start gap-4 p-5">
                                <Placeholder className="mt-1 size-7 shrink-0 rounded-md" />

                                <div className="min-w-0 flex-1">
                                    <Placeholder className="h-5 w-24 max-w-full" />
                                    <Placeholder className="mt-1 h-8 w-28 max-w-full" />
                                    <Placeholder className="mt-1 h-4 w-20 max-w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Forecast and daylight */}
                <section className="grid items-start gap-4 xl:grid-cols-3">
                    <Card className={`${panelClass} min-w-0 xl:col-span-2`}>
                        <CardContent className="p-5">
                            <Placeholder className="mb-4 h-6 w-36" />

                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>
                                            <Placeholder className="h-4 w-8" />
                                        </TableHead>
                                        <TableHead>
                                            <Placeholder className="h-4 w-20" />
                                        </TableHead>
                                        <TableHead>
                                            <Placeholder className="h-4 w-10" />
                                        </TableHead>
                                        <TableHead className="min-w-[180px]">
                                            <Placeholder className="h-4 w-20" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <TableRow
                                            key={index}
                                            className="hover:bg-transparent"
                                        >
                                            <TableCell className="py-4">
                                                <Placeholder className="h-5 w-10" />
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Placeholder className="size-6 shrink-0 rounded-full" />
                                                    <Placeholder className="h-4 w-24" />
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Placeholder className="size-4 shrink-0" />
                                                    <Placeholder className="h-4 w-8" />
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Placeholder className="h-4 w-8 shrink-0" />
                                                    <Placeholder className="h-1.5 min-w-16 flex-1 rounded-full" />
                                                    <Placeholder className="h-4 w-8 shrink-0" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className={panelClass}>
                        <CardContent className="p-6">
                            <Placeholder className="h-6 w-32" />

                            {/* Matches the daylight SVG aspect ratio */}
                            <div className="mt-6 flex aspect-[300/180] items-end">
                                <Placeholder className="h-[85%] w-full rounded-t-full rounded-b-none" />
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <Placeholder className="h-4 w-12" />
                                    <Placeholder className="mt-1 h-7 w-24" />
                                </div>

                                <div className="flex flex-col items-end">
                                    <Placeholder className="h-4 w-12" />
                                    <Placeholder className="mt-1 h-7 w-24" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center border-t border-zinc-100 pt-5">
                                <Placeholder className="h-5 w-40" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Footer */}
                <div className="flex justify-end pt-2">
                    <Placeholder className="h-4 w-48" />
                </div>
            </div>
        </main>
    )
}
