export const uploadToImgBB = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
    if (!apiKey) return reject(new Error("IMGBB API key missing"));
    if (!file) return reject(new Error("No file provided"));

    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        if (xhr.status === 200 && data.success) {
          resolve(data.data.url);
        } else {
          reject(new Error(data?.error?.message || "ImgBB upload failed"));
        }
      } catch {
        reject(new Error("Invalid ImgBB response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.send(formData);
  });
};