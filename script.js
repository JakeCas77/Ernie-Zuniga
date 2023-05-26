// Open Weather Map API key 
var myKey = "e1369e1ec02e5d6e28061d31da421f7c";

var searchArray = JSON.parse(localStorage.getItem("last-search")) || [];

function search(searchTerm) {
  // current city uv
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=imperial&appid=${myKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // City name
      document.getElementById('name').innerHTML = data.name;
      // pass in temperature value
      document.getElementById('temp').innerHTML = Math.floor(data.main.temp);
      // Humidity
      document.getElementById('hum').innerHTML = data.main.humidity;
      // Wind speed
      document.getElementById('wind').innerHTML = data.wind.speed;
      // Weather icon
      var currentIcon = data.weather[0].icon;
      document.getElementById('current-icon').setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
      // Description
      document.getElementById('description').innerHTML = data.weather[0].description;

    //   Longitude and Latitude(coordinates)
      var lon = data.coord.lon;
      var lat = data.coord.lat;

      // Call API to fetch Uv index  
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${myKey}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          document.getElementById('uvIndex').innerHTML = data.current.uvi;

          // Adding class to uv index 
          if (document.getElementById('uvIndex').innerHTML < 3) {
            document.getElementById('uvIndex').classList.add("low-uv");
            document.getElementById('uvIndex').classList.remove("class", "moderate-uv");
            document.getElementById('uvIndex').classList.remove("class", "high-uv");
          } else if (document.getElementById('uvIndex').innerHTML >= 3 && document.getElementById('uvIndex').innerHTML <= 6) {
            document.getElementById('uvIndex').classList.add("class", "moderate-uv");
            document.getElementById('uvIndex').classList.remove("class", "low-uv");
            document.getElementById('uvIndex').classList.remove("class", "high-uv");
          } else {
            document.getElementById('uvIndex').classList.add("class", "high-uv");
            document.getElementById('uvIndex').classList.remove("class", "moderate-uv");
            document.getElementById('uvIndex').classList.remove("class", "low-uv");
          }
        })

      // 5 days fetch results
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${myKey}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // 12:00:00 time block new data array
          var fiveDayArray = data.list.filter(day => day.dt_txt.includes('12:00:00'));
          // 5 day values 
          for (var i = 0; i < fiveDayArray.length; i++) {
            // date 
            var dateCard1 = new Date(fiveDayArray[i].dt_txt).toLocaleString().split(',')[0];
            document.getElementById(`date-card-${i}`).innerHTML = dateCard1;
            var iconId = fiveDayArray[i].weather[0].icon;
            // weather icon
            document.getElementById(`img-card-${i}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
            //Temperature
            document.getElementById(`temp-card-${i}`).innerHTML = Math.floor(fiveDayArray[i].main.temp);
            // Humidity
            document.getElementById(`hum-card-${i}`).innerHTML = fiveDayArray[i].main.humidity;
          }
        })
// Error Message
    }).catch(function () {
      document.getElementById('name').innerHTML = "City not found!  Please try again.";
    });

  // display current date
  var today = new Date();
  document.getElementById('current-date').innerHTML = today.toDateString();
  // end search function
}

// Popular City presented on initial load
function onLoad() {
  if (localStorage.getItem("last-search") === null) {
    searchTerm = "Miami";
    search(searchTerm);
    localStorage.clear();
  } else {
    search(searchArray[searchArray.length - 1]);
    renderHistory();
  }
}

onLoad()

// History of searches
function renderHistory() {
  var quickSearchList = document.querySelector(".collection");
  quickSearchList.innerHTML = '';
  searchArray.forEach(function (city) {
    // create <a> element 
    var searchHistoryEl = document.createElement("a");
    searchHistoryEl.setAttribute("href", "#!");
    searchHistoryEl.className = "collection-item";
    searchHistoryEl.classList.add("search-hist-el")
    searchHistoryEl.innerHTML = city.toUpperCase();
    quickSearchList.appendChild(searchHistoryEl);
  });
}


// Save Search History 
function saveSearchHistory(city) {
  if (!searchArray.includes(city)) {
    searchArray.push(city);
    localStorage.setItem("last-search", JSON.stringify(searchArray));
    console.log(searchArray);
  }
}

// Delete search history
function deleteSearchHistory() {
  var searchHist = document.querySelector(".collection");
  searchHist.innerHTML = "";
}

// clears text from search input
document.getElementById('search-form').addEventListener("submit", function (event) {
  event.preventDefault();
  var searchInput = document.getElementById("search-input");
  var searchTerm = searchInput.value.toLowerCase().trim();
  console.log(searchTerm);
  search(searchTerm);
  saveSearchHistory(searchTerm);
  searchInput.value = "";
  renderHistory();
});

// search history click 
document.querySelector(".collection").addEventListener("click", function (event) {
  event.preventDefault();
  search(event.target.textContent);
});

// delete history button searchHistArray
document.getElementById('delete').addEventListener("click", function () {
  searchArray = [];
  localStorage.clear();
  deleteSearchHistory();
});