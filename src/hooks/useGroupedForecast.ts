import { useMemo } from "react";

export const useGroupedForecast = (forecast: any) => {
  return useMemo(() => {
    if (!forecast || !forecast.list) return {};

    const grouped: Record<string, typeof forecast.list> = {};
    forecast.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  }, [forecast]);
};
