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
  // let canvas = null;
  // let photo = null;
  let userInterface = null;

  // //vision
  // // Create task for image file processing:
  // const vision = await FilesetResolver.forVisionTasks(
  //   // path/to/wasm/root
  //   "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm "
  // );
  // const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
  //   baseOptions: {
  //     modelAssetPath:
  //       "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
  //   },
  //   numHands: 2,
  // });

  function startup() {
    video = document.getElementById("video");
    // canvas = document.getElementById("canvas");
    // photo = document.getElementById("photo");
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
          // canvas = setAttribute("width", width);
          // canvas = setAttribute("height", height);
          userInterface.style.width = `${width}px`;
          userInterface.style.height = `${height}px`;
          streaming = true;
        }
      },
      false
    );

    // startButton.addEventListener(
    //   "click",
    //   (ev) => {
    //     takePicture();
    //     ev.preventDefault();
    //   },
    //   false
    // );

    // clearPhoto();

    // const intervalId = setInterval(() => {
    //   const pictureData = takePicture();
    //   const gestureRecognitionResult = gestureRecognizer.recognize(image);
    //   console.log(gestureRecognitionResult);
    // }, 1000);
  }

  // Fill the photo with an indication that none has been captured.
  // function clearPhoto() {
  //   const context = canvas.getContext("2d");
  //   context.fillStyle = "#AAA";
  //   context.fillRect(0, 0, canvas.width, canvas.height);

  //   const data = canvas.toDataURL("image/png");
  //   return data;
  //   // photo.setAttribute("src", data);
  // }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.
  // function takePicture() {
  //   const context = canvas.getContext("2d");
  //   if (width && height) {
  //     canvas.width = width;
  //     canvas.height = height;
  //     context.drawImage(video, 0, 0, width, height);

  //     const data = canvas.toDataURL("image/png");
  //     return data;
  //     // photo.setAttribute("src", data);
  //   } else {
  //     clearPhoto();
  //   }
  // }

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
    // canvas.setAttribute("width", width);
    // canvas.setAttribute("height", height);
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
