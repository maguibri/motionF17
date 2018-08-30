/*
 * index.js
 * Put your JavaScript in here
 */

"use strict;"

var xCanvas, yCanvas, zCanvas;
var xLabel, yLabel, zLabel, tLabel;
var startButton, stopButton;
var startTime;

var xSmoothie, ySmoothie, zSmoothie;
var xLine, yLine, zLine;

var accelerometerOptions = { frequency: 1000 }; // update every 1000ms = 1 sec
var accelerometerWatcher = null;

document.addEventListener("deviceready", onDeviceReady, false);

// android has a back button, we want to stop when pressed
document.addEventListener("backbutton", stopWatchingAccelerometer, false);

function onDeviceReady() {
	xCanvas 	= document.getElementById('xCanvasId');
	yCanvas 	= document.getElementById('yCanvasId');
	zCanvas 	= document.getElementById('zCanvasId');
	xLabel 		= document.getElementById('xLabelId');
	yLabel 		= document.getElementById('yLabelId');
	zLabel 		= document.getElementById('zLabelId');
	tLabel 		= document.getElementById('tLabelId');
	startButton = document.getElementById('startButtonId');
	stopButton 	= document.getElementById('stopButtonId');

	/* 
		canvas' must have their width and height attributes set, let's simulate
	   	80vw and 15vh in javascript
	*/
	deviceWidth  			= window.innerWidth;	/* get physical size */
	deviceHeight 			= window.innerHeight;

	if (deviceWidth < deviceHeight) {				/* landscape mode */
		canvasWidth  		= deviceWidth;
		canvasHeight 		= deviceWidth;
	} else {										/* portrait mode */
		canvasWidth  		= deviceHeight;
		canvasHeight 		= deviceHeight;
	}

	var w = canvasWidth  * 0.80; 					/* equivalent to 80vw */
	var h = canvasHeight * 0.15; 					/* equivalent to 15vh */

	xCanvas.width  = yCanvas.width  = zCanvas.width  = w;
	xCanvas.height = yCanvas.height = zCanvas.height = h;

	/* 
		now, create SmootieChart(), stream to the canvas and add TimeSeries() 
	*/
	xSmoothie = new SmoothieChart();
	ySmoothie = new SmoothieChart();
	zSmoothie = new SmoothieChart();

	xSmoothie.streamTo(xCanvas, 1000 /* delay for smooth graph */);
	ySmoothie.streamTo(yCanvas, 1000 /* delay for smooth graph */);
	zSmoothie.streamTo(zCanvas, 1000 /* delay for smooth graph */);

	xLine = new TimeSeries();
	yLine = new TimeSeries();
	zLine = new TimeSeries();

	/* 
		initialize our buttons 
	*/
	startButton.addEventListener("click", startWatchingAccelerometer, false);
	stopButton.addEventListener( "click", stopWatchingAccelerometer,  false);

	startButton.disabled = false;
	stopButton.disabled  = true;
}

function startWatchingAccelerometer() {
	// See: https://github.com/apache/cordova-plugin-device-motion for details
	
	accelerometerWatcher = navigator.accelerometer.watchAcceleration(
		accelerometerSuccess,
		accelerometerFailure,
		accelerometerOptions);
	startTime = Date.now();
	startButton.disabled = true;
	stopButton.disabled  = false;

	xSmoothie.addTimeSeries(xLine, { strokeStyle:'rgb(255,0,0)', lineWidth:3 });
	ySmoothie.addTimeSeries(yLine, { strokeStyle:'rgb(0,255,0)', lineWidth:3 });
	zSmoothie.addTimeSeries(zLine, { strokeStyle:'rgb(0,0,255)', lineWidth:3 });
}

function stopWatchingAccelerometer() {
	if (accelerometerWatcher) {
		navigator.accelerometer.clearWatch(accelerometerWatcher);
		accelerometerWatcher = null;
		startButton.disabled = false;
		stopButton.disabled  = true;
	}
}

function accelerometerSuccess(acceleration) {
	xLabel.innerHTML = "x: " + (acceleration.x).toPrecision(5);
	yLabel.innerHTML = "y: " + (acceleration.y).toPrecision(5);
	zLabel.innerHTML = "z: " + (acceleration.z).toPrecision(6);
	tLabel.innerHTML = "t: " + Math.round(acceleration.timestamp - startTime);

	xLine.append(acceleration.timestamp, acceleration.x);
	yLine.append(acceleration.timestamp, acceleration.y);
	zLine.append(acceleration.timestamp, acceleration.z);
}

function accelerometerFailure() {
	alert("Error in Accelerometer!");
}
