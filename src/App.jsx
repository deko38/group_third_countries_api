import { useEffect, useState } from "react";
import axios from "axios";
import classes from './module/App.module.css';

const App = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        axios.get(`https://restcountries.com/v3.1/all`)
            .then(response => {
                setCountries(response.data);
                setFilteredCountries(response.data);
            })
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const searchHandler = (event) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);
        filterCountries(value, region);
    };

    const regionHandler = (event) => {
        const value = event.target.value;
        setRegion(value);
        filterCountries(search, value);
    };

    const filterCountries = (searchTerm, regionFilter) => {
        const filtered = countries.filter(country =>
            (searchTerm ? country.name.common.toLowerCase().includes(searchTerm) : true) &&
            (regionFilter ? country.region.toLowerCase() === regionFilter.toLowerCase() : true)
        );
        setFilteredCountries(filtered);
    };

    const viewCountryDetails = (country) => {
        setSelectedCountry(country);
    };

    const backToList = () => {
        setSelectedCountry(null);
    };

    return (
        <div className={classes['app']}>
            {selectedCountry ? (
                <div className={classes['details']}>
                    <button onClick={backToList} className={classes['back-button']}>
                        ← Back
                    </button>
                    <div className={classes['details-container']}>
                        <img src={selectedCountry.flags.png} alt="flag" className={classes['flag']} />
                        <div className={classes['info']}>
                            <h2>{selectedCountry.name.common}</h2>
                            <p>Native Name: {Object.values(selectedCountry.name.nativeName || {})[0]?.common || "N/A"}</p>
                            <p>Population: {selectedCountry.population.toLocaleString()}</p>
                            <p>Region: {selectedCountry.region}</p>
                            <p>Sub Region: {selectedCountry.subregion}</p>
                            <p>Capital: {selectedCountry.capital?.[0] || "N/A"}</p>
                            <p>Top Level Domain: {selectedCountry.tld?.[0] || "N/A"}</p>
                            <p>Currencies: {Object.values(selectedCountry.currencies || {}).map(c => c.name).join(', ') || "N/A"}</p>
                            <p>Languages: {Object.values(selectedCountry.languages || {}).join(', ') || "N/A"}</p>
                            <p>Border Countries: {selectedCountry.borders?.map(border => (
                                <span key={border} className={classes['border-country']}>
                                    {countries.find(c => c.cca3 === border)?.name.common || border}
                                </span>
                            )) || "None"}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={classes['navbar']}>
                        <h1>Where In The World?</h1>
                        <button className={classes['lightmode']}>Dark Mode</button>
                    </div>

                    <div className={classes['top-stuff']}>
                        <input 
                            placeholder="Search for a country..." 
                            className={classes['search']} 
                            onChange={searchHandler} 
                        />
                        <select className={classes['dropdown']} onChange={regionHandler}>
                            <option value="">Filter by Region</option>
                            <option value="Africa">Africa</option>
                            <option value="Americas">Americas</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="Oceania">Oceania</option>
                        </select>
                    </div>

                    <div className={classes['countries-container']}>
                        {filteredCountries.map((country, index) => (
                            <div 
                                key={index} 
                                className={classes['country-card']} 
                                onClick={() => viewCountryDetails(country)}
                            >
                                <img src={country.flags?.png} alt={`${country.name.common} flag`} />
                                <div>
                                    <h3>{country.name.common}</h3>
                                    <p>Population: {country.population.toLocaleString()}</p>
                                    <p>Region: {country.region}</p>
                                    <p>Capital: {country.capital?.[0] || "N/A"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
