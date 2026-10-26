import Link from "next/link"
import { Sun, House, MapPin, Search } from "lucide-react"
export default function AppSidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/70 p-4 lg:flex">
            <Link
                href="/"
                className="mb-10 flex items-center gap-3 px-3 py-2"
                aria-label="Atmos home"
            >
                <Sun className="size-8 text-emerald-500" />
                <span className="text-2xl font-bold tracking-tight">
                    weather App
                </span>
            </Link>

            <nav aria-label="Main navigation" className="space-y-1">
                <Link
                    href="/"
                    aria-current="page"
                    className="flex h-11 items-center gap-3 rounded-lg bg-emerald-50 px-3 text-sm font-medium text-emerald-800"
                >
                    <House className="size-5" />
                    Overview
                </Link>

                <Link
                    href="/getbylocation"
                    className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100"
                >
                    <Search className="size-5" />
                    Search cities
                </Link>
            </nav>

            <div className="mt-10 hidden">
                <p className="mb-3 px-3 text-[11px] font-medium tracking-wider text-zinc-400">
                    SAVED LOCATIONS
                </p>

                <div className="space-y-1">
                    {["Karachi", "London", "Tokyo"].map((city) => (
                        <Link
                            key={city}
                            href="/getbylocation"
                            className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100"
                        >
                            <MapPin className="size-4 text-zinc-400" />
                            {city}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    )
}
