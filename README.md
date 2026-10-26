# Weather App

A weather dashboard built with Next.js, React, TypeScript, and Redux Toolkit. Explore current conditions, hourly charts, and a seven-day forecast for your approximate location, or search for another city's current weather. Forecasts come from Open-Meteo.

## Features

- Automatically load weather for your approximate location using an IP address lookup.
- View current temperature, feels-like temperature, conditions, and daily high/low temperatures.
- Switch the homepage's hourly chart between temperature, rainfall, and wind speed.
- Explore seven days of conditions, precipitation chances, and temperature ranges.
- View wind direction, humidity, daily maximum UV index, and visibility.
- Switch between Celsius and Fahrenheit on the homepage.
- Search for a city and display current conditions for the first matching result.
- Show a welcome message before the first city search, skeletons while loading, and errors when requests fail.
- Retry failed homepage requests or navigate to city search.
- Keep homepage weather, its city/country label, and city-search weather in Redux during navigation.

## Tech stack

| Tool | Purpose |
| --- | --- |
| Next.js 16 and React 19 | App Router pages and UI |
| TypeScript | Application and API response types |
| Redux Toolkit and React Redux | Shared weather state |
| Axios | HTTP requests |
| Recharts | Interactive hourly area charts |
| Tailwind CSS 4 | Styling and responsive layouts |
| shadcn/ui and Base UI | Reusable UI components |
| Lucide React | Weather and navigation icons |

## Getting started

### Prerequisites

- Node.js 24, or Node.js 22.13+ on the Node 22 release line, to satisfy the locked dependencies' engine requirements.
- npm.
- An internet connection to install dependencies and fetch location and weather data.

### Run locally

From this project's directory:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The current implementation does not require an API key or an `.env` file. API URLs are configured in [services/weatherApi.ts](services/weatherApi.ts).

## Using the app

| Route | Usage |
| --- | --- |
| `/` | Weather loads automatically. Choose an hourly chart metric, toggle temperature units, and browse the seven-day forecast. If loading fails, use **Try again** or **Search for a city**. |
| `/getbylocation` | Enter a city name containing at least two characters and click **Search**. With no saved result, the page initially prompts you to search. A successful search displays current conditions and today's high/low temperatures. |

The location lookup uses `ipwho.is` instead of browser GPS. The displayed location depends on the result returned for your internet connection.

The hourly chart displays the first 24 hourly entries returned by the API for the forecast location's day, starting at midnight; it is not a rolling next-24-hours chart. Daily rows use the forecast location's calendar dates.

| Measurement | Display unit |
| --- | --- |
| Temperature | Celsius by default; Fahrenheit toggle on the homepage |
| Hourly rainfall | Millimeters (mm) |
| Daily precipitation chance | Percentage (%) |
| Humidity | Percentage (%) |
| Wind speed | Kilometers per hour (km/h) |
| Visibility | Kilometers (km) |

City-search temperatures currently display in Celsius. The hourly chart and seven-day table are available on the homepage.

## Available commands

Run these commands from the project directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve an existing production build. |
| `npm run lint` | Run the configured ESLint command. |
| `npx tsc --noEmit --incremental false` | Check TypeScript without generating JavaScript or an incremental cache. |

To build and run in production mode locally:

```bash
npm run build
npm start
```

The root layout uses Geist, Geist Mono, and Inter through `next/font/google`. A production build needs access to Google Fonts when those fonts are not already cached.

### Development notes

- The current lint setup needs dependency alignment: `eslint.config.mjs` imports `eslint/config`, but the project installs ESLint 8.57.1. This causes `npm run lint` to fail before checking source files. The project also pairs Next.js 16 with `eslint-config-next` 14.
- If Windows PowerShell blocks `npm.ps1`, use `npm.cmd ci`, `npm.cmd run dev`, and the corresponding `npm.cmd` commands for other scripts.
- There is no automated test script configured in `package.json`.

## Project structure

```text
weatherapp/
|-- app/
|   |-- getbylocation/page.tsx   # Search input, geocoding, and city weather requests
|   |-- globals.css             # Global styles and theme variables
|   |-- layout.tsx              # Root layout, fonts, sidebar, and provider
|   |-- page.tsx                # Automatic location lookup, loading, and retry logic
|   `-- StoreProvider.tsx       # Redux provider
|-- components/
|   |-- ui/                    # Inputs, cards, chart helpers, tables, and skeletons
|   |-- Homepage.tsx           # Current conditions, hourly chart, and weekly forecast
|   |-- homepage-skeleton.tsx  # Homepage loading placeholders
|   |-- searchpage.tsx         # Search welcome, loading, error, and result states
|   `-- sidebar.tsx            # Desktop navigation
|-- lib/                       # Shared utilities
|-- redux/
|   |-- store.ts               # Store setup and typed exports
|   `-- weatherSlice.ts        # Weather state and actions
|-- services/weatherApi.ts     # Location, geocoding, and weather requests
|-- types/weather.ts           # API response types
`-- next.config.ts             # Next.js and Tailwind configuration
```

`Header.tsx`, `SearchCity.tsx`, and `WeatherCard.tsx` also remain in the repository from the earlier UI. The current routes use the components listed above.

## Data and state

Requests run in the browser through the functions in [services/weatherApi.ts](services/weatherApi.ts):

| Function | Service | Purpose |
| --- | --- | --- |
| `getcurrentlocation(signal?)` | `https://ipwho.is/` | Resolve approximate coordinates, city, and country. |
| `getcitylatlongapi(city)` | `https://geocoding-api.open-meteo.com/v1/search` | Find coordinates for the first matching city. |
| `getweatherapi(lat, lon, signal?)` | `https://api.open-meteo.com/v1/forecast` | Fetch current conditions, hourly temperature/rainfall/wind, and seven days of daily forecast data with automatic timezone selection. |

All three services use a five-second request timeout. The homepage passes an `AbortSignal` to location and weather requests and cancels them when its fetching effect is cleaned up.

[redux/weatherSlice.ts](redux/weatherSlice.ts) manages:

| State field | Purpose | Action |
| --- | --- | --- |
| `weather.temp` | Homepage weather response | `getweather` |
| `weather.currentLocation` | Homepage city and country | `setCurrentLocation` |
| `weather.locationwise` | City-search weather response | `bylocation` |

`clearweather` resets the homepage weather and location label. It does not clear city-search weather, and the current UI does not expose a clear button.

Weather results are held in memory and reset on a full page reload; there is no local-storage persistence or automatic refresh interval. Returning to the homepage reuses its saved result. Reload the page to fetch a fresh homepage forecast.

Loading and error states remain local to each page. The search page also keeps its input and resolved city label locally; only its weather response is saved in Redux. City search selects the first geocoding match rather than presenting a list of matching places.
