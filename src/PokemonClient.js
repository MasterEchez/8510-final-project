// import {p1_gesture, p2_gesture, p1_state, p2_state} from "../scripts/battle"
// import myEmitter from "../scripts/battle";

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
    await gestureRecognizer.setOptions({ runningMode: "VIDEO", numHands: 4 });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    // console.log(results.landmarks);
  }

  // Canvas stuff
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

  // Tell state machine to update
  // headsUpDisplay.updateState();

  if (results.gestures.length > 0) {
    const player1Gestures = [];
    const player2Gestures = [];

    for (let i = 0; i < results.gestures.length; i++) {
      const gestureName = results.gestures[i][0].categoryName;
      const wristLocation = results.landmarks[i][0].x;
      const isWristLeft = wristLocation > 0.5;

      if (isWristLeft && player1Gestures.length < 2) {
        player1Gestures.push(gestureName);
      } else if (!isWristLeft && player2Gestures.length < 2) {
        player2Gestures.push(gestureName);
      }
    }

    headsUpDisplay.updateState(
      player1Gestures.slice(),
      player2Gestures.slice()
    );
    await headsUpDisplay.stateTransition();
    headsUpDisplay.display();
  }
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

// Listen for gesture recognition
// document.addEventListener;

// State machine
const headsUpDisplay = new HUDStateMachine(new UserConfirmationState());

window.addEventListener("click", async (event) => {
  if (headsUpDisplay.updateState()) {
    await headsUpDisplay.stateTransition();
  }
  headsUpDisplay.display();
});

// TODO replace with mediapipe gesture feed
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      // Code to execute when up arrow key is pressed
      headsUpDisplay.state.player1Gesture = gestures.THUMBS_UP;
      console.log("Up arrow pressed");
      break;
    case "ArrowDown":
      // Code to execute when down arrow key is pressed
      headsUpDisplay.state.player1Gesture = gestures.THUMBS_DOWN;
      console.log("Down arrow pressed");
      break;
    case "ArrowRight":
      // Code to execute when left arrow key is pressed
      headsUpDisplay.state.player2Gesture = gestures.THUMBS_UP;
      console.log("Right arrow pressed");
      break;
    case "ArrowLeft":
      // Code to execute when right arrow key is pressed
      headsUpDisplay.state.player2Gesture = gestures.THUMBS_DOWN;
      console.log("Left arrow pressed");
      break;
  }
});

headsUpDisplay.display();

// async function main() {
//   //state machine
//   const headsUpDisplay = new HUDStateMachine(new UserConfirmationState());

//   // myEmitter.on("p1_state", (data) => {
//   //   console.log("p1_state received:", data);
//   // });
//   // myEmitter.on("p2_state", (data) => {
//   //   console.log("p2_state received:", data);
//   // });
//   // myEmitter.on("animate", (data) => {
//   //   console.log("animate received:", data);
//   // });

//   //Which hud to display
//   window.addEventListener("click", async (event) => {
//     if (headsUpDisplay.updateState()) {
//       await headsUpDisplay.stateTransition();
//     }
//     headsUpDisplay.display();
//   });

//   // TODO replace with mediapipe gesture feed
//   document.addEventListener("keydown", (event) => {
//     switch (event.key) {
//       case "ArrowUp":
//         // Code to execute when up arrow key is pressed
//         headsUpDisplay.state.player1Gesture = gestures.THUMBS_UP;
//         console.log("Up arrow pressed");
//         break;
//       case "ArrowDown":
//         // Code to execute when down arrow key is pressed
//         headsUpDisplay.state.player1Gesture = gestures.THUMBS_DOWN;
//         console.log("Down arrow pressed");
//         break;
//       case "ArrowRight":
//         // Code to execute when left arrow key is pressed
//         headsUpDisplay.state.player2Gesture = gestures.THUMBS_UP;
//         console.log("Right arrow pressed");
//         break;
//       case "ArrowLeft":
//         // Code to execute when right arrow key is pressed
//         headsUpDisplay.state.player2Gesture = gestures.THUMBS_DOWN;
//         console.log("Left arrow pressed");
//         break;
//     }
//   });

//   headsUpDisplay.display();
// }

// void main();
