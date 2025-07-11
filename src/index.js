import "./styles.css"

const API_KEY = 'XGPJUFADUE2CEMDK4M2RWZ27J';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

function processWeatherData(rawData) {
  const current = rawData.currentConditions;

  return {
    location: rawData.resolvedAddress,
    temperature: current.temp,
    conditions: current.conditions,
    humidity: current.humidity,
    windSpeed: current.windspeed,
    icon: current.icon,
    time: current.datetime,
  };
}

function displayWeather(weather) {
  const container = document.getElementById('weather-display');
  container.innerHTML = `
    <h2>Weather in ${weather.location}</h2>
    <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
    <p><strong>Conditions:</strong> ${weather.conditions}</p>
    <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.windSpeed} km/h</p>
    <p><strong>Time:</strong> ${weather.time}</p>
  `;
}

async function fetchWeather(location) {
  const url = `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&include=current`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    const weather = processWeatherData(rawData);

    displayWeather(weather); // show in UI instead of console
    return weather;
  } catch (error) {
    console.error('Failed to fetch weather:', error.message);
    const container = document.getElementById('weather-display');
    container.innerHTML = `<p style="color: red;">Could not retrieve weather for "${location}".</p>`;
    return null;
  }
}

const form = document.getElementById('location-form');
const input = document.getElementById('location-input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = input.value.trim();

  if (location) {
    fetchWeather(location);
  } else {
    console.warn('Please enter a location.');
  }

  input.value = '';
});
