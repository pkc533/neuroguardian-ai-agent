export function startStream() {

  const ws = new WebSocket("ws://localhost:8000/stream");

  ws.onopen = () => {
    console.log("stream started")
  };

  return ws;
}