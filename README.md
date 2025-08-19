# Weather Forecast App

An Electron-based weather forecast application that displays weather information for 5 major Indian cities.

## Features

- **Home Screen**: Displays current weather with max/min temperatures for 5 Indian cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata)
- **Detail Screen**: Shows 5-day weather forecast for selected city
- Beautiful UI with weather icons and temperature displays
- Auto-refresh every 10 minutes

## Prerequisites

1. Node.js and npm installed on your system
2. An OpenWeatherMap API key (free tier available)

## Setup Instructions

1. **Get OpenWeatherMap API Key**:
   - Go to https://home.openweathermap.org/users/sign_up
   - Register for a free account
   - Go to your API keys section
   - Copy your API key (Note: It takes 15-20 minutes for the key to activate)

2. **Configure the App**:
   - Open `renderer.js` and replace `YOUR_API_KEY_HERE` with your actual API key
   - Open `detail-renderer.js` and replace `YOUR_API_KEY_HERE` with your actual API key

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the App**:
   ```bash
   npm start
   ```
   
   **Note**: The Electron app window should open automatically. If you don't see the window:
   - Check your taskbar for the app icon
   - Try Alt+Tab to switch between windows
   - Make sure no antivirus is blocking Electron

## How to Use

1. When the app starts, you'll see the home screen with 5 Indian cities
2. Each city card displays:
   - City name
   - Current weather icon
   - Current temperature
   - Weather description
   - Max and Min temperatures for the day

3. Click on any city card to open the detail view
4. The detail view shows a 5-day forecast with:
   - Date
   - Weather icon
   - Average temperature
   - Weather description
   - Max/Min temperatures
   - Humidity
   - Wind speed

5. Click the "Close" button to return to the home screen

## Project Structure

```
weather-forecast-app/
├── main.js              # Main Electron process
├── index.html           # Home screen HTML
├── detail.html          # Detail screen HTML
├── renderer.js          # Home screen renderer process
├── detail-renderer.js   # Detail screen renderer process
├── styles.css           # Styling for both screens
├── package.json         # Project configuration
└── README.md           # This file
```

## Technologies Used

- Electron
- OpenWeatherMap API
- HTML/CSS/JavaScript
- Node.js

## Notes

- The app fetches weather data for Indian cities only
- Weather data is refreshed automatically every 10 minutes
- Make sure you have an active internet connection
- The free tier of OpenWeatherMap API has rate limits
