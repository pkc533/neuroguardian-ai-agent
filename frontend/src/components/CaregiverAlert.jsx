import React from "react";

export default function CaregiverAlert({ tremor }) {

  if (!tremor) return null;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        background: "#ffe0e0",
        borderRadius: 10
      }}
    >

      <h3>⚠ Caregiver Alert</h3>

      <p>
        Possible tremor detected. A caregiver notification would be triggered.
      </p>

    </div>
  );
}