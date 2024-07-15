// API key for OpenWeatherMap
const APIkey = "98bbd42b08af4996d79ae480f5983193";

// Event listener for the search button to fetch weather data for the entered city
document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city); // Fetch weather data
        saveCity(city); // Save city to local storage
        renderSearchHistory(); // Update search history
    } else {
        alert("Please enter a city name");
    }
});

// Function to fetch current weather data and forecast data for the entered city
function getWeather(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

    fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data); // Display current weather data
            getForecast(data.coord.lat, data.coord.lon); // Fetch and display forecast data
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data: ' + error.message);
        });
}

// Function to display the current weather data on the page
function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    const tempC = data.main.temp;
    const tempF = (tempC * 9/5) + 32;
    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // Icon URL

    currentWeatherDiv.innerHTML = `
        <h2>${data.name}</h2>    
        <h3>Today: ${dayjs().format('dddd, MMMM D, YYYY')}</h3>
        <div class="separator"></div>
        <img src="${iconURL}" alt="${data.weather[0].description}">
        <div class="separator"></div>
        <p>Temp: ${tempC.toFixed(1)} °C / ${tempF.toFixed(1)} °F</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>${data.weather[0].description}</p>
    `;
    currentWeatherDiv.style.backgroundColor = '#d8b3f2'; // Set background color only once the data is displayed
}

// Function to fetch the forecast data for the entered city based on latitude and longitude
function getForecast(lat, lon) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;

    fetch(forecastURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data); // Display forecast data
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data: ' + error.message);
        });
}

// Function to display the 5-day forecast data on the page
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    const colors = ["#C9DDFF", "#ECB0E1", "#DE6C83", "#C1AAC0", "#2CF6B3"];

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const tempC = forecast.main.temp;
        const tempF = (tempC * 9/5) + 32;
        const day = dayjs(forecast.dt_txt).format('dddd');
        const date = dayjs(forecast.dt_txt).format('MMMM D, YYYY');
        const iconURL = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`; // Icon URL

        forecastDiv.innerHTML += `
            <div class="forecast-item" style="background-color: ${colors[i / 8]}">
                <h3>${day}</h3>
                <div class="date">${date}</div>
                <img src="${iconURL}" alt="${forecast.weather[0].description}">
                <div class="separator"></div>
                <p>Temp: ${tempC.toFixed(1)} °C / ${tempF.toFixed(1)} °F</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
                <p>Humidity: ${forecast.main.humidity} %</p>
                <p>${forecast.weather[0].description}</p>
            </div>
        `;
    }
}

// Function to save the searched city to local storage
function saveCity(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.unshift(city); // Add new city to the beginning of the array
        if (cities.length > 12) {
            cities.pop(); // Remove the oldest city if there are more than 6
        }
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

// Function to render the search history buttons based on cities stored in local storage
function renderSearchHistory() {
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '';
    let cities = JSON.parse(localStorage.getItem('cities')) || [];

    if (cities.length === 0) {
        cities.push('Sydney, Australia'); // Default city button if no search history
    }

    cities.forEach(city => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'btn-block', 'mb-2');
        button.textContent = city;
        button.addEventListener('click', () => getWeather(city)); // Fetch weather data when button is clicked
        searchHistoryDiv.appendChild(button);
    });
}

// Render search history buttons when the page loads
document.addEventListener('DOMContentLoaded', renderSearchHistory);

// Function to update the clock every second
function updateClock() {
    const now = dayjs().format('HH:mm:ss');
    document.getElementById('clock').textContent = now;
}

// Update the clock every second
setInterval(updateClock, 1000);
