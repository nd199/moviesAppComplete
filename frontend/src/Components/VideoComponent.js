import React, {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../Firebase";

const VideoComponent = ({className, filePath, isMuted}) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            const videoRef = ref(storage, filePath);
            try {
                const url = await getDownloadURL(videoRef);
                setVideoUrl(url);
            } catch (error) {
                setError("Error fetching video URL: " + error.message);
            }
        };

        fetchVideoUrl();
    }, [filePath]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!videoUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <video
                src={videoUrl}
                className={className}
                autoPlay
                loop
                muted={isMuted}
            />
        </div>
    );
};

export default VideoComponent;
