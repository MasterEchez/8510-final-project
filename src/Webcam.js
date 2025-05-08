import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let gestureRecognizer;
let runningMode = "IMAGE";

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
};
await createGestureRecognizer();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableCam();
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam() {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }

  // getUsermedia parameters.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
  const webcamElement = document.getElementById("webcam");
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    // console.log(results);
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  // Size video according to window
  const fullscreen = document.getElementsByClassName("fullscreen-container")[0];
  const fullHeight = fullscreen.offsetHeight;
  const fullWidth = fullscreen.offsetWidth;

  const heightRatio = video.videoHeight / fullHeight;
  const widthRatio = video.videoWidth / fullWidth;
  const maxRatio = Math.max(heightRatio, widthRatio);

  const adjustedHeight = video.videoHeight / maxRatio;
  const adjustedWidth = video.videoWidth / maxRatio;

  canvasElement.setAttribute("height", adjustedHeight);
  webcamElement.setAttribute("height", adjustedHeight);
  canvasElement.setAttribute("width", adjustedWidth);
  webcamElement.setAttribute("width", adjustedWidth);

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5,
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
    }
  }
  canvasCtx.restore();
  //   if (results.gestures.length > 0) {
  //     gestureOutput.style.display = "block";
  //     gestureOutput.style.width = videoWidth;
  //     const categoryName = results.gestures[0][0].categoryName;
  //     const categoryScore = parseFloat(
  //       results.gestures[0][0].score * 100
  //     ).toFixed(2);
  //     const handedness = results.handednesses[0][0].displayName;
  //     gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
  //   } else {
  //     gestureOutput.style.display = "none";
  //   }
  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(predictWebcam);
}

function resizeVideo() {
  const fullscreen = document.getElementsByClassName("fullscreen-container")[0];
  const fullHeight = fullscreen.offsetHeight;
  const fullWidth = fullscreen.offsetWidth;

  const heightRatio = video.videoHeight / fullHeight;
  const widthRatio = video.videoWidth / fullWidth;
  const maxRatio = Math.max(heightRatio, widthRatio);

  const adjustedHeight = video.videoHeight / maxRatio;
  const adjustedWidth = video.videoWidth / maxRatio;

  canvasElement.setAttribute("height", adjustedHeight);
  webcamElement.setAttribute("height", adjustedHeight);
  canvasElement.setAttribute("width", adjustedWidth);
  webcamElement.setAttribute("width", adjustedWidth);
}

window.onresize = resizeVideo;
