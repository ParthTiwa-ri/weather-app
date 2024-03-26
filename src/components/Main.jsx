/* eslint-disable react/prop-types */
import "./Main.css";
import { SlCalender } from "react-icons/sl";
import { CiLocationOn } from "react-icons/ci";
import { FaWind } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { LuMoon } from "react-icons/lu";
import { WiHumidity } from "react-icons/wi";
import { PiWaves } from "react-icons/pi";
import { FiEye } from "react-icons/fi";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import {
  extractDailyTemperatures,
  formatDateMonth,
  formatDay,
  formatTimestamp,
  timestampToTime,
} from "../utils/helper";
import Header from "./Header";
import toast from "react-hot-toast";

function Main() {
  const [weatherData, setWeatherData] = useState(null);

  const [weatherHourData, setWeatherHourData] = useState(null);
  const [airPollution, setAirPollution] = useState(null);
  //   const [location, setLocation] = useState({
  //     lat: 28.6517178,
  //     lon: 77.2219388,
  //   });

  const [city, setCity] = useState("Delhi");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const API_KEY = "588b3aeeb5a7e096aade4e9e6e30a1e3";

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingLocation(true); //

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        console.log(data.cod);
        if (data.cod === "404" || data.cod === "400") {
          throw new Error("City Not Found");
        }
        setWeatherData(data);
        setLoadingLocation(false); //
      } catch (error) {
        toast.error(`Error fetching weather: ${error.message}`);

        console.error("Error fetching weather:", error);
        setLoadingLocation(false); //
      }
    };

    const fetchHourWeather = async () => {
      setLoadingLocation(true); //

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=${API_KEY}&units=metric&cnt=60`
        );
        const data = await response.json();
        if (data.cod === "404" || data.cod === "400") {
          return;
        }
        setWeatherHourData(data);
        setLoadingLocation(false); //
      } catch (error) {
        toast.error(`Error fetching weather: ${error.message}`);

        console.error("Error fetching weather:", error);
        setLoadingLocation(false); //
      }
    };

    const fetchAirPollution = async () => {
      setLoadingLocation(true); //

      try {
        const response1 = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}&units=metric&limit=1`
        );
        const data1 = await response1.json();
        if (data1.length === 0 || data1.cod === "400") {
          return;
        }
        console.log(data1);

        const { lat, lon } = data1[0];

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod === "404" || data.cod === "400") {
          throw new Error("City Not Found");
        }
        setAirPollution(data.list[0]);
        setLoadingLocation(false); //
      } catch (error) {
        toast.error(`Error fetching weather: ${error.message}`);
        console.error("Error fetching weather:", error);
        setLoadingLocation(false); //
      }
    };

    // const getLocation = () => {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       async (position) => {
    //         const { latitude, longitude } = position.coords;
    //         setLocation({ lat: latitude, lon: longitude });
    //         const response = await fetch(
    //           `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    //         );
    //         const data = await response.json();
    //         setCity(data[0].name);
    //         console.log(data);
    //       },
    //       (error) => {
    //         console.error("Error getting geolocation:", error);
    //         setLoadingLocation(false); //
    //       }
    //     );
    //   } else {
    //     console.error("Geolocation is not supported");
    //   }
    // };

    fetchHourWeather();
    // getLocation();
    fetchWeather();
    fetchAirPollution();
  }, [city, API_KEY]);
  const dailyData = extractDailyTemperatures(weatherHourData);
  //   console.log(location);
  const handleLocationClick = () => {
    setLoadingLocation(true); //

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          //   setLocation({ lat: latitude, lon: longitude });
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          if (data.cod === "404" || data.cod === "400") {
            throw new Error("City Not Found");
          }
          setCity(data[0].name);
          // console.log(data);
          setLoadingLocation(false); //
        },
        (error) => {
          toast.error(`Error getting geolocation: ${error.message}`);
          console.error("Error getting geolocation:", error.message);
          setLoadingLocation(false); //
        }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  };
  function handleForm(e) {
    e.preventDefault();
    setCity(searchValue);
    setSearchValue("");
  }
  return (
    <>
      <Header
        handleLocationClick={handleLocationClick}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        handleForm={handleForm}
      />
      {weatherHourData === null ||
      weatherData === null ||
      dailyData === null ||
      airPollution == null ||
      loadingLocation == true ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <main className="container">
          <div className="left-content">
            <section className="left-cards">
              <CurrentWeather weatherData={weatherData} />
              <p className="title-2 text-middle">5 Days Forecast</p>
              <ul className="card future-card">
                {dailyData.map(
                  (item, index) =>
                    index !== 0 && (
                      <FutureDay
                        key={index}
                        icon={item.weather[0].icon}
                        temp={item.main.temp}
                        dt={item.dt}
                      />
                    )
                )}
              </ul>
            </section>
          </div>

          <div className="right-content">
            <section className="left-cards">
              <div className="today-detail card">
                <p className="title-1 main-text">Todays Highlight</p>
                <div className="today-details">
                  <div className="card-dark item-1">
                    <div className="good-container">
                      <span className="title-4 meta-text">
                        Air Quailty Index
                      </span>
                      <span
                        className={`good-text title-4 ${
                          airPollution.main.aqi < 2 ? "good" : "bad"
                        }`}
                      >
                        {airPollution.main.aqi < 2 ? "Good" : "Poor"}
                      </span>
                    </div>
                    <div className="air-detail">
                      <FaWind className="icon-big" />
                      <div className="air-detail-flex">
                        <span className="meta-text small-text">PM25</span>
                        <p>{airPollution.components.pm2_5}</p>
                      </div>
                      <div className="air-detail-flex">
                        <span className="meta-text small-text">SO2</span>
                        <p>{airPollution.components.so2}</p>
                      </div>
                      <div className="air-detail-flex">
                        <span className="meta-text small-text">NO2</span>
                        <p>{airPollution.components.no2}</p>
                      </div>

                      <div className="air-detail-flex">
                        <span className="meta-text small-text">O3</span>
                        <p>{airPollution.components.o3}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-dark item-2">
                    <span className="title-4 meta-text">Sunrise & Sunset</span>
                    <div className="air-detail">
                      <IoSunnyOutline className="icon-big margin-top-icon " />
                      <div className="air-detail-flex flex-start">
                        <span className="meta-text small-text">Sunrise</span>
                        <p>{timestampToTime(weatherData?.sys.sunrise)}</p>
                      </div>
                      <LuMoon className="icon-big margin-top-icon " />

                      <div className="air-detail-flex flex-start">
                        <span className="meta-text small-text">Sunset</span>
                        <p>{timestampToTime(weatherData?.sys.sunset)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-dark item-3">
                    <span className="title-4 meta-text">Humidity</span>
                    <div className="four-small-flex">
                      <WiHumidity className="icon-extra-big icon-only-big" />
                      <p>{weatherData?.main.humidity}%</p>
                    </div>
                  </div>
                  <div className="card-dark item-4">
                    <span className="title-4 meta-text">Pressure</span>
                    <div className="four-small-flex">
                      <PiWaves className="icon-extra-big" />
                      <p>
                        {weatherData?.main.pressure}
                        <span className="title-1">hPa</span>
                      </p>
                    </div>
                  </div>
                  <div className="card-dark item-5">
                    <span className="title-4 meta-text">Visibility</span>
                    <div className="four-small-flex">
                      <FiEye className="icon-extra-big" />
                      <p>{weatherData?.visibility / 1000}km</p>
                    </div>
                  </div>
                  <div className="card-dark item-6">
                    <span className="title-4 meta-text">Feels like</span>
                    <div className="four-small-flex">
                      <LiaTemperatureLowSolid className="icon-extra-big" />
                      <p>
                        {weatherData?.main.feels_like}&deg;
                        <sup className="title-1">c</sup>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="title-2 text-middle">Today at</p>
              <div className="today-at">
                <ul className="flex-row">
                  {weatherHourData?.list.map(
                    (item, index) =>
                      index <= 6 && (
                        <HourList
                          key={index}
                          dt={item.dt}
                          temp={item.main.temp}
                          icon={item.weather[0].icon}
                        />
                      )
                  )}
                </ul>
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
}

export default Main;

function CurrentWeather({ weatherData }) {
  return (
    <div className="card current-weather-card">
      <h2 className="card-title title-2">Now</h2>
      <div className="weaper">
        <p className="heading">
          {weatherData ? Math.trunc(weatherData.main.temp) : 25}&deg;
          <sup className="sup">c</sup>
        </p>
        <img
          src={`/assets/images/weather_icons/${weatherData?.weather[0].icon}.png`}
          alt="wether-logo"
          height={64}
          width={64}
          className="weather-icon"
        />
      </div>
      <p className="body-3 border-down">
        {weatherData ? weatherData.weather[0].description : "Overcast Cloud"}
      </p>

      <ul className="meta-list">
        <li className="meta-item">
          <SlCalender className="icon" />
          <p className="title-3 meta-text">
            {weatherData ? formatTimestamp(weatherData?.dt) : null}
          </p>
        </li>
        <li className="meta-item">
          <CiLocationOn className="icon" />
          <p className="title-3 meta-text">{`${weatherData?.name}, ${weatherData?.sys.country}`}</p>
        </li>
      </ul>
    </div>
  );
}

function HourList({ dt, temp, icon }) {
  return (
    <li className="flex-item-today today-card">
      <span className="title-3 meta-text">{timestampToTime(dt)}</span>
      <img
        src={`/assets/images/weather_icons/${icon}.png`}
        alt="weather"
        height={42}
        width={42}
      />
      <span className="title-4 meta-text">{Math.trunc(temp)}&deg;</span>
    </li>
  );
}

function FutureDay({ dt, icon, temp }) {
  return (
    <li className="future-item">
      <div className="temp">
        <img
          src={`/assets/images/weather_icons/${icon}.png`}
          alt="temp-icon"
          height={36}
          width={36}
        />
        <span>{Math.trunc(temp)}&deg;</span>
      </div>
      <span>{formatDateMonth(dt)}</span>
      <span>{formatDay(dt)}</span>
    </li>
  );
}
