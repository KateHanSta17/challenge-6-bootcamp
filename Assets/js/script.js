const APIkey = "98bbd42b08af4996d79ae480f5983193";

// Search button click event listener to get weather data for the city entered in the input field 
// and save the city to local storage and render the search history buttons on the page
document.getElementById('search-button').addEventListener('click', function() { 
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
        saveCity(city);
        renderSearchHistory();
    } else {
        alert("Please enter a city name");
    }
});

// Event listener for suggested cities
document.querySelectorAll('#suggested-cities button').forEach(button => {
    button.addEventListener('click', function() {
        const city = this.textContent;
        getWeather(city);
    });
});

function getWeather(city) { 
    // Fetch current weather data and forecast data for the city entered by the user using the OpenWeatherMap API
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

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
        .catch(error => { 
            // Error handling for invalid city name or other fetch errors
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data: ' + error.message);
        });
}

function displayCurrentWeather(data) { 
    // Display the current weather data for the city entered by the user on the page
    const currentWeatherDiv = document.getElementById('current-weather');
    const tempC = data.main.temp;
    const tempF = (tempC * 9/5) + 32;

    currentWeatherDiv.innerHTML = `
        <h2>${data.name} (${dayjs().format('dddd, MMMM D, YYYY')})</h2>
        <p>Temperature: ${tempC.toFixed(1)} °C / ${tempF.toFixed(1)} °F</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>${data.weather[0].description}</p>
    `;
    currentWeatherDiv.style.backgroundColor = '#d8b3f2';
}

function getForecast(lat, lon) { 
    // Fetch forecast data for the city entered by the user using the OpenWeatherMap API based on the latitude and longitude of the city
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;

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
            // Error handling for invalid city name or other fetch errors for forecast data
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data: ' + error.message);
        });
}

function displayForecast(data) { 
    // data.list is an array of forecast items for every 3 hours for the next 5 days (40 items total)
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    const colors = ["#C9DDFF", "#ECB0E1", "#DE6C83", "#C1AAC0", "#2CF6B3"];

    for (let i = 0; i < data.list.length; i += 8) { 
        // Display only 1 forecast per day (every 8th item) for the next 5 days (40 / 8 = 5)
        const forecast = data.list[i];
        const tempC = forecast.main.temp;
        const tempF = (tempC * 9/5) + 32;
        const day = dayjs(forecast.dt_txt).format('dddd');
        const date = dayjs(forecast.dt_txt).format('MMMM D, YYYY');

        forecastDiv.innerHTML += `
            <div class="forecast-item" style="background-color: ${colors[i / 8]}">
                <h3>${day}</h3>
                <div class="date">${date}</div>
                <div class="separator"></div>
                <p>Temperature: ${tempC.toFixed(1)} °C / ${tempF.toFixed(1)} °F</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
                <p>Humidity: ${forecast.main.humidity} %</p>
                <p>${forecast.weather[0].description}</p>
            </div>
        `;
    }
}

function saveCity(city) {
    // Save the city name to local storage if it is not already saved in the local storage array of cities
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function renderSearchHistory() {
    // Render the search history buttons on the page based on the cities saved in local storage array of cities
    const searchHistoryDiv = document.getElementById('search-history');
    if (searchHistoryDiv) {
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
}

// Render the search history buttons on the page when the page loads or is refreshed based on the cities saved in local storage array of cities
document.addEventListener('DOMContentLoaded', renderSearchHistory);

// Clock functionality
function updateClock() {
    const now = dayjs().format('HH:mm:ss');
    document.getElementById('clock').textContent = now;
}

// Update the clock every second
setInterval(updateClock, 1000);
