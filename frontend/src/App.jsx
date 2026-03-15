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
  const [visionEnabled, setVisionEnabled] = useState(false);

  const API = "https://neuroguardian-backend-1024847090973.us-central1.run.app";

  // --------------------------------------------------
  // SYSTEM PROMPT (GENERALIZED CARE ASSISTANT)
  // --------------------------------------------------

  const neuroPrompt = `
You are NeuroGuardian, an AI care companion designed to assist
elderly individuals and people experiencing stress, confusion,
or emotional distress.

Your responsibilities include:

• providing calm reassurance
• guiding users if they appear confused
• detecting possible distress
• identifying safety hazards
• helping locate common objects
• reminding users about daily routines
• suggesting contacting caregivers when needed

Respond clearly, calmly, and supportively.

Return JSON with:
{
  "analysis": "",
  "actions": {
    "action": "",
    "target": ""
  },
  "response": ""
}
`;

  // --------------------------------------------------
  // HANDLE CAMERA FRAME BUFFER
  // --------------------------------------------------

  const handleCapture = async (frames) => {

    if (!visionEnabled) return;

    if (!frames || frames.length === 0) {
      console.warn("Frame buffer empty — skipping analysis");
      return;
    }

    console.log("Frame buffer received:", frames.length);

    const payload = { frames: frames.slice(0, 3)  };

    try {

      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log("Backend response:", data);

      if (!data) return;

      setActions(data.actions || null);
      setAnalysis(data.analysis || null);

      if (data.response) {

        const speech = new SpeechSynthesisUtterance(data.response);
        speech.rate = 0.9;
        speech.pitch = 0.9;

        speechSynthesis.cancel();
        speechSynthesis.speak(speech);

      }

    } catch (err) {

      console.error("Vision analysis failed:", err);

    }

  };

  // --------------------------------------------------
  // VOICE RESPONSE HANDLER
  // --------------------------------------------------

  const handleVoiceResult = (response) => {

    if (!response) return;

    console.log("Voice result:", response);

    setActions(response.actions || null);
    setAnalysis(response.analysis || null);

    if (response.response) {

      const speech = new SpeechSynthesisUtterance(response.response);
      speech.rate = 0.9;
      speech.pitch = 0.9;

      speechSynthesis.cancel();
      speechSynthesis.speak(speech);

    }

  };

  // --------------------------------------------------
  // TOGGLE AI VISION
  // --------------------------------------------------

  const toggleVision = () => {

    const nextState = !visionEnabled;

    console.log("AI Vision toggled:", nextState);

    setVisionEnabled(nextState);

    if (!nextState) {

      setAnalysis(null);
      setActions(null);

      speechSynthesis.cancel();

    }

  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
        An AI companion designed to support elderly users by providing
        safety monitoring, emotional reassurance, and guidance during
        moments of confusion or stress.
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

        {/* ---------------- ENVIRONMENT MONITOR ---------------- */}

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
              🤖 AI Vision {visionEnabled ? "Enabled" : "Disabled"}
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
            AI Vision observes surroundings and detects potential hazards,
            unusual activity, or objects that may help assist the user.
          </p>

        </div>

        {/* ---------------- DASHBOARD ANALYSIS ---------------- */}

        <div
          style={{
            flex: 1,
            minWidth: 350,
            background: "white",
            padding: 20,
            borderRadius: 10
          }}
        >

          <h2>Daily Support Dashboard</h2>

          <ScreenCapture
            onCapture={async (image) => {

              console.log("Dashboard screenshot captured");

              const response = await sendScreenshot(image, neuroPrompt);

              console.log("Dashboard AI response:", response);

              setActions(response.actions);
              setAnalysis(response.analysis);

            }}
          />

          <p style={{ fontSize: 12, color: "#777" }}>
            Capture a dashboard view to allow AI to analyze schedules,
            reminders, or daily assistance needs.
          </p>

        </div>

      </div>

      {/* ---------------- VOICE ASSISTANT ---------------- */}

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

      </div>

      {/* ---------------- AI GUIDANCE PANEL ---------------- */}

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