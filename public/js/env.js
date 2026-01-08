export const ENV = {
  isLocal: location.hostname === "localhost",

  FRONTEND_ORIGIN:
    location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://portrait-intelligence-lab-frontend.vercel.app",

  BACKEND_ORIGIN:
    location.hostname === "localhost"
      ? "https://portrait-intelligence-lab-backend.onrender.com"
      : "https://portrait-intelligence-lab-backend.onrender.com"
};
