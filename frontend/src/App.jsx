import React, { useState } from "react";
import ScreenCapture from "./components/ScreenCapture";
import ActionPanel from "./components/ActionPanel";
import VideoInput from "./components/VideoInput";
import VoiceChat from "./components/VoiceChat";
import CaregiverAlert from "./components/CaregiverAlert";
import { sendScreenshot } from "./services/apiClient";
import StoryButton from "./components/StoryButton";

export default function App() {

  const [actions, setActions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tremorDetected, setTremorDetected] = useState(false);
  const [visionEnabled, setVisionEnabled] = useState(true);

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

  const handleCapture = async (image) => {

    if (!visionEnabled) return;

    const response = await sendScreenshot(image, neuroPrompt);

    setActions(response.actions);
    setAnalysis(response.analysis);
  };

  const handleVoiceResult = (response) => {

    if (!response) return;

    setActions(response.actions);
    setAnalysis(response.analysis);
  };

  const toggleVision = () => {

    const nextState = !visionEnabled;

    setVisionEnabled(nextState);

    if (!nextState) {
      setAnalysis(null);
      setActions(null);
      speechSynthesis.cancel();
    }

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

      <h1>🧠 NeuroGuardian</h1>

      <p style={{ maxWidth: 700 }}>
        Smart assistance for daily safety, emotional comfort, and independence.
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

          <div style={{ marginBottom: 12 }}>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: visionEnabled ? "#e8f7ef" : "#fbeaea",
                color: visionEnabled ? "#27ae60" : "#c0392b",
                fontSize: 13,
                marginRight: 10
              }}
            >
              🤖 AI Monitoring {visionEnabled ? "Active" : "Paused"}
            </span>

            <button
              onClick={toggleVision}
              style={{
                padding: "6px 12px",
                background: visionEnabled ? "#27ae60" : "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              {visionEnabled ? "Disable AI Vision" : "Enable AI Vision"}
            </button>

          </div>

          <VideoInput
            onCapture={handleCapture}
            onTremor={setTremorDetected}
            visionEnabled={visionEnabled}
          />

          <p style={{ fontSize: 12, color: "#777" }}>
            NeuroGuardian observes surroundings to detect medication,
            hazards, or unusual movement patterns.
          </p>

        </div>

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

        <div style={{ marginTop: 20 }}>
          <StoryButton />
        </div>

        <p style={{ fontSize: 12, color: "#777" }}>
          Ask NeuroGuardian questions like:
          <br />
          “What should I do next?”
          <br />
          “Is it time for my medication?”
          <br />
          Or press "Tell Me a Story" to relax.
        </p>

      </div>

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
          visionEnabled={visionEnabled}
        />

      </div>

      <CaregiverAlert tremor={tremorDetected} />

    </div>
  );
}