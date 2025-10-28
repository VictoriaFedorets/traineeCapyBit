import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "@services/apiConfig";
import { toast } from "react-toastify";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (coords: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const res = await api.get("/weather/now", {
        params: coords,
      });
      return res.data;
    } catch (error: unknown) {
      let message = "Request error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
