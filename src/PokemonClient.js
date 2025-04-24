// import {p1_gesture, p2_gesture, p1_state, p2_state} from "../scripts/battle"
// import myEmitter from "../scripts/battle";

(() => {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.
  const fullscreen = document.getElementsByClassName("fullscreen-wrapper")[0];
  let width = fullscreen.offsetWidth; // We will scale the photo width to this
  let height = fullscreen.offsetHeight; // This will be computed based on the input stream
  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.
  let streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.
  let video = null;
  let userInterface = null;

  function startup() {
    video = document.getElementById("video");
    userInterface = document.getElementById("interface");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          const heightRatio = video.videoHeight / height;
          const widthRatio = video.videoWidth / width;
          const maxRatio = Math.max(heightRatio, widthRatio);

          height = video.videoHeight / maxRatio;
          width = video.videoWidth / maxRatio;

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          userInterface.style.width = `${width}px`;
          userInterface.style.height = `${height}px`;
          streaming = true;
        }
      },
      false
    );
  }

  function resizeVideo() {
    const fullscreen = document.getElementsByClassName("fullscreen-wrapper")[0];
    let screenWidth = fullscreen.offsetWidth; // We will scale the photo width to this
    let screenHeight = fullscreen.offsetHeight;

    const heightRatio = video.videoHeight / screenHeight;
    const widthRatio = video.videoWidth / screenWidth;
    const maxRatio = Math.max(heightRatio, widthRatio);

    height = video.videoHeight / maxRatio;
    width = video.videoWidth / maxRatio;

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    userInterface.style.width = `${width}px`;
    userInterface.style.height = `${height}px`;
  }

  // Update client according to current state
  // function updateClient() {
  //   if ()
  // }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);

  window.onresize = resizeVideo;

  myEmitter.on("p1_state", (data) => {
    console.log("p1_state received:", data);
  });
  myEmitter.on("p2_state", (data) => {
    console.log("p2_state received:", data);
  });
  myEmitter.on("animate", (data) => {
    console.log("animate received:", data);
  });
})();
