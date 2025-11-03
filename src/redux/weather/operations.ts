import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@services/apiConfig";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { WeatherNowData, WeatherForecastData } from "./types";

export const fetchWeatherNow = createAsyncThunk<
  WeatherNowData,
  { lat: number; lon: number },
  { rejectValue: string }
>("weather/fetchWeatherNow", async (coords, { rejectWithValue }) => {
  try {
    const res = await api.get<WeatherNowData>("/weather/now", {
      params: coords,
    });
    return res.data;
  } catch (error) {
    let message = "Request error";
    if ((error as AxiosError).isAxiosError) {
      const errData = (error as AxiosError).response?.data;
      if (errData && typeof errData === "object" && "message" in errData) {
        message = (errData as { message: string }).message;
      }
    }

    toast.error(message);
    return rejectWithValue(message);
  }
});

export const fetchWeatherForecast = createAsyncThunk<
  WeatherForecastData,
  { lat: number; lon: number; days?: number },
  { rejectValue: string }
>(
  "weather/fetchForecast",
  async ({ lat, lon, days = 5 }, { rejectWithValue }) => {
    try {
      const cnt = days * 8;

      const res = await api.get<WeatherForecastData>("/weather/forecast", {
        params: { lat, lon, cnt },
      });
      return res.data;
    } catch (error) {
      let message = "Request error";
      if ((error as AxiosError).isAxiosError) {
        const errData = (error as AxiosError).response?.data;
        if (errData && typeof errData === "object" && "message" in errData) {
          message = (errData as { message: string }).message;
        }
      }

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
