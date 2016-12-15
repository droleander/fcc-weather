function displayWeather(curLoc, curIcon, curWeather, curTemp, curWind) {
  $("#dspLoc").html(curLoc);
  $("#dspIcon").attr("src", curIcon);
  $("#dspWeather").html(curWeather);
  $("#dspTempValue").html(curTemp);
  $("#dspWindValue").html(curWind);
}

function getWeatherData() {
  /* fetch geolocation data */
  $.getJSON("https://cors-anywhere.herokuapp.com/http://freegeoip.net/json/" + myip, function (geoData) {
    var curLat = JSON.stringify(geoData.latitude);
    var curLon = JSON.stringify(geoData.longitude);
    var curIcon = "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/w/";
    var APIKey = "125276a1bb7bead3bcc713aa6a93c9a2";
    var APICoord = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather";
    // fetch JSON data from API
    $.ajax({
      url: APICoord,
      data: {
        lat: curLat,
        lon: curLon,
        units: 'metric',
        appid: APIKey
      },
      dataType: 'json',
      success: function (json) {
        var curLoc = JSON.stringify(json.name);
        curLoc = curLoc.substring(1, curLoc.length - 1);
        
        curIcon = curIcon + JSON.stringify(json.weather[0].icon).substr(1, json.weather[0].icon.length) + '.png';
        
        var curTemp = JSON.stringify(json.main.temp);
        
        var curWeather = JSON.stringify(json.weather[0].description);
        curWeather = curWeather.substring(1, curWeather.length - 1);
        curWeather = curWeather.substr(0, 1).toUpperCase() + curWeather.substr(1);
        
        var curWind = JSON.stringify(json.wind.speed);
        
        /* display weather info */
        displayWeather(curLoc, curIcon, curWeather, curTemp, curWind);
      },
      error: function(err) {
        alert(err.statusText);
      }
    });
  });
}

function convertTemp() {
  var bttnValue = $("#dspButton").attr("value");
  var currTemp = parseFloat($("#dspTempValue").html());
  /* C = (5 / 9) * (F - 32); F = ((9 / 5) * C) + 32; */
  if (bttnValue === "degC") {
    currTemp = parseFloat((((9 / 5) * currTemp) + 32).toFixed(2));

    /* display info */
    $("#dspTempUnit").html("F");
    $("#dspButton").attr("value", "degF");
    $("#dspButton").html("&deg;C");

  } else {
    currTemp = parseFloat(((5 / 9) * (currTemp - 32)).toFixed(2));

    /* display info */
    $("#dspTempUnit").html("C");
    $("#dspButton").attr("value", "degC");
    $("#dspButton").html("&deg;F");
  }

  $("#dspTempValue").html(currTemp);

}

$(document).ready(function () {
  getWeatherData();
});