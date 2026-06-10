import { useState, useEffect } from 'react'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const matches = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

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
              <p key={country.name.common}>
                {country.name.common}
              </p>
            ))}
          </div>
        )}

      {search !== '' && matches.length === 1 && (
        <div>
          <h1>{matches[0].name.common}</h1>

          <p>
            Capital: {matches[0].capital?.[0]}
          </p>

          <p>
            Area: {matches[0].area}
          </p>

          <h2>Languages</h2>

          <ul>
            {Object.values(
              matches[0].languages || {}
            ).map(language => (
              <li key={language}>
                {language}
              </li>
            ))}
          </ul>

          <img
            src={matches[0].flags.png}
            alt={`Flag of ${matches[0].name.common}`}
            width="200"
          />
        </div>
      )}
    </div>
  )
}

export default App