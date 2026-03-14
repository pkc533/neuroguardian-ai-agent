import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function ScreenCapture({ onCapture }) {

  const captureRef = useRef(null);

  const takeScreenshot = async () => {

    const canvas = await html2canvas(captureRef.current);

    const image = canvas.toDataURL("image/png");

    onCapture(image);
  };

  return (
    <div>

      <div
        ref={captureRef}
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 10,
          background: "white",
          width: 350
        }}
      >

        <h3>Daily Care Dashboard</h3>

        <p><b>Next Medication:</b> 7:00 PM</p>

        <p><b>Last Activity:</b> Walked 20 minutes</p>

        <div style={{ marginTop: 15 }}>

          <button style={{ marginRight: 10 }}>
            Take Medication
          </button>

          <button style={{ marginRight: 10 }}>
            Call Caregiver
          </button>

          <button>
            Log Activity
          </button>

        </div>

      </div>

      <button
        onClick={takeScreenshot}
        style={{
          marginTop: 10,
          padding: "8px 12px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Capture Screen
      </button>

    </div>
  );
}