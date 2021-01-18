var cityLat, cityLon;

const api = {
    key: '52272358b1bbd36f9820c327ca4fe861',
    base: "https://api.openweathermap.org/data/2.5/",
    historic: "https://api.openweathermap.org/data/2.5/onecall"
}

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    weatherBalloonLatLon(latitude, longitude);
    historicDataLatLon(latitude, longitude);
}

function weatherBalloonLatLon(lat, lon) {
    fetch(api.base+'weather?lat='+lat+'&lon='+lon+'&appid='+api.key)  
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
      displayData(data);
    })
}

function citySearch() {
    city = document.getElementById("city").value;
    weatherBalloonCity(city);
    return false;
}

function weatherBalloonCity(city) {
    fetch(api.base+'weather?q='+city+'&appid='+api.key)  
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
        displayData(data);
    })
}

function displayData(data) {
    document.getElementById("lat").innerHTML = data.coord.lat;
    cityLat = data.coord.lat;
    document.getElementById("lon").innerHTML = data.coord.lon;
    cityLon = data.coord.lon;

    document.getElementById("cityName").innerHTML = data.name;
    document.getElementById("mainWeather").innerHTML = data.weather[0].main;
    document.getElementById("description").innerHTML = data.weather[0].description;

    var iconCode = data.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    document.getElementById("weatherIcon").src = iconUrl;

    document.getElementById("clouds").innerHTML = data.clouds.all;
    document.getElementById("windSpeed").innerHTML = data.wind.speed;
    document.getElementById("pressure").innerHTML = data.main.pressure;
    document.getElementById("humidity").innerHTML = data.main.humidity;

    document.getElementById("temp").innerHTML = data.main.temp;
    document.getElementById("tempC").innerHTML = KtoC(data.main.temp);
    document.getElementById("tempF").innerHTML = KtoF(data.main.temp);

    historicDataCity(city);
}

function historicDataLatLon(lat, lon) {
    var now = new Date(); 
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    var dt = 0; 
    fetch(api.historic+'?lat='+lat+'&lon='+lon+'&appid='+api.key)  
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
      displayHistoricData(data);
    })
}

function historicDataCity(city) {
    lat = cityLat;
    lon = cityLon;
    historicDataLatLon(lat, lon);
}

function displayHistoricData(data) {
    var futureTemp = document.getElementsByClassName("futureTemp");
    var futureDesc = document.getElementsByClassName("futureDesc");
    var futureWeatherIcon = document.getElementsByClassName("futureWeatherIcon");
    for(var i=0;i<8;i++) {
        var iconCode = data.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

        futureDesc[i].innerHTML = data.daily[i].weather[0].description;
        futureWeatherIcon[i].src = iconUrl
        futureTemp[i].innerHTML = data.daily[i].temp.day
    }
}

function KtoC(temp) {
    return (temp-272.15).toFixed(2);
}

function KtoF(temp) {
    tempC = KtoC(temp)
    return ((tempC*9/5)+32).toFixed(2);
}