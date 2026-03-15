import axios from "axios";

const API = axios.create({
  baseURL: "https://neuroguardian-backend-1024847090973.us-central1.run.app"
});


// --------------------------------------------------
// ENVIRONMENT / CAMERA ANALYSIS
// --------------------------------------------------

export async function analyzeEnvironment(image) {

  const res = await API.post("/chat", {
    image
  });

  return res.data;
}


// --------------------------------------------------
// DASHBOARD SCREENSHOT ANALYSIS (existing)
// --------------------------------------------------

export async function sendScreenshot(image, prompt) {

  const res = await API.post("/chat", {
    prompt,
    image
  });

  return res.data;
}