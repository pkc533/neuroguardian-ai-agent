import React, { useEffect, useRef } from "react";

export default function VideoInput({ onCapture, onTremor, visionEnabled }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const prevFrameRef = useRef(null);
  const streamRef = useRef(null);

  const frameBuffer = useRef([]);

  const frameLoop = useRef(null);
  const sendLoop = useRef(null);

  const FRAME_CAPTURE_INTERVAL = 2000; // 2 seconds
  const BUFFER_WINDOW = 10000; // 10 seconds

  // --------------------------------------------------
  // CAMERA CONTROL
  // --------------------------------------------------

  useEffect(() => {

    async function startCamera() {

      try {

        console.log("Starting camera");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (err) {

        console.error("Camera access error:", err);

      }

    }

    function stopCamera() {

      console.log("Stopping camera");

      if (frameLoop.current) clearInterval(frameLoop.current);
      if (sendLoop.current) clearInterval(sendLoop.current);

      frameBuffer.current = [];

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

    }

    if (visionEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();

  }, [visionEnabled]);



  // --------------------------------------------------
  // FRAME CAPTURE
  // --------------------------------------------------

  const captureFrame = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = 320;
    canvas.height = 240;

    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Tremor detection
    if (prevFrameRef.current) {

      let motion = 0;

      for (let i = 0; i < imageData.data.length; i += 40) {
        motion += Math.abs(imageData.data[i] - prevFrameRef.current.data[i]);
      }

      if (motion > 120000) {
        if (onTremor) onTremor(true);
      } else {
        if (onTremor) onTremor(false);
      }

    }

    prevFrameRef.current = imageData;

    const frame = canvas.toDataURL("image/jpeg",0.5);

    frameBuffer.current.push(frame);

    console.log("Frame captured → buffer size:", frameBuffer.current.length);

  };



  // --------------------------------------------------
  // SEND BUFFER TO BACKEND
  // --------------------------------------------------

  const sendBuffer = () => {

    if (frameBuffer.current.length === 0) return;

    const frames = [...frameBuffer.current];

    console.log("Sending frame buffer to backend:", frames.length);

    if (onCapture) {
      onCapture(frames);
    }

    frameBuffer.current = [];

  };



  // --------------------------------------------------
  // START LOOPS
  // --------------------------------------------------

  useEffect(() => {

    if (!visionEnabled) return;

    frameLoop.current = setInterval(captureFrame, FRAME_CAPTURE_INTERVAL);

    sendLoop.current = setInterval(sendBuffer, BUFFER_WINDOW);

    return () => {

      if (frameLoop.current) clearInterval(frameLoop.current);
      if (sendLoop.current) clearInterval(sendLoop.current);

    };

  }, [visionEnabled]);



  return (
    <div>

      {!visionEnabled && (
        <div
          style={{
            width: "400px",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafafa",
            border: "1px solid #ddd",
            borderRadius: "10px",
            color: "#777"
          }}
        >
          AI Vision Disabled
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "400px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          display: visionEnabled ? "block" : "none"
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>
  );
}