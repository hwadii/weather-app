import React, { useState, useEffect } from "react";
import "./Weather.css";
import * as utils from "./utils";

function Weather() {
  const [weather, setWeather] = useState({});
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    } else {
      alert("Geolocation is not available");
    }
  };
  const fetchData = async () => {
    const result = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&APPID=9256a715d51522e13cca79f1290ea644`
    );
    const data = await result.json();
    const weatherData = {
      id: data.id,
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      details: data.weather[0],
      wind: data.wind
    };
    setWeather(weatherData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (coords.lat !== null && coords.lon !== null) {
      fetchData();
    } else {
      getLocation();
    }
  }, [coords]);

  return (
    <div className="Weather">
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div className="Weather-box">
          <p>
            {weather.city}, {weather.country}
          </p>
          <p>{weather.details && weather.details.description}</p>
          <p>{weather.temp && utils.kelvinToDegrees(weather.temp)}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
