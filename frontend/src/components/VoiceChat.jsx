import React, { useState } from "react";

export default function VoiceChat({ onVoiceResult }) {

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = async (event) => {

      const spokenText = event.results[0][0].transcript;

      setTranscript(spokenText);

      console.log("Voice transcript:", spokenText);

      try {

        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: spokenText
          })
        });

        const data = await response.json();

        setAiResponse(data.analysis || data.response || "");

        if (onVoiceResult) {
          onVoiceResult(data);
        }

        // Voice therapy playback
        const message = data.response || data.analysis;

        if (message) {

          const speech = new SpeechSynthesisUtterance(message);

          speech.rate = 0.9;
          speech.pitch = 0.9;

          const voices = speechSynthesis.getVoices();

          const soothingVoice = voices.find(v =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("google")
          );

          if (soothingVoice) speech.voice = soothingVoice;

          speechSynthesis.speak(speech);

        }

      } catch (error) {

        console.error("Voice request failed:", error);

      }

      setListening(false);

    };

    recognition.onerror = (error) => {

      console.error("Speech recognition error:", error);

      setListening(false);

    };

    recognition.onend = () => {

      setListening(false);

    };

  };

  return (

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      <button
        onClick={startVoice}
        style={{
          padding: "10px 20px",
          background: listening ? "#e74c3c" : "#2e86de",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        {listening ? "🎧 Listening..." : "🎤 Speak to NeuroGuardian"}
      </button>

      {transcript && (
        <div
          style={{
            background: "#f0f4f8",
            padding: 10,
            borderRadius: 6,
            fontSize: 14
          }}
        >
          <b>You said:</b> {transcript}
        </div>
      )}

      {aiResponse && (
        <div
          style={{
            background: "#eafaf1",
            padding: 10,
            borderRadius: 6,
            fontSize: 14
          }}
        >
          <b>NeuroGuardian:</b> {aiResponse}
        </div>
      )}

    </div>
  );
}