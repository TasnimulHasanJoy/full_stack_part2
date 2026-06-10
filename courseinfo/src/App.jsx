import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAll().then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const matches = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const countryToShow =
    selectedCountry ||
    (matches.length === 1 ? matches[0] : null)

  useEffect(() => {
    if (countryToShow?.capital?.[0]) {
      weatherService
        .getWeather(countryToShow.capital[0])
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [countryToShow])

  return (
    <div>
      <label>
        find countries{' '}
        <input
          value={search}
          onChange={handleSearchChange}
        />
      </label>

      {search !== '' && matches.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {search !== '' &&
        matches.length > 1 &&
        matches.length <= 10 && (
          <div>
            {matches.map(country => (
              <div key={country.name.common}>
                {country.name.common}{' '}
                <button
                  onClick={() =>
                    setSelectedCountry(country)
                  }
                >
                  Show
                </button>
              </div>
            ))}
          </div>
        )}

      {countryToShow && (
        <div>
          <h1>{countryToShow.name.common}</h1>

          <p>
            Capital: {countryToShow.capital?.[0]}
          </p>

          <p>
            Area: {countryToShow.area}
          </p>

          <h2>Languages</h2>

          <ul>
            {Object.values(
              countryToShow.languages || {}
            ).map(language => (
              <li key={language}>
                {language}
              </li>
            ))}
          </ul>

          <img
            src={countryToShow.flags.png}
            alt={`Flag of ${countryToShow.name.common}`}
            width="200"
          />

          {weather && (
            <div>
              <h2>
                Weather in {countryToShow.capital?.[0]}
              </h2>

              <p>
                Temperature {weather.main.temp} °C
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />

              <p>
                Wind {weather.wind.speed} m/s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App