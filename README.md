# Weather App

A weather application built with Next.js, React, TypeScript, and Redux Toolkit. View current conditions for your approximate location or search for a city using Open-Meteo weather data.

## Features

- Find weather for your location using an IP address lookup.
- Search for a city and display the first matching result with its region and country.
- View temperature, feels-like temperature, weather conditions, humidity, and wind speed.
- Display weather icons, loading skeletons, and error messages.
- Keep location-based and city-search results separately in Redux while navigating between pages.
- Clear the current-location result to request fresh weather.

## Tech stack

| Tool | Purpose |
| --- | --- |
| Next.js 16 and React 19 | App Router pages and UI |
| TypeScript | Application and API response types |
| Redux Toolkit and React Redux | Shared weather state |
| Axios | HTTP requests |
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
| `/` | Click **Get weather for my location** to look up your approximate location and fetch its weather. Click **clear State** before requesting an updated result. |
| `/getbylocation` | Enter a city name containing at least two characters and click **Search**. The app uses the first matching city. |

The location lookup uses `ipwho.is` instead of browser GPS. The displayed location depends on the result returned for your internet connection.

Temperature is displayed in Celsius, humidity as a percentage, and wind speed in km/h. The interface currently displays current conditions; hourly and five-day forecast data are requested by the service but are not rendered.

## Available commands

Run these commands from the project directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve an existing production build. |
| `npm run lint` | Run the configured ESLint command. |

To build and run in production mode locally:

```bash
npm run build
npm start
```

The root layout uses Google fonts through `next/font/google`, so building may require network access to download fonts.

## Project structure

```text
weatherapp/
|-- app/
|   |-- getbylocation/page.tsx   # City search page
|   |-- globals.css             # Global styles and theme variables
|   |-- layout.tsx              # Root layout, fonts, header, and provider
|   |-- page.tsx                # Current-location weather page
|   `-- StoreProvider.tsx       # Redux provider
|-- components/
|   |-- ui/                    # Reusable UI primitives
|   |-- Header.tsx             # Navigation
|   |-- SearchCity.tsx         # City search form
|   `-- WeatherCard.tsx        # Weather, loading, and error displays
|-- lib/                       # Shared utilities
|-- redux/
|   |-- store.ts               # Store setup and typed exports
|   `-- weatherSlice.ts        # Weather state and actions
|-- services/weatherApi.ts     # Location, geocoding, and weather requests
|-- types/weather.ts           # API response types
`-- next.config.ts             # Next.js and Tailwind configuration
```

## Data and state

Requests run in the browser through the functions in [services/weatherApi.ts](services/weatherApi.ts):

| Function | Service | Purpose |
| --- | --- | --- |
| `getcurrentlocation()` | `https://ipwho.is/` | Resolve an approximate latitude and longitude. |
| `getcitylatlongapi(city)` | `https://geocoding-api.open-meteo.com/v1/search` | Find coordinates for the first matching city. |
| `getweatherapi(lat, lon)` | `https://api.open-meteo.com/v1/forecast` | Fetch current conditions, hourly temperatures, and five days of daily forecast data with automatic timezone selection. |

The weather and city-search clients each use a five-second request timeout.

[redux/weatherSlice.ts](redux/weatherSlice.ts) stores current-location weather in `weather.temp` and city-search weather in `weather.locationwise`. The `getweather` and `bylocation` actions update those fields; `clearweather` resets only `weather.temp`.

Weather results are held in memory and reset on a full page reload. The home page reuses its stored result until it is cleared. Loading indicators, error messages, and the selected city label are managed within the page components.
