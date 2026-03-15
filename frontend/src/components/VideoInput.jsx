import React, { useEffect, useRef, useState } from "react";

export default function VideoInput({ onCapture, onTremor, visionEnabled }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const prevFrameRef = useRef(null);

  useEffect(() => {

    async function startCamera() {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (err) {

        console.error("Camera access error:", err);

      }

    }

    startCamera();

  }, []);

  const analyzeFrame = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

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

    if (visionEnabled && onCapture) {

      const image = canvas.toDataURL("image/jpeg");

      onCapture(image);

    }

  };

  useEffect(() => {

    if (!visionEnabled) return;

    const interval = setInterval(() => {

      analyzeFrame();

    }, 3000);

    return () => clearInterval(interval);

  }, [visionEnabled]);

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

    </div>
  );
}