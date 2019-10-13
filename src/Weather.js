import React, { useState, useEffect } from "react";
import "./Weather.css";
import * as utils from "./utils";

const DEBUG = false;

function Weather() {
  const [weather, setWeather] = useState({});
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = () => {
    if (localStorage.getItem("lat") && localStorage.getItem("lon")) {
      setCoords({
        lat: localStorage.getItem("lat"),
        lon: localStorage.getItem("lon")
      });
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          localStorage.setItem("lat", pos.coords.latitude);
          localStorage.setItem("lon", pos.coords.longitude);
        });
      } else {
        alert("Geolocation is not available");
      }
    }
  };
  const fetchData = async () => {
    if (!DEBUG) {
      const result = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&APPID=9256a715d51522e13cca79f1290ea644`
      );
      const data = await result.json();
      console.log(data);
      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        details: data.weather[0],
        wind: data.wind
      };
      document.title = `Weather in ${weatherData.city}, ${weatherData.country}`;
      setWeather(weatherData);
      setIsLoading(false);
    } else {
      const weatherTest = {
        city: "Marseille",
        country: "FR",
        temp: "280",
        details: { description: "rain" }
      };
      document.title = `Weather in ${weatherTest.city}, ${weatherTest.country}`;
      setWeather(weatherTest);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coords.lat !== null && coords.lon !== null) {
      fetchData();
    } else {
      getLocation();
    }
  });

  return (
    <div className="Weather">
      {isLoading && <p>Getting weather info...</p>}
      {!isLoading && (
        <div className="Weather-box">
          <div className="Weather-location">
            <h2 className="Weather-location__size">{weather.city}, {weather.country} 📍</h2>
          </div>
          <div className="Weather-temp">
            <h1 className="Weather-temp__size">{weather.temp && utils.kelvinToDegrees(weather.temp)}</h1>
          </div>
          <h2 className="Weather-description">
            {weather.details && weather.details.description}
          </h2>
        </div>
      )}
    </div>
  );
}

export default Weather;
