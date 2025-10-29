// Тип для текущей погоды
export interface WeatherNowData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export interface WeatherState {
  lat: number | null;
  lon: number | null;
  data: WeatherNowData | null;
  forecast: WeatherForecastData | null;
  loading: boolean;
  error: string | null;
}

// Тип для прогноза
export interface WeatherForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number;
    sys: { pod: string };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
