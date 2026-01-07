import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/reels.css";

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage, startIndex = 0 }) => {
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.6] }
    );

    videoRefs.current.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [items]);

  // Auto-play first video if coming from profile
  useEffect(() => {
    if (startIndex === 0 && items.length > 0) {
      const firstVideo = videoRefs.current.get(items[0]._id);
      if (firstVideo) {
        firstVideo.play().catch(() => {});
      }
    }
  }, [items, startIndex]);

  const setVideoRef = (id) => (el) => {
    if (!el) return;
    videoRefs.current.set(id, el);
  };

  if (!items.length) return <p className="empty">{emptyMessage}</p>;

  return (
    <div className="reels-page">
      <div className="reels-feed">
        {items.map((item) => (
          <section key={item._id} className="reel">
            {/* VIDEO */}
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={item.video} type="video/mp4" />
            </video>

            {/* OVERLAY */}
            <div className="reel-overlay">
              {/* LEFT: TITLE + VISIT */}
              <div className="reel-content">
                <p className="reel-title">{item.description}</p>

                {item.foodPartner?._id && (
                  <Link
                    className="reel-visit"
                    to={`/food-partner/${item.foodPartner._id}`}
                  >
                    Visit store →
                  </Link>
                )}
              </div>

              {/* RIGHT: LIKE / SAVE */}
              <div className="reel-actions">
                <button onClick={() => onLike(item)}>❤️</button>
                <span>{item.likeCount || 0}</span>

                <button onClick={() => onSave(item)}>🔖</button>
                {/* <span>{item.savesCount || 0}</span> */}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ReelFeed;