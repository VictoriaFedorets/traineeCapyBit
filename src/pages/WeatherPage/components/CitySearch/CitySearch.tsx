import { useState } from "react";
import { useAppDispatch } from "redux/hooks";
import { setCoords } from "@redux/weather/slice";
import {
  fetchWeatherNow,
  fetchWeatherForecast,
} from "@redux/weather/operations";
import css from "./CitySearch.module.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

export default function CitySearch() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 🔍 Поиск городов через OpenWeather
  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();

      // Убираем дубликаты по координатам
      const uniqueCities = Array.from(
        new Map(
          data.map((city: any) => [`${city.lat}-${city.lon}`, city])
        ).values()
      );

      setResults(uniqueCities);
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // ✅ Выбор города
  const handleSelect = (city: any) => {
    setQuery(
      `${city.name}, ${city.state ? city.state + ", " : ""}${city.country}`
    );
    setIsOpen(false);

    const { lat, lon } = city; // Берем координаты именно выбранного объекта
    if (lat && lon) {
      dispatch(setCoords({ lat, lon }));
      dispatch(fetchWeatherNow({ lat, lon }));
      dispatch(fetchWeatherForecast({ lat, lon }));
    }
  };

  return (
    <div className={css.wrapper}>
      <input
        type="text"
        className={css.input}
        placeholder="Enter city name..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      />

      {isOpen && results.length > 0 && (
        <ul className={css.dropdown}>
          {results.map((city) => (
            <li
              key={`${city.lat}-${city.lon}`}
              className={css.option}
              onClick={() => handleSelect(city)}
            >
              {city.name}
              {city.state ? `, ${city.state}` : ""}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
