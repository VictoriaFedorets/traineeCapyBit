import css from "./HourlyWeather.module.css";

interface HourlyWeatherProps {
  dayData: any[];
}

export default function HourlyWeather({ dayData }: HourlyWeatherProps) {
  return (
    <div className={css.hoursWrapper}>
      <div className={css.hoursScroll}>
        {dayData.map((hour) => (
          <div key={hour.dt} className={css.hourCard}>
            <p className={css.hourTime}>
              {hour.dt_txt.split(" ")[1].slice(0, 5)}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
              alt={hour.weather[0].description}
              className={css.hourIcon}
            />
            <p className={css.hourTemp}>{Math.round(hour.main.temp)}°</p>
            <p className={css.hourDesc}>{hour.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
