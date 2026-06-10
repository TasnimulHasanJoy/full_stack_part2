import { useState, useEffect } from 'react'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
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
        <p>
          Too many matches, specify another filter
        </p>
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
            Capital:{' '}
            {countryToShow.capital?.[0]}
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
        </div>
      )}
    </div>
  )
}

export default App