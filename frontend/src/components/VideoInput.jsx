import React, { useEffect, useRef, useState } from "react";

export default function VideoInput({ onCapture, onTremor }) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [prevFrame, setPrevFrame] = useState(null);

  useEffect(() => {

    async function startCamera() {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      videoRef.current.srcObject = stream;
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

    if (prevFrame) {

      let motion = 0;

      for (let i = 0; i < imageData.data.length; i += 40) {
        motion += Math.abs(imageData.data[i] - prevFrame.data[i]);
      }

      if (motion > 40000) {

        if (onTremor) onTremor(true);

      } else {

        if (onTremor) onTremor(false);
      }
    }

    setPrevFrame(imageData);

    const image = canvas.toDataURL("image/jpeg");

    if (onCapture) onCapture(image);

  };

  useEffect(() => {

    const interval = setInterval(() => {
      analyzeFrame();
    }, 3000);

    return () => clearInterval(interval);

  }, [prevFrame]);

  return (
    <div>

      <video
        ref={videoRef}
        autoPlay
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