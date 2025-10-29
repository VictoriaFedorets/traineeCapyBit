import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { fetchWeatherNow, fetchWeatherForecast } from "./operations";
import type { WeatherState } from "./types";

const initialState: WeatherState = {
  lat: null,
  lon: null,
  data: null,
  forecast: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCoords(state, action: PayloadAction<{ lat: number; lon: number }>) {
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherNow.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.forecast = payload;
      })
      .addMatcher(
        isAnyOf(fetchWeatherNow.pending, fetchWeatherForecast.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        isAnyOf(fetchWeatherNow.rejected, fetchWeatherForecast.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload ?? "Unknown error";
        }
      );
  },
});

export const { setCoords } = weatherSlice.actions;
export default weatherSlice.reducer;
