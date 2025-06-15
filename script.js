function showError(elementId, message) {
  document.getElementById(
    elementId
  ).innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle me-1"></i>${message}</div>`;
}

async function getUserLocation() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/user/location");
    const userLocation = await response.json();

    if (response.ok) {
      document.getElementById("location-content").innerHTML = `
        <div class="text-center">
          <h5><i class="fas fa-map-marker-alt text-primary me-2"></i>${
            userLocation.city
          }</h5>
          <p class="mb-0">${
            userLocation.region ? userLocation.region + ", " : ""
          }${userLocation.country}</p>
          <small class="text-muted">Lat: ${parseFloat(userLocation.lat).toFixed(
            2
          )}, Lon: ${parseFloat(userLocation.lon).toFixed(2)}</small>
        </div>`;

      getWeather();
    } else {
      throw new Error(userLocation.error || "Location fetch failed");
    }
  } catch (error) {
    console.error("Location error:", error);
    showError("location-content", "Unable to fetch location");
  }
}

async function getCurrentTime() {
  try {
    const dateTime = new Date();
    const timeString = dateTime.toLocaleTimeString();
    const dateString = dateTime.toLocaleDateString();

    document.getElementById("time-content").innerHTML = `
      <div class="time-display">
        <div><i class="fas fa-clock me-2"></i>${timeString}</div>
        <small class="text-muted">${dateString}</small>
      </div>`;
  } catch (error) {
    console.error("Time error:", error);
    showError("time-content", "Unable to fetch time");
  }
}

async function getWeather() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/weather");
    const weather = await response.json();

    if (response.ok) {
      const temp = Math.round(weather.temperature);
      const windSpeed = weather.windspeed;

      let weatherIcon = "fas fa-sun";
      let weatherDesc = "Clear";

      if (weather.weathercode >= 80) {
        weatherIcon = "fas fa-cloud-rain";
        weatherDesc = "Rainy";
      } else if (weather.weathercode >= 60) {
        weatherIcon = "fas fa-cloud-drizzle";
        weatherDesc = "Drizzle";
      } else if (weather.weathercode >= 45) {
        weatherIcon = "fas fa-smog";
        weatherDesc = "Foggy";
      } else if (weather.weathercode >= 20) {
        weatherIcon = "fas fa-cloud";
        weatherDesc = "Cloudy";
      }

      document.getElementById("weather-content").innerHTML = `
        <div class="weather-icon text-primary">
            <i class="${weatherIcon}"></i>
        </div>
        <div class="temperature">${temp}°C</div>
        <div class="mb-2">${weatherDesc}</div>
        <small class="text-muted">
            <i class="fas fa-wind me-1"></i>Wind: ${windSpeed} km/h
        </small>`;
    } else {
      throw new Error(weather.error || "Weather fetch failed");
    }
  } catch (error) {
    console.error("Weather error:", error);
    showError("weather-content", "Unable to fetch weather");
  }
}

// Get currency exchange rates
async function getCurrencyRates() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/currency/rates");
    const data = await response.json();

    if (response.ok) {
      const currencies = ["PKR", "JPY", "CNY", "KRW"];
      let currencyHtml = "";

      currencies.forEach((currency) => {
        if (data[currency]) {
          const rate = parseFloat(data[currency]).toFixed(2);
          currencyHtml += `
            <div class="currency-item">
                <span class="currency-code">${currency}</span>
                <span class="currency-rate">${rate}</span>
            </div>`;
        }
      });

      document.getElementById("currency-content").innerHTML = currencyHtml;
    } else {
      throw new Error(data.error || "Currency fetch failed");
    }
  } catch (error) {
    console.error("Currency error:", error);
    showError("currency-content", "Unable to fetch exchange rates");
  }
}

// Get quote of the day
async function getQuote() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/quote");
    const data = await response.json();

    if (response.ok && data[0]) {
      document.getElementById("quote-content").innerHTML = `
        <div class="quote-text">"${data[0].quote}"</div>
        <div class="quote-author">— ${data[0].author}</div>`;
    } else {
      throw new Error(data.error || "Quote fetch failed");
    }
  } catch (error) {
    console.error("Quote error:", error);
    showError("quote-content", "Unable to fetch quote");
  }
}

// Get fun fact
async function getFunFact() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/fact");
    const data = await response.json();

    if (response.ok) {
      document.getElementById("fact-content").innerHTML = `
        <div class="fact-text">${data.text}</div>`;
    } else {
      throw new Error(data.error || "Fact fetch failed");
    }
  } catch (error) {
    console.error("Fun fact error:", error);
    showError("fact-content", "Unable to fetch fun fact");
  }
}

// Get joke
async function getJoke() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/joke");
    const data = await response.json();

    if (response.ok) {
      document.getElementById("joke-content").innerHTML = `
        <div class="joke-text">${data.joke}</div>`;
    } else {
      throw new Error(data.error || "Joke fetch failed");
    }
  } catch (error) {
    console.error("Joke error:", error);
    showError("joke-content", "Unable to fetch joke");
  }
}

// Get activity suggestion
async function getActivitySuggestion() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/activity");
    const data = await response.json();

    if (response.ok) {
      document.getElementById("activity-content").innerHTML = `
        <div class="activity-suggestion">
            <h6><i class="fas fa-star text-warning me-2"></i>Suggested Activity</h6>
            <p class="mb-2">${data.activity}</p>
            <small class="text-muted">
                <i class="fas fa-users me-1"></i>Participants: ${data.participants} |
                <i class="fas fa-tag me-1"></i>Type: ${data.type} |
                <i class="fa fa-money me-1"></i>Price: ${data.price}
            </small>
        </div>`;
    } else {
      throw new Error(data.error || "Activity fetch failed");
    }
  } catch (error) {
    console.error("Activity error:", error);
    showError("activity-content", "Unable to fetch activity suggestion");
  }
}

// Get pet images
async function getPetImages() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/pet");
    const pet = await response.json();

    if (response.ok) {
      const petIcon = pet.type === "Cat" ? "fas fa-cat" : "fas fa-dog";
      document.getElementById("pet-content").innerHTML = `
        <h6><i class="${petIcon} me-2"></i>Daily ${pet.type}</h6>
        <img src="${pet.pet}" alt="Daily ${pet.type}" class="pet-image" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">`;
    } else {
      throw new Error(pet.error || "Pet fetch failed");
    }
  } catch (error) {
    console.error("Pet images error:", error);
    showError("pet-content", "Unable to fetch pet images");
  }
}

// Refresh all data
async function refreshAllData() {
  const refreshBtn = document.querySelector(".refresh-btn");
  refreshBtn.classList.add("spinning");

  const loadingElements = [
    "location-content",
    "time-content",
    "weather-content",
    "currency-content",
    "quote-content",
    "fact-content",
    "joke-content",
    "activity-content",
    "pet-content",
  ];

  loadingElements.forEach((id) => {
    document.getElementById(id).innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Loading...';
  });

  await Promise.all([
    getUserLocation(),
    getCurrentTime(),
    getCurrencyRates(),
    getQuote(),
    getFunFact(),
    getJoke(),
    getActivitySuggestion(),
    getPetImages(),
  ]);

  refreshBtn.classList.remove("spinning");
}

// Initialize the dashboard
async function initDashboard() {
  await refreshAllData();
  setInterval(getCurrentTime, 1000);
}

document.addEventListener("DOMContentLoaded", initDashboard);
