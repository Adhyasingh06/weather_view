const apiKey = "fc3c1626f4383e9ddaba75df34bdcc04"; 


async function getLonAndLat(city, weatherDataSection) {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(geoURL);

  if (!response.ok) {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Failed to fetch location</h2>
        <p>Status: ${response.status}</p>
      </div>
    `;
    return null;
  }

  const data = await response.json();
  if (data.length === 0) {
    weatherDataSection.innerHTML = `
      <div>
        <h2>City Not Found!</h2>
        <p>Try entering a valid city name.</p>
      </div>
    `;
    return null;
  }

  return { lat: data[0].lat, lon: data[0].lon };
}


async function getWeatherData(lon, lat) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(weatherURL);

  if (!response.ok) {
    console.log("Bad response!", response.status);
    return null;
  }

  const data = await response.json();
  return data;
}


async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  const geoData = await getLonAndLat(searchInput, weatherDataSection);
  if (!geoData) return;

  const weatherData = await getWeatherData(geoData.lon, geoData.lat);
  if (!weatherData) return;

  
  weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" 
         alt="${weatherData.weather[0].description}" width="100" />
    <div>
      <h2>${weatherData.name}</h2>
      <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp - 273.15)}°C</p>
      <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
    </div>
  `;
}
