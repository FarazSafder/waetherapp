import { WeatherResponse } from "@/types/weather";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WeatherState {
  temp: WeatherResponse | null;
  locationwise: WeatherResponse | null;
  currentLocation: { city: string; country: string } | null;
}

const watherSlice = createSlice({
  name: "weaher",
  initialState: { temp: null, locationwise: null, currentLocation: null } as WeatherState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<{ city: string; country: string }>) => {
      state.currentLocation = action.payload;
    },
    getweather: (state, action: PayloadAction<WeatherResponse>) => {
      state.temp = action.payload;
    },
    bylocation: (state, action: PayloadAction<WeatherResponse>) => {
      state.locationwise = action.payload;
    },
    clearweather: (state) => {
      state.temp = null;
      state.currentLocation = null;
    }
  },
});

export const { getweather,bylocation,clearweather,setCurrentLocation } = watherSlice.actions;
export default watherSlice.reducer;
