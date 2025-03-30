// src/components/VideoIntro.jsx
import React, { useEffect, useRef, useState } from "react";
import introVideoFile from "../assets/VideoIntro.mp4";

const VideoIntro = ({ onSkip, isMuted, setIsMuted }) => {
  const videoRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);

  // Try to autoplay when component mounts
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (videoRef.current && !hasAttemptedPlay) {
        setHasAttemptedPlay(true);
        try {
          // Always start muted for autoplay to work
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
          
          // After successful autoplay, restore user's mute preference
          setTimeout(() => {
            videoRef.current.muted = isMuted;
          }, 100);
        } catch (err) {
          console.log("Autoplay prevented:", err);
          // Keep the play overlay visible
        }
      }
    };
    
    attemptAutoplay();
  }, [isMuted, hasAttemptedPlay]);

  useEffect(() => {
    // Add event listener for spacebar to skip intro
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        onSkip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSkip]);

  useEffect(() => {
    // Set volume when video loads
    if (videoRef.current) {
      videoRef.current.volume = volume;
      if (isPlaying) {
        videoRef.current.muted = isMuted;
      }
    }
  }, [volume, isMuted, isPlaying]);

  // Handle manual play
  const handlePlayVideo = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.muted = isMuted; // Use user's mute preference
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Video play error:", err);
          // If play fails, try again with muted (which browsers allow)
          videoRef.current.muted = true;
          videoRef.current.play()
            .then(() => {
              setIsPlaying(true);
              // Inform user that they need to unmute manually
              alert("Video is playing muted. Click the volume icon to unmute.");
            })
            .catch(innerErr => {
              console.log("Even muted play failed:", innerErr);
            });
        });
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <div id="video-intro" className="video-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef} 
          id="intro-video" 
          onEnded={onSkip} 
          muted={isMuted}
          onClick={handlePlayVideo}
          playsInline // Add playsInline for mobile
        >
          <source src={introVideoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {!isPlaying && (
          <div className="play-overlay" onClick={handlePlayVideo}>
            <span className="material-icons play-icon">play_circle_filled</span>
            <p>Click to play intro</p>
          </div>
        )}
        
        <div className="video-controls">
          <div className="volume-control">
            <button 
              className="mute-button"
              onClick={() => setIsMuted(!isMuted)}
            >
              <span className="material-icons volume-icon">
                {isMuted ? "volume_off" : volume === 0 ? "volume_mute" : volume < 0.5 ? "volume_down" : "volume_up"}
              </span>
            </button>
            <input 
              type="range" 
              id="volume-slider" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <button className="skip-button" onClick={onSkip}>
            Skip <span className="material-icons">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoIntro;
