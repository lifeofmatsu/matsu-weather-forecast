const apiKey = 'dc4841c2628866e900a9555b5927693d';
const searchHistory = [];

function searchWeather() {
    const cityInput = document.querySelector('.search-input').value;

    if (cityInput) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput)}&appid=${apiKey}&units=standard`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
                fetchForecast(data.coord.lat, data.coord.lon);
                addToSearchHistory(cityInput);
            })
            .catch(error => {
                if (error.message === 'City not found') {
                    alert('City not found. Please enter a valid city name.');
                } else {
                    console.error('Error fetching current weather:', error.message);
                }
            });
    }
}

function fetchForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available');
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error.message));
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather: ${data.name}, ${data.sys.country}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${convertTemperature(data.main.temp)} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${convertWindSpeed(data.wind.speed)} MPH</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear the previous forecast content

    // Filter out the current day and limit to the next 5 days
    const filteredForecast = data.daily.slice(1, 6);

    // Add the forecast header before the loop
    const forecastHeader = '<h2>5-Day Forecast</h2>';
    forecastDiv.innerHTML += forecastHeader;

    for (let i = 0; i < filteredForecast.length; i++) {
        const forecast = filteredForecast[i];
        const forecastItem =
            `<div>
                <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${convertTemperature(forecast.temp.day)} °F</p>
                <p>Humidity: ${forecast.humidity}%</p>
                <p>Wind Speed: ${convertWindSpeed(forecast.wind_speed)} MPH</p>
            </div>`;

        forecastDiv.innerHTML += forecastItem;
    }
}

function showSearchHistory() {
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '';

    if (searchHistory.length > 0) {
        searchHistoryDiv.style.display = 'block';

        searchHistory.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.className = 'city-card';
            historyItem.textContent = city;
            historyItem.onclick = () => {
                document.querySelector('.search-input').value = city;
                searchWeather();
            };
            searchHistoryDiv.appendChild(historyItem);
        });
    }
}


function addToSearchHistory(city) {
    // Ensure that the city is not already in the search history
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
    }

    // Clear the search history dropdown
    document.getElementById('search-history').innerHTML = '';

    // Update the search history dropdown only if there are items in the history
    if (searchHistory.length > 0) {
        const searchHistoryDiv = document.getElementById('search-history');
        searchHistoryDiv.style.display = 'none';  // Hide the dropdown

        // Add items to the dropdown
        searchHistory.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.className = 'city-card';
            historyItem.textContent = city;
            historyItem.onclick = () => {
                document.querySelector('.search-input').value = city;
                searchWeather();
            };
            searchHistoryDiv.appendChild(historyItem);
        });
    }
}

function convertTemperature(kelvin) {
    return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
}

function convertWindSpeed(meterPerSec) {
    return (meterPerSec * 2.23694).toFixed(2);
}