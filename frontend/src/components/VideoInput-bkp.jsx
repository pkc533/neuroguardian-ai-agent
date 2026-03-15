import React, { useEffect, useRef, useState } from "react";

export default function VideoInput({ onCapture }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [lastFrame, setLastFrame] = useState(null);
  const [autoMode, setAutoMode] = useState(false);
  const [emotionInsight, setEmotionInsight] = useState(null);

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

      }, 4000);

    }

    return () => clearInterval(interval);

  }, [autoMode]);

  const captureCameraFrame = async () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !cameraReady) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg");

    setLastFrame(image);

    // Send frame for environment reasoning
    if (onCapture) {
      onCapture(image);
    }

    // Send frame for emotion detection
    try {

      const response = await fetch("http://127.0.0.1:8000/emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: image
        })
      });

      const data = await response.json();

      console.log("Emotion insight:", data);

      setEmotionInsight(data.response);

      // voice calming playback if needed
      if (data.response) {

        const speech = new SpeechSynthesisUtterance(data.response);

        speech.rate = 0.9;
        speech.pitch = 0.9;

        speechSynthesis.speak(speech);

      }

    } catch (err) {

      console.error("Emotion detection failed:", err);

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

      {emotionInsight && (
        <div
          style={{
            marginTop: 15,
            padding: 10,
            background: "#eafaf1",
            borderRadius: 6
          }}
        >
          <b>Emotional Insight:</b> {emotionInsight}
        </div>
      )}

    </div>
  );
}