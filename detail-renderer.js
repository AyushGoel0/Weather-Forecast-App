const { ipcRenderer } = require('electron');

// Replace with your actual API key
const API_KEY = '4d54ab43a35d5e6aba6232b4ba71631a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to fetch 5-day forecast
async function fetchForecast(cityName) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${cityName},IN&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching forecast for ${cityName}:`, error);
        throw error;
    }
}

// Function to format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to group forecast by day
function groupForecastByDay(forecastList) {
    const dailyForecasts = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                date: item.dt,
                temps: [],
                weather: item.weather[0],
                humidity: item.main.humidity,
                wind: item.wind.speed
            };
        }
        dailyForecasts[date].temps.push(item.main.temp);
    });
    
    // Calculate average temperature for each day
    const result = Object.values(dailyForecasts).map(day => ({
        ...day,
        avgTemp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps)
    }));
    
    // Return only the first 5 days
    return result.slice(0, 5);
}

// Function to create forecast card HTML
function createForecastCard(dayData) {
    const iconUrl = `http://openweathermap.org/img/wn/${dayData.weather.icon}@2x.png`;
    
    return `
        <div class="forecast-day">
            <div class="forecast-date">${formatDate(dayData.date)}</div>
            <img src="${iconUrl}" alt="${dayData.weather.description}" class="weather-icon">
            <div class="forecast-temp">${Math.round(dayData.avgTemp)}°C</div>
            <div class="forecast-description">${dayData.weather.description}</div>
            <div class="forecast-details">
                <div>Max: ${Math.round(dayData.maxTemp)}°C</div>
                <div>Min: ${Math.round(dayData.minTemp)}°C</div>
                <div>Humidity: ${dayData.humidity}%</div>
                <div>Wind: ${dayData.wind} m/s</div>
            </div>
        </div>
    `;
}

// Function to load forecast data
async function loadForecastData(cityName) {
    const forecastContainer = document.getElementById('forecastContainer');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const cityNameElement = document.getElementById('cityName');
    
    try {
        cityNameElement.textContent = `${cityName} - 5 Day Forecast`;
        loading.style.display = 'block';
        error.style.display = 'none';
        forecastContainer.innerHTML = '';
        
        const forecastData = await fetchForecast(cityName);
        const dailyForecasts = groupForecastByDay(forecastData.list);
        
        dailyForecasts.forEach(day => {
            forecastContainer.innerHTML += createForecastCard(day);
        });
        
        loading.style.display = 'none';
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = 'Error loading forecast data. Please try again.';
        console.error('Error loading forecast data:', err);
    }
}

// Listen for city data from main process
ipcRenderer.on('city-data', (event, data) => {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        const error = document.getElementById('error');
        error.style.display = 'block';
        error.textContent = 'Please set your OpenWeatherMap API key in detail-renderer.js';
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    loadForecastData(data.cityName);
});
