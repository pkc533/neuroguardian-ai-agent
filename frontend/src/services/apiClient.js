import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export async function sendScreenshot(image, prompt) {

  const res = await API.post("/chat", {
    prompt,
    image
  });

  return res.data;
}