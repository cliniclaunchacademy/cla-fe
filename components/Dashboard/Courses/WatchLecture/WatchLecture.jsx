"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

function VideoPlayer({ src }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [currentQuality, setCurrentQuality] = useState("auto");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Cleanup old HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            setIsReady(true);
        } else if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30 });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const levels = hls.levels.map((l, i) => ({
                    id: i,
                    height: l.height,
                }));
                setQualityLevels(levels);
                setIsReady(true);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data);
            });

            return () => hls.destroy();
        }
    }, [src]);

    const handleQualityChange = (value) => {
        setCurrentQuality(value);
        if (hlsRef.current) {
            hlsRef.current.currentLevel = value === "auto" ? -1 : Number(value);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 bg-gray-900/60 backdrop-blur-md p-6 rounded-xl w-[850px] max-w-full mx-auto shadow-xl border border-gray-800">
            <video
                ref={videoRef}
                className="rounded-lg border border-gray-700 w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
                playsInline
            />

            {!isReady && (
                <p className="text-gray-400 text-sm animate-pulse">Loading video...</p>
            )}

            {/* <div className="flex justify-between w-full items-center mt-3">     
                <button
                    onClick={() => {
                        const video = videoRef.current;
                        if (!video) return;
                        if (video.paused) {
                            video.play();
                            setIsPlaying(true);
                        } else {
                            video.pause();
                            setIsPlaying(false);
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-sm rounded-lg hover:bg-blue-700 transition"
                >
                    {isPlaying ? "Pause" : "Play"}
                </button>
       
                <select
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
                    value={currentQuality}
                    onChange={(e) => handleQualityChange(e.target.value)}
                >
                    <option value="auto">Auto</option>
                    {qualityLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.height}p
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="px-4 py-2 bg-gray-800 text-sm rounded-lg hover:bg-gray-700 transition"
                >
                    Fullscreen
                </button>
            </div> */}
        </div>
    );
}
 
export default function WatchLecture({lectureId}) {
    const playlistURL = `http://localhost:5000/api/v1/lectures/${lectureId}/watch`;

    return (
        <div 
        className="rounded-xl p-10 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white"
        >
            {/* <h1 className="text-3xl font-semibold mb-8 text-center tracking-wide">
                {lectureId}
            </h1> */}
            <VideoPlayer src={playlistURL} />
        </div>
    )
}
