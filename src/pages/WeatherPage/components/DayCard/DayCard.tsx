import css from "./DayCard.module.css";

interface DayCardProps {
  date: string;
  dayData: any[];
  isActive: boolean;
  onClick: () => void;
}

export default function DayCard({
  date,
  dayData,
  isActive,
  onClick,
}: DayCardProps) {
  const minTemp = Math.min(...dayData.map((i) => i.main.temp_min));
  const maxTemp = Math.max(...dayData.map((i) => i.main.temp_max));
  const { icon, description } = dayData[0].weather[0];

  const weekday = new Date(date).toLocaleDateString("en-EN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <div
      className={`${css.dayCard} ${isActive ? css.active : ""}`}
      onClick={onClick}
    >
      <p className={css.date}>{weekday}</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className={css.icon}
      />
      <p className={css.temps}>
        <span className={css.max}>{Math.round(maxTemp)}°</span> /
        <span className={css.min}>{Math.round(minTemp)}°</span>
      </p>
    </div>
  );
}
