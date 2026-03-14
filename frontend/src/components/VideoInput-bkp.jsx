import React, { useEffect, useRef, useState } from "react";

export default function VideoInput({ onCapture }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [lastFrame, setLastFrame] = useState(null);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {

    async function startCamera() {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        videoRef.current.srcObject = stream;
        setCameraReady(true);

      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

  }, []);

  useEffect(() => {

    let interval;

    if (autoMode) {

      interval = setInterval(() => {
        captureCameraFrame();
      }, 4000); // analyze every 4 seconds

    }

    return () => clearInterval(interval);

  }, [autoMode]);

  const captureCameraFrame = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraReady) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg");

    setLastFrame(image);

    if (onCapture) {
      onCapture(image);
    }

  };

  return (
    <div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "400px",
          borderRadius: "10px",
          border: "1px solid #ddd"
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 10 }}>

        <button
          onClick={captureCameraFrame}
          style={{
            marginRight: 10,
            padding: "6px 12px",
            background: "#2e86de",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Analyze Environment
        </button>

        <button
          onClick={() => setAutoMode(!autoMode)}
          style={{
            padding: "6px 12px",
            background: autoMode ? "#e74c3c" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {autoMode ? "Stop Monitoring" : "Auto Monitor"}
        </button>

      </div>

      {lastFrame && (
        <div style={{ marginTop: 15 }}>
          <p style={{ fontSize: 12 }}>Last Captured Frame</p>
          <img
            src={lastFrame}
            alt="captured"
            style={{
              width: "200px",
              borderRadius: "6px",
              border: "1px solid #ddd"
            }}
          />
        </div>
      )}

    </div>
  );
}