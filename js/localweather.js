// Temporary CORS Workaround //
// https://crossorigin.me/
// https://cors-anywhere.herokuapp.com/


$(document).ready(() => getGeoInfo());


function getGeoInfo() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(geoData) {
			let lat = geoData.coords.latitude;
			let lon = geoData.coords.longitude;
			
			getWeatherInfo(lat, lon);
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}


async function getWeatherInfo(lat, lon) {
    const OWMKEY = "9e63e3db08ca3fc65ea3925879bdc7b7";
    const OWMAPI = "https://api.openweathermap.org/data/2.5/weather";
	
	try {
		let data = await $.ajax({
			url: OWMAPI,
			data: {
				lat: lat,
				lon: lon,
				units: 'metric',
				appid: OWMKEY
			},
			dataType: 'json'
		});
		
		let loc = data.name;
		let icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
		let temp = data.main.temp;
		let weather = data.weather[0].description;
		weather = weather.substr(0, 1).toUpperCase() + weather.substr(1);
		let wind = data.wind.speed;
		
		displayWeather(loc, icon, weather, temp, wind);
		
	} catch (ex) {
		alert(`An error has occurred.\nPlease try again later.`);
	}
}


function displayWeather(loc, icon, weather, temp, wind) {
    $("#dspLoc").html(loc);
    $(".dspIcon").attr("src", icon);
    $("#dspWeather").html(weather);
    $("#dspTempValue").html(temp);
    $("#dspWindValue").html(wind);
}


function convertTemp() {
    let bttnValue = $("#dspButton").attr("value");
    let currTemp = parseFloat($("#dspTempValue").html());
	
    // C = (5 / 9) * (F - 32); F = ((9 / 5) * C) + 32; //
	
    if (bttnValue === "degC") {
        currTemp = parseFloat((((9 / 5) * currTemp) + 32).toFixed(2));
		
        // display info //
        $("#dspTempUnit").html("F");
        $("#dspButton").attr("value", "degF").html("&deg;C");
		
    } else {
        currTemp = parseFloat(((5 / 9) * (currTemp - 32)).toFixed(2));
		
        // display info //
        $("#dspTempUnit").html("C");
        $("#dspButton").attr("value", "degC").html("&deg;F");
    }
	
    $("#dspTempValue").html(currTemp);
}


