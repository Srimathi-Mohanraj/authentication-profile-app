export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  console.log("Cloudinary ENV:", CLOUD_NAME, UPLOAD_PRESET); 

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("❌ Cloudinary ENV missing");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("UPLOAD FAILED:", data);
    throw new Error(data?.error?.message || "Cloudinary Upload Error");
  }

  return data.secure_url;
};
