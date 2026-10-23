import { WeatherResponse } from "@/types/weather";
import { createSlice } from "@reduxjs/toolkit";

interface WeatherState {
  temp: WeatherResponse | null;
  locationwise: WeatherResponse | null;
}

const watherSlice = createSlice({
  name: "weaher",
  initialState: { temp: null,locationwise:null } as WeatherState,
  reducers: {
    getweather: (state, action) => {
      state.temp = action.payload;
    },
    bylocation: (state,action) => {
      state.locationwise = action.payload;
    },
    clearweather: (state) => {
      state.temp = null;
    }
  },
});

export const { getweather,bylocation,clearweather } = watherSlice.actions;
export default watherSlice.reducer;
