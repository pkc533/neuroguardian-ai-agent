import React, { useState } from "react";
import ScreenCapture from "./components/ScreenCapture";
import ActionPanel from "./components/ActionPanel";
import VideoInput from "./components/VideoInput";
import VoiceChat from "./components/VoiceChat";
import CaregiverAlert from "./components/CaregiverAlert";
import { sendScreenshot } from "./services/apiClient";

export default function App() {

  const [actions, setActions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tremorDetected, setTremorDetected] = useState(false);

  const neuroPrompt = `
You are NeuroGuardian.

You assist people with Alzheimer’s, dementia or Parkinson’s.

Look at the environment or care dashboard and recommend helpful assistance.

Examples:
- remind medication
- suggest contacting caregiver
- guide user to next action
- detect unusual behavior

Return JSON with analysis and recommended action.
`;

  // Screenshot / camera analysis
  const handleCapture = async (image) => {

    const response = await sendScreenshot(image, neuroPrompt);

    setActions(response.actions);
    setAnalysis(response.analysis);
  };

  // Voice assistant response handler
  const handleVoiceResult = (response) => {

    if (!response) return;

    setActions(response.actions);
    setAnalysis(response.analysis);
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Arial",
        background: "#f5f7fa",
        minHeight: "100vh"
      }}
    >

      <h1>🧠 NeuroGuardian AI Companion</h1>

      <p style={{ maxWidth: 700 }}>
        NeuroGuardian is an AI companion designed to support people living with
        Alzheimer’s, dementia, and other cognitive challenges. It continuously
        observes the environment, reminds users about important tasks, and
        provides real-time guidance to maintain independence and safety.
      </p>

      <hr />

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: 20,
          flexWrap: "wrap"
        }}
      >

        {/* CAMERA MONITOR */}

        <div
          style={{
            flex: 1,
            minWidth: 350,
            background: "white",
            padding: 20,
            borderRadius: 10
          }}
        >

          <h2>Environment Monitor</h2>

          <VideoInput
            onCapture={handleCapture}
            onTremor={setTremorDetected}
          />

          <p style={{ fontSize: 12, color: "#777" }}>
            NeuroGuardian observes surroundings to detect medication,
            potential hazards, or unusual movement patterns.
          </p>

        </div>

        {/* CARE DASHBOARD */}

        <div
          style={{
            flex: 1,
            minWidth: 350,
            background: "white",
            padding: 20,
            borderRadius: 10
          }}
        >

          <h2>Daily Care Dashboard</h2>

          <ScreenCapture onCapture={handleCapture} />

          <p style={{ fontSize: 12, color: "#777" }}>
            Capture the dashboard to allow AI to analyze medication schedules
            and recommend helpful actions.
          </p>

        </div>

      </div>

      {/* VOICE ASSISTANT */}

      <div
        style={{
          marginTop: 40,
          background: "white",
          padding: 20,
          borderRadius: 10
        }}
      >

        <h2>Voice Assistant</h2>

        <VoiceChat onVoiceResult={handleVoiceResult} />

        <p style={{ fontSize: 12, color: "#777" }}>
          Ask NeuroGuardian questions like:
          <br />
          “What should I do next?”
          <br />
          “Is it time for my medication?”
        </p>

      </div>

      {/* AI OUTPUT */}

      <div
        style={{
          marginTop: 40,
          background: "white",
          padding: 20,
          borderRadius: 10
        }}
      >

        <h2>AI Guidance</h2>

        <ActionPanel
          actions={actions}
          analysis={analysis}
        />

      </div>

      {/* CAREGIVER ALERT */}

      <CaregiverAlert tremor={tremorDetected} />

    </div>
  );
}