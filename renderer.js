const { ipcRenderer } = require('electron');

// Replace with your actual API key
const API_KEY = '4d54ab43a35d5e6aba6232b4ba71631a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// List of 5 Indian cities
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

// Function to fetch weather data for a city
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city},IN&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        throw error;
    }
}

// Function to create city card HTML
function createCityCard(cityData) {
    const iconUrl = `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;
    
    return `
        <div class="city-card" onclick="openDetailView('${cityData.name}')">
            <h2 class="city-name">${cityData.name}</h2>
            <img src="${iconUrl}" alt="${cityData.weather[0].description}" class="weather-icon">
            <div class="temperature">${Math.round(cityData.main.temp)}°C</div>
            <div class="weather-description">${cityData.weather[0].description}</div>
            <div class="temp-range">
                <span class="temp-max">Max: ${Math.round(cityData.main.temp_max)}°C</span>
                <span class="temp-min">Min: ${Math.round(cityData.main.temp_min)}°C</span>
            </div>
        </div>
    `;
}

// Function to load all cities weather data
async function loadWeatherData() {
    const citiesGrid = document.getElementById('citiesGrid');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        citiesGrid.innerHTML = '';
        
        const weatherPromises = cities.map(city => fetchWeatherData(city));
        const weatherData = await Promise.all(weatherPromises);
        
        weatherData.forEach(data => {
            citiesGrid.innerHTML += createCityCard(data);
        });
        
        loading.style.display = 'none';
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = 'Error loading weather data. Please check your API key and internet connection.';
        console.error('Error loading weather data:', err);
    }
}

// Function to open detail view
function openDetailView(cityName) {
    ipcRenderer.send('open-detail', { cityName });
}

// Load weather data when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        const error = document.getElementById('error');
        error.style.display = 'block';
        error.textContent = 'Please set your OpenWeatherMap API key in renderer.js';
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    loadWeatherData();
    
    // Refresh data every 10 minutes
    setInterval(loadWeatherData, 600000);
});

// Make openDetailView available globally
window.openDetailView = openDetailView;
