/*
 * index.js
 * Put your JavaScript in here
 */

"use strict;"

var mapGeoButton 	= undefined;
var latitudeInput 	= undefined;
var longitudeInput 	= undefined;
var mapElement  	= undefined;
var map 			= undefined;
var curLatLng 		= undefined;
var marker 			= undefined;
var zoom 			= 18;

/*===========================*/
/* put global variables here */
/*===========================*/

/* wait until all phonegap/cordova is loaded then call onDeviceReady*/
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	mapGeoButton   = document.getElementById('mapGeoButtonId');
	latitudeInput  = document.getElementById('latitudeId');
	longitudeInput = document.getElementById('longitudeId');
	mapElement 	   = document.getElementById('mapDiv');

	navigator.geolocation.getCurrentPosition(geolocationSuccess,
											 geolocationError,
											 { enableHighAccuracy: true });

	mapGeoButton.addEventListener("click", mapGeolocation);
	loadScript('initMap');
}

/*======================================*/
/* place your function definitions here */
/*======================================*/

function loadScript(callback) {
	var script 		 = undefined;
	var googleAPIKey = "AIzaSyAH7e1P_eSIAOa_Q2bNVJJwj1bV43cmsyY";
	var googleAPIUrl = "https://maps.googleapis.com/maps/api/js";

	var srcURL 		 = googleAPIUrl + '?key=' + googleAPIKey 
							+ '&callback=' + callback;

	script 			 = document.createElement('script');
	script.type 	 = "text/javascript";
	script.async 	 = true;
	script.defer 	 = true;
	script.src 		 = srcURL;

	document.body.appendChild(script); /* after append, script will run */
}

function initMap() {
	var mapOptions 		= {zoom: zoom, center: curLatLng};

	map = new google.maps.Map(mapElement, mapOptions);

	var markerOptions 	= {position: curLatLng, map: map};

	marker = new google.maps.Marker(markerOptions);

	google.maps.event.addListener(map, 'click', function (event) {
  		latitudeInput.value = event.latLng.lat();
  		longitudeInput.value = event.latLng.lng();
  		marker.setPosition(event.latLng);
  		map.setCenter(event.latLng);
	});
}

function geolocationSuccess(position) {
	latitudeInput.value  = position.coords.latitude;
	longitudeInput.value = position.coords.longitude;
	curLatLng = new google.maps.LatLng({lat: position.coords.latitude, 
										lng: position.coords.longitude});
	mapGeolocation();
}

function geolocationError() {
	alert("Error in geolocation subsystem!");
}

function mapGeolocation() {
	curLatLng = new google.maps.LatLng(
		{ lat: Number(latitudeInput.value), 
		  lng: Number(longitudeInput.value) });
	map.panTo(curLatLng);
	marker.setPosition(curLatLng);
}

