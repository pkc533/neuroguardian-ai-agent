import React, { useEffect, useRef } from "react";

export default function ActionPanel({ actions, analysis, visionEnabled }) {

  const lastSpoken = useRef("");
  const storyTriggered = useRef(false);

  useEffect(() => {

    if (!analysis || !visionEnabled) {
      speechSynthesis.cancel();
      return;
    }

    if (lastSpoken.current === analysis) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(analysis);

    speech.rate = 0.9;
    speech.pitch = 0.9;

    speechSynthesis.speak(speech);

    lastSpoken.current = analysis;

  }, [analysis, visionEnabled]);

  useEffect(() => {

    if (!actions || !visionEnabled) return;

    if (actions.action !== "calm") {
      storyTriggered.current = false;
      return;
    }

    if (storyTriggered.current) return;

    storyTriggered.current = true;

    setTimeout(async () => {

      try {

        const response = await fetch("http://127.0.0.1:8000/story", {
          method: "POST"
        });

        const data = await response.json();

        if (data?.story) {

          speechSynthesis.cancel();

          const storySpeech = new SpeechSynthesisUtterance(data.story);

          storySpeech.rate = 0.85;
          storySpeech.pitch = 0.9;

          speechSynthesis.speak(storySpeech);

        }

      } catch (err) {

        console.error("Story trigger failed:", err);

      }

    }, 2000);

  }, [actions, visionEnabled]);

  const renderActionMessage = () => {

    if (!actions) return null;

    switch (actions.action) {

      case "remind":
        return "💊 It may be time to take your medication.";

      case "notify":
        return "📞 A caregiver may need to be contacted.";

      case "guide":
        return "➡️ I can help guide you to the next step.";

      case "calm":
        return "🫂 Let's take a slow breath together.";

      default:
        return "I'm here to assist you.";
    }

  };

  return (

    <div
      style={{
        background: "white",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #ddd",
        maxWidth: 520,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}
    >

      {analysis && (

        <div
          style={{
            marginBottom: 20,
            padding: 16,
            background: "#f7fbff",
            borderRadius: 10
          }}
        >

          <h3>🧠 NeuroGuardian Insight</h3>

          <p style={{ fontSize: 18, lineHeight: 1.4 }}>
            {analysis}
          </p>

        </div>

      )}

      {actions && (

        <div
          style={{
            padding: 16,
            background: "#eef6ff",
            borderRadius: 10
          }}
        >

          <h3>🤖 Suggested Assistance</h3>

          <p style={{ fontSize: 18 }}>
            {renderActionMessage()}
          </p>

        </div>

      )}

      {actions?.action === "calm" && (

        <div
          style={{
            marginTop: 20,
            padding: 14,
            background: "#ffeaea",
            borderRadius: 10
          }}
        >

          ❤️ Emotional Support Mode Activated

        </div>

      )}

    </div>

  );
}