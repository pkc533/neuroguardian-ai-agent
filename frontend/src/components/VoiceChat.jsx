import React, { useState } from "react";

export default function VoiceChat({ onVoiceResult }) {

  const [listening, setListening] = useState(false);

  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    setListening(true);

    recognition.onresult = async (event) => {

      const transcript = event.results[0][0].transcript;

      console.log("Voice transcript:", transcript);

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: transcript
        })
      });

      const data = await response.json();

      if (onVoiceResult) {
        onVoiceResult(data);
      }

      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

  };

  return (
    <button
      onClick={startVoice}
      style={{
        padding: "10px 20px",
        background: listening ? "#e74c3c" : "#2e86de",
        color: "white",
        border: "none",
        borderRadius: 6
      }}
    >
      {listening ? "Listening..." : "🎤 Speak to NeuroGuardian"}
    </button>
  );
}