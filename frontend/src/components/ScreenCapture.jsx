import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function ScreenCapture({ onCapture }) {

  const captureRef = useRef(null);

  const takeScreenshot = async () => {

    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current);

    const image = canvas.toDataURL("image/png");

    console.log("Screenshot captured");

    if (onCapture) {
      onCapture(image);
    }
  };

  return (
    <div>

      <div
        ref={captureRef}
        style={{
          border: "1px solid #ddd",
          padding: 25,
          borderRadius: 12,
          background: "white",
          maxWidth: 420
        }}
      >

        <h2 style={{ marginBottom: 10 }}>
          👋 Hello Friend
        </h2>

        <p style={{ fontSize: 16 }}>
          I'm here to help with your daily routine.
        </p>

        <hr />

        <h3 style={{ marginTop: 15 }}>
          🕒 Next Medication
        </h3>

        <p style={{ fontSize: 18 }}>
          <b>7:00 PM</b>
        </p>

        <div style={{ marginTop: 15 }}>

          <button
            style={{
              padding: "12px 16px",
              marginRight: 10,
              fontSize: 16,
              borderRadius: 8
            }}
          >
            💊 Take Medication
          </button>

          <button
            style={{
              padding: "12px 16px",
              marginRight: 10,
              fontSize: 16,
              borderRadius: 8
            }}
          >
            📞 Call Caregiver
          </button>

          <button
            style={{
              padding: "12px 16px",
              fontSize: 16,
              borderRadius: 8
            }}
          >
            📋 Log Activity
          </button>

        </div>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "#eef6ff",
            borderRadius: 8
          }}
        >
          🤖 NeuroGuardian Suggestion  
          <br />
          It might be time to prepare your evening medication.
        </div>

      </div>

      <button
        onClick={takeScreenshot}
        style={{
          marginTop: 12,
          padding: "10px 18px",
          background: "#2e86de",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 16
        }}
      >
        Analyze Dashboard
      </button>

    </div>
  );
}