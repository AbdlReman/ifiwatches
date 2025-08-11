export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dqs9q4bij",
  API_KEY: "281562877537549",
  API_SECRET: "Dz6mnIytSphlrjez3tK0hlVVXgk",
  UPLOAD_PRESET: "ml_default", // Default preset for unsigned uploads
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`;
