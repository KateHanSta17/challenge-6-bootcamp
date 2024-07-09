const APIkey = "98bbd42b08af4996d79ae480f5983193";

document.getElementById('search-button').addEventListener('click', function() { 
    // Search button click event listener to get weather data for the city entered in the input field 
    // and save the city to local storage and render the search history buttons on the page
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
        saveCity(city);
        renderSearchHistory();
    } else {
        alert("Please enter a city name");
    }
});

function getWeather(city) { // Fetch current weather data and forecast data for the city entered by the user using the OpenWeatherMap API
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
    
    fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found'); // Throw an error if the city name is invalid or not found in the API response
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => { // Error handling for invalid city name or other fetch errors
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data: ' + error.message);
        });
}

function displayCurrentWeather(data) { // Display the current weather data for the city entered by the user on the page
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>
    `;
}

function getForecast(lat, lon) { // Fetch forecast data for the city entered by the user using the OpenWeatherMap API based on the latitude and longitude of the city
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`;
    
    fetch(forecastURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching forecast data'); // Throw an error if there is an error fetching forecast data from the API response
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data: ' + error.message); // Error handling for invalid city name or other fetch errors for forecast data
        });
}

function displayForecast(data) { // data.list is an array of forecast items for every 3 hours for the next 5 days (40 items total)
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) { // Display only 1 forecast per day (every 8th item) for the next 5 days (40 / 8 = 5)
        const forecast = data.list[i];
        forecastDiv.innerHTML += `
            <div class="col-md-4">
                <div class="forecast-item">
                    <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                    <p>Temperature: ${forecast.main.temp} °F</p>
                    <p>Wind: ${forecast.wind.speed} MPH</p>
                    <p>Humidity: ${forecast.main.humidity} %</p>
                </div>
            </div>
        `;
    }
}

function saveCity(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities)); // Save the city name to local storage if it is not already saved in the local storage array of cities
    }
}

function renderSearchHistory() { // Render the search history buttons on the page based on the cities saved in local storage array of cities 
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '';
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(city => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'btn-sm', 'mr-2', 'mb-2');
        button.textContent = city;
        button.addEventListener('click', () => getWeather(city));
        searchHistoryDiv.appendChild(button);
    });
}

document.addEventListener('DOMContentLoaded', renderSearchHistory); // Render the search history buttons on the page when the page loads or is refreshed based on the cities saved in local storage array of cities

// Clock functionality
function updateClock() {
    const now = dayjs().format('HH:mm:ss');
    document.getElementById('clock').textContent = now;
}

// Update the clock every second
setInterval(updateClock, 1000);
