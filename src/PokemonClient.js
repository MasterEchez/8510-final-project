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
  let canvas = null;
  // let photo = null;
  let userInterface = null;
  // let startButton = null;

  function startup() {
    video = document.getElementById("video");
    // canvas = document.getElementById("canvas");
    // photo = document.getElementById("photo");
    userInterface = document.getElementById("interface");
    // startButton = document.getElementById("start-button");

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
          // height = video.videoHeight / (video.videoWidth / width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
          // if (isNaN(height)) {
          //   height = width / (4 / 3);
          // }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          // canvas.setAttribute("width", width);
          // canvas.setAttribute("height", height);
          userInterface.style.width = `${width}px`;
          userInterface.style.height = `${height}px`;
          console.log(userInterface);
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
  }

  // Fill the photo with an indication that none has been captured.
  // function clearPhoto() {
  //   const context = canvas.getContext("2d");
  //   context.fillStyle = "#AAA";
  //   context.fillRect(0, 0, canvas.width, canvas.height);

  //   const data = canvas.toDataURL("image/png");
  //   photo.setAttribute("src", data);
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
  //     photo.setAttribute("src", data);
  //   } else {
  //     clearPhoto();
  //   }
  // }

  function resizeVideo() {
    const fullscreen = document.getElementsByClassName("fullscreen-wrapper")[0];
    let screenWidth = fullscreen.offsetWidth; // We will scale the photo width to this
    let screenHeight = fullscreen.offsetHeight; // This will be computed based on the input stream

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

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);

  window.onresize = resizeVideo;
})();
