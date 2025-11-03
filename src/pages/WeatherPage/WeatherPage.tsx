import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchWeatherForecast } from "@redux/weather/operations";
import { selectForecast5Days } from "@redux/weather/selectors";
import { useGroupedForecast } from "hooks/useGroupedForecast";
import DayCard from "./components/DayCard/DayCard";
import HourlyWeather from "./components/HourlyWeather/HourlyWeather";
import css from "./WeatherPage.module.css";
import DaysCountButtons from "./components/DaysCountButtons/DaysCountButtons";
import CitySearch from "./components/CitySearch/CitySearch";

export default function WeatherPage() {
  const dispatch = useAppDispatch();
  const forecast = useAppSelector(selectForecast5Days);
  const { lat, lon } = useAppSelector((state) => ({
    lat: state.weather.lat,
    lon: state.weather.lon,
  }));

  const groupedByDay = useGroupedForecast(forecast);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [daysCount, setDaysCount] = useState(5);

  useEffect(() => {
    if (lat && lon)
      dispatch(fetchWeatherForecast({ lat, lon, days: daysCount }));
  }, [lat, lon, daysCount, dispatch]);

  useEffect(() => {
    if (forecast && forecast.list.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const firstDate = forecast.list[0].dt_txt.split(" ")[0];
      setSelectedDay(firstDate === today ? today : firstDate);
    }
  }, [forecast]);

  if (!forecast) return <p className={css.loading}>Loading forecast...</p>;

  const days = Object.keys(groupedByDay).slice(0, daysCount);

  return (
    <div className={css.container}>
      <h2 className={css.title}>
        {daysCount}-{daysCount === 1 ? "day" : "days"} weather forecast{" "}
        <span>{forecast.city.name}</span>
      </h2>

      <div className={css.selectBlock}>
        <DaysCountButtons daysCount={daysCount} onChange={setDaysCount} />
        <CitySearch />
      </div>

      <div className={css.daysGrid}>
        {days.map((date) => (
          <DayCard
            key={date}
            date={date}
            dayData={groupedByDay[date]}
            isActive={selectedDay === date}
            onClick={() =>
              setSelectedDay((prev) => (prev === date ? null : date))
            }
          />
        ))}
      </div>

      {selectedDay && <HourlyWeather dayData={groupedByDay[selectedDay]} />}
    </div>
  );
}
