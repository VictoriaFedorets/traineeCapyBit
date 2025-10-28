import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchWeather } from "@redux/weather/operations";
import {
  selectWeather,
  selectWeatherLoading,
  selectWeatherError,
} from "@redux/weather/selectors";
import css from "./WeatherWidget.module.css";

export default function WeatherWidget() {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(selectWeather);
  const loading = useAppSelector(selectWeatherLoading);
  const error = useAppSelector(selectWeatherError);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getWeatherByDefaultCity = () => {
      dispatch(fetchWeather({ lat: 50.450001, lon: 30.523333 }));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(fetchWeather({ lat: latitude, lon: longitude }));
        },
        (err) => {
          console.warn("Geolocation denied:", err.message);
          getWeatherByDefaultCity();
        }
      );
    } else {
      getWeatherByDefaultCity();
    }
  }, [dispatch]);

  useEffect(() => {
    if (weather && !loading && !error) {
      setVisible(true);
    }
  }, [weather, loading, error]);

  if (!weather || loading || error || !visible) return null;

  const cityName =
    weather.city?.toLowerCase().includes("pushcha") ||
    weather.city?.toLowerCase().includes("vod")
      ? "Kyiv, Ukraine"
      : weather.city;

  return (
    <div className={css.widget}>
      <img src={weather.icon} alt={weather.description} className={css.icon} />
      <div className={css.info}>
        <span className={css.temp}>{weather.temp}°C</span>
        <span className={css.city}>{cityName}</span>
        <p className={css.description}>{weather.description}</p>
      </div>
    </div>
  );
}
