import React from "react";

export default function StoryButton() {

  const tellStory = async () => {

    const response = await fetch("https://neuroguardian-backend-1024847090973.us-central1.run.app/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        theme: "calm"
      })
    });

    const data = await response.json();

    const speech = new SpeechSynthesisUtterance(data.story);

    speech.rate = 0.85;
    speech.pitch = 0.9;

    speechSynthesis.speak(speech);

    alert(data.story);
  };

  return (

    <button
      onClick={tellStory}
      style={{
        padding: "12px 18px",
        background: "#6c5ce7",
        color: "white",
        border: "none",
        borderRadius: 8,
        fontSize: 16
      }}
    >
      📖 Tell Me a Story
    </button>

  );
}