import React from "react";
import css from "./DaysCountButtons.module.css";

interface DaysCountButtonsProps {
  daysCount: number;
  onChange: (count: number) => void;
}

const DaysCountButtons: React.FC<DaysCountButtonsProps> = ({
  daysCount,
  onChange,
}) => {
  return (
    <div className={css.buttons}>
      {[1, 2, 3, 4, 5].map((d) => (
        <button
          key={d}
          className={`${css.btn} ${d === daysCount ? css.active : ""}`}
          onClick={() => onChange(d)}
        >
          {d} {d === 1 ? "day" : "days"}
        </button>
      ))}
    </div>
  );
};

export default DaysCountButtons;
