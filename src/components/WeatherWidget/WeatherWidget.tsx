import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchWeatherNow } from "@redux/weather/operations";
import {
  selectWeather,
  selectWeatherLoading,
  selectWeatherError,
} from "@redux/weather/selectors";
import css from "./WeatherWidget.module.css";
import { useNavigate } from "react-router-dom";
import { setCoords } from "@redux/weather/slice";

export default function WeatherWidget() {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(selectWeather);
  const loading = useAppSelector(selectWeatherLoading);
  const error = useAppSelector(selectWeatherError);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getWeatherByDefaultCity = () => {
      const lat = 50.450001;
      const lon = 30.523333;
      dispatch(setCoords({ lat, lon }));
      dispatch(fetchWeatherNow({ lat, lon }));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(setCoords({ lat: latitude, lon: longitude }));
          dispatch(fetchWeatherNow({ lat: latitude, lon: longitude }));
        },
        () => getWeatherByDefaultCity()
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

  const handleClick = () => {
    navigate("/weather");
  };

  return (
    <div onClick={handleClick} className={css.widget}>
      <img src={weather.icon} alt={weather.description} className={css.icon} />
      <div className={css.info}>
        <span className={css.temp}>{weather.temp}°C</span>
        <span className={css.city}>{cityName}</span>
        <p className={css.description}>{weather.description}</p>
      </div>
    </div>
  );
}
