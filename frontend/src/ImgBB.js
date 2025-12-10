export const uploadToImgBB = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
    if (!apiKey) {
      reject(new Error("IMGBB API key missing"));
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data.url);
        } catch (err) {
          reject(new Error("Failed to parse ImgBB response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error while uploading to ImgBB"));
    xhr.send(formData);
  });
};
