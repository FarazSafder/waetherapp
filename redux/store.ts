import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
