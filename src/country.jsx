import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const url = "https://studies.cs.helsinki.fi/restcountries/api/";

  const [countryDetails, setCountryDetails] = useState(null);
  const [search, setSearch] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    setWeather(null)
    if (search) {
      axios.get(`${url}/all`).then((response) => {
        setFilteredCountries(
          response.data.filter((country) => {
            const countryName = country.name.common.toLowerCase();
            return countryName.includes(search.toLowerCase());
          })
        );

        console.log(filteredCountries.length);
        console.log(filteredCountries);
      });
      if (filteredCountries.length === 1) {
        axios
          .get(`${url}/name/${filteredCountries[0].name.common}`)
          .then((response) => {
            setCountryDetails(response.data);
          });
      } else {
        setCountryDetails(null);
      }
    }
  }, [search]);

  const searchChangeHandler = (e) => {
    setSearch(e.target.value);
  };

  const showCountryHandler = (country) => {
    setWeather(null)
    axios.get(`${url}/name/${country.name.common}`).then((response) => {
      setCountryDetails(response.data);
    });
  };

  const weatherReport = ([lat, long]) => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m`
      )
      .then((response) => {
        console.log(response);
        setWeather({
          temp: response.data.current.temperature_2m,
          wind: response.data.current.wind_speed_10m,
        });

        console.log(weather);
      });
  };

  return (
    <>
      <input type="text" onChange={searchChangeHandler} />
      <ul>
        {filteredCountries.length < 10 && filteredCountries.length > 1 ? (
          filteredCountries.map((country) => {
            return (
              <>
                <div>
                  <li id={filteredCountries.area}>{country.name.common}</li>;
                  <button onClick={() => showCountryHandler(country)}>
                    Show
                  </button>
                </div>
              </>
            );
          })
        ) : (
          <p>Too many matches. Enter few more characters</p>
        )}
      </ul>

      {countryDetails && (
        <>
          <h1>{countryDetails.name.common}</h1>
          <p>Capital - {countryDetails.capital}</p>
          <p>Area - {countryDetails.area}</p>
          <div>
            Languages -
            <ul>
              {Object.values(countryDetails.languages).map((lang) => (
                <li>{lang}</li>
              ))}
            </ul>
          </div>
          <br />
          <br />
          <img src={countryDetails.flags.png} alt="Flag" />

          {weather && (
            <div>
              <p>
                Temperature in {countryDetails.capital} -{weather.temp}
              </p>
              <p>Wind - {weather.wind}</p>
            </div>
          )}

          {!weather && weatherReport(countryDetails.capitalInfo.latlng)}
        </>
      )}
    </>
  );
};

export default App;
