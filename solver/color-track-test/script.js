// Get the <video> and <canvas> elements
var video = document.getElementById('my-video');
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');

// Get access to the camera and start streaming video to the <video> element
navigator.mediaDevices.getUserMedia({ video: true })
	.then(function (stream) {
		video.srcObject = stream;
	})
	.catch(function (err) {
		console.log("Could not access the camera: " + err);
	});

// Track the colors of the Rubik's cube squares
var trackColors = [[255, 0, 0], // red
[0, 255, 0], // green
[0, 0, 255], // blue
[255, 255, 0], // yellow
[255, 0, 255], // magenta
[0, 255, 255], // cyan
];

// Continuously update the <canvas> with the latest video frame
function updateFrame() {
	// Draw the current video frame on the <canvas>
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	// Use computer vision techniques to detect the orientation of the Rubik's cube in the frame

	// Get the ImageData for the <canvas>
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	// Loop through all the pixels in the ImageData
	for (var i = 0; i < imageData.data.length; i += 4) {
		// Check if the current pixel matches any of the colors of the Rubik's cube square
		for (var j = 0; j < trackColors.length; j++) {
			if (((imageData.data[i] >= trackColors[j][0] - 35) && (imageData.data[i] <= trackColors[j][0] + 35)) &&
				((imageData.data[i + 1] >= trackColors[j][1] - 35) && (imageData.data[i + 1] <= trackColors[j][1] + 35)) &&
				((imageData.data[i + 2] >= trackColors[j][2] - 35) && (imageData.data[i + 2] <= trackColors[j][2] + 35))) {
				// This pixel matches a color of the Rubik's cube, so do something with it...
				if(j == 0)
				{
					console.log("Red");
				}
				if(j == 1)
				{
					console.log("Green");
				}
				if(j == 2)
				{
					console.log("Blue");
				}
				if(j == 3)
				{
					console.log("Yellow");
				}
				if(j == 4)
				{
					console.log("Magenta");
				}
				if(j == 5)
				{
					console.log("Cyan");
				}
			}
		}
	}

	// Request the next video frame
	requestAnimationFrame(updateFrame);
}

// Start tracking the camera video
updateFrame();
