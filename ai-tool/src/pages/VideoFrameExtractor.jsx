import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./VideoFrameExtractor.css";
// ✅ adjust path if Sidebar is in a different folder


const VideoFrameExtractor = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [intervalSec, setIntervalSec] = useState("");
  const [frameCount, setFrameCount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    setVideoFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleBrowse = (e) => {
    handleFile(e.target.files[0]);
  };

  const extractFrames = () => {
    if (!videoFile || (!intervalSec && !frameCount)) return alert("Please upload a video and define interval or number of frames");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const zip = new JSZip();

    video.src = URL.createObjectURL(videoFile);
    video.load();

    video.onloadedmetadata = () => {
      const duration = video.duration;
      const totalFrames = frameCount ? parseInt(frameCount) : Math.floor(duration / intervalSec);
      const interval = frameCount ? duration / totalFrames : parseFloat(intervalSec);
      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;

      setLoading(true);
      let capturedFrames = 0;

      const capture = (time) => {
        video.currentTime = time;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, width, height);
          canvas.toBlob((blob) => {
            zip.file(`frame_${capturedFrames + 1}.jpg`, blob);
            capturedFrames++;
            if (capturedFrames < totalFrames) {
              capture(time + interval);
            } else {
              zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "frames.zip");
                setLoading(false);
              });
            }
          }, "image/jpeg");
        };
      };

      capture(0);
    };
  };

  return (
    <div >
      <div >  
      <div className="video-extractor-container">
        <h2>🎞️ Video to Image Converter</h2>

        <div
          className="drop-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {videoFile ? (
            <p>✅ Selected: {videoFile.name}</p>
          ) : (
            <p>Drag & drop video here or <label className="browse-btn">Browse<input type="file" accept="video/*" onChange={handleBrowse} hidden /></label></p>
          )}
        </div>

        <div className="input-group">
          <label>Interval (seconds):</label>
          <input
            type="number"
            value={intervalSec}
            onChange={(e) => {
              setIntervalSec(e.target.value);
              setFrameCount("");
            }}
            placeholder="e.g. 2"
          />
        </div>

        <div className="input-group">
          <label>Or Number of Images:</label>
          <input
            type="number"
            value={frameCount}
            onChange={(e) => {
              setFrameCount(e.target.value);
              setIntervalSec("");
            }}
            placeholder="e.g. 10"
          />
        </div>

        <button className="convert-button" onClick={extractFrames} disabled={loading}>
          {loading ? "Extracting..." : "Convert & Download"}
        </button>

        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
    </div >
  );
};

export default VideoFrameExtractor;
