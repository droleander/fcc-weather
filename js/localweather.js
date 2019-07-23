// Temporary CORS Workaround //
// https://crossorigin.me/
// https://cors-anywhere.herokuapp.com/


$(document).ready(function () {
	getGeoInfo();
	$("#dspLoc").on("click", function () {
		$("#dspMap").slideToggle();
	});
});

function getGeoInfo() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geoData => {
			lat = geoData.coords.latitude;
			lon = geoData.coords.longitude;

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

		let loc = `${data.name}, ${data.sys.country}`;

		let icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
		let temp = data.main.temp.toFixed(0);
		
		let weather = data.weather[0].description;
		weather = weather.substr(0, 1).toUpperCase() + weather.substr(1);

		let sunrise = new Date(data.sys.sunrise * 1000);
		let sunrise_hr = sunrise.getHours();
		let sunrise_mn = sunrise.getMinutes();
		let sunrise_time = `${sunrise_hr}:${sunrise_mn} AM`;
		
		let sunset = new Date(data.sys.sunset * 1000);
		let sunset_hr = sunset.getHours() % 12;
		let sunset_mn = sunset.getMinutes();
		let sunset_time = `${sunset_hr}:${sunset_mn} PM`;
		
		let wind = data.wind.speed;

		displayWeather(loc, icon, weather, temp, sunrise_time, sunset_time, wind);
		displayLocation(lat, lon);

	} catch (ex) {
		alert(`An error has occurred.\nPlease try again later.`);
	}
}

function displayWeather(loc, icon, weather, temp, sunrise, sunset, wind) {
	const timestamp = new Date(Date.now());
	let YYYY = timestamp.getFullYear();
	let MM = timestamp.getMonth() + 1;
	MM = MM < 10 ? "0" + MM : MM;
	let DD = timestamp.getDate();
	DD = DD < 10 ? "0" + DD : DD;

	let HH = timestamp.getHours();
	let ampm = HH >= 12 ? "PM" : "AM"
	HH = HH > 12 ? HH % 12 : HH;
	let mm = timestamp.getMinutes();
	mm = mm < 10 ? "0" + mm : mm;
	let ss = timestamp.getSeconds();
	ss = ss < 10 ? "0" + ss : ss;

	// $("#dspDateTime").html(`${new Date().toLocaleString()}`);
	$("#dspDateTime").html(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss} ${ampm}`);
	$("#dspLoc").css({'margin-bottom': '-.75rem'});
	$("#dspLoc").html(loc);
	$('.dspIcon').css({'display': 'inline'});
	$(".dspIcon").attr("src", icon);
	$("#dspWeather").css({'margin-top': '-1rem'});
	$("#dspWeather").html(weather);
	$("#dspTempValue").html(temp);
	$("#dspSunriseTime").html(sunrise);
	$("#dspSunsetTime").html(sunset);
	$("#dspWindValue").html(wind);
}

function displayLocation(lat, lon) {
	const mymap = L.map('dspMap').setView([lat, lon], 13);
	const marker = L.marker([lat, lon]).addTo(mymap);
	const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tiles = L.tileLayer(tileUrl, {attribution});
	tiles.addTo(mymap);
}

function convertTemp() {
	let bttnValue = $("#dspButton").attr("value");
	let currTemp = parseFloat($("#dspTempValue").html());

	// C = (5 / 9) * (F - 32); F = ((9 / 5) * C) + 32; //

	if (bttnValue === "degC") {
		currTemp = parseFloat((((9 / 5) * currTemp) + 32).toFixed(0));

		// display info //
		$("#dspTempUnit").html("F");
		$("#dspButton").attr("value", "degF").html("&deg;C");

	} else {
		currTemp = parseFloat(((5 / 9) * (currTemp - 32)).toFixed(0));

		// display info //
		$("#dspTempUnit").html("C");
		$("#dspButton").attr("value", "degC").html("&deg;F");
	}

	$("#dspTempValue").html(currTemp);
}

	/* Sample JSON Response from https://api.openweathermap.org/data/2.5/weather?lat=14.6760413&lon=121.0437003&units=metric&appid=9e63e3db08ca3fc65ea3925879bdc7b7

	{
		"coord": {
			"lon": 121.04,
			"lat": 14.68
		},
		"weather": [
			{
				"id": 802,
				"main": "Clouds",
				"description": "scattered clouds",
				"icon": "03d"
			}
		],
		"base": "stations",
		"main": {
			"temp": 31.95,
			"pressure": 1011,
			"humidity": 62,
			"temp_min": 31.67,
			"temp_max": 32.22
		},
		"visibility": 10000,
		"wind": {
			"speed": 3.1,
			"deg": 120
		},
		"clouds": {
			"all": 40
		},
		"dt": 1558924666,
		"sys": {
			"type": 1,
			"id": 8160,
			"message": 0.0053,
			"country": "PH",
			"sunrise": 1558905964,
			"sunset": 1558952406
		},
		"timezone": 28800,
		"id": 1966336,
		"name": "Bagong Pagasa",
		"cod": 200
	}

*/