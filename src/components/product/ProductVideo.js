import React from "react";
import ReactPlayer from "react-player";
import clsx from "clsx";

const ProductVideo = ({ videoUrl, spaceBottomClass }) => {
  // Helper function to extract video URL from different formats
  const extractVideoUrl = (videoField) => {
    if (!videoField) return null;
    
    // If it's already a string, return it
    if (typeof videoField === 'string') {
      return videoField.trim();
    }
    
    // If it's an object, try to extract URL
    if (typeof videoField === 'object') {
      return videoField.url || videoField.src || videoField.link || null;
    }
    
    return null;
  };

  const finalVideoUrl = extractVideoUrl(videoUrl);

  if (!finalVideoUrl) {
    return null;
  }

  // Validate video URL
  const isValidVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Check for common video platforms
    const videoPatterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^https?:\/\/(www\.)?(vimeo\.com)\/.+/,
      /^https?:\/\/(www\.)?(dailymotion\.com)\/.+/,
      /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i
    ];
    
    return videoPatterns.some(pattern => pattern.test(url));
  };

  if (!isValidVideoUrl(finalVideoUrl)) {
    return null;
  }

  return (
    <div className={clsx("product-video-section", spaceBottomClass)}>
      <div className="product-video-wrapper">
        <div className="product-video-container">
          <ReactPlayer
            url={finalVideoUrl}
            width="100%"
            height="400px"
            controls={true}
            playing={true}
            muted={true}
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 1,
                  modestbranding: 1,
                  rel: 0,
                  controls: 1,
                  mute: 1,
                  autoplay: 1
                }
              },
              vimeo: {
                playerOptions: { 
                  responsive: true,
                  autopause: false,
                  controls: true,
                  muted: true,
                  autoplay: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductVideo;
