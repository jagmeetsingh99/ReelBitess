// frontend/proj/src/pages/general/Home.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReelFeed from "../../components/ReelFeed";
import api from "../../utils/api";

const Home = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fromProfile, profileId, profileVideos, startIndex: profileStartIndex } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (fromProfile && profileVideos && profileVideos.length > 0) {
          // Coming from Profile page
          setCurrentProfileId(profileId);
          
          let videosToShow = profileVideos;
          
          if (profileStartIndex > 0 && profileStartIndex < profileVideos.length) {
            videosToShow = [
              ...profileVideos.slice(profileStartIndex),
              ...profileVideos.slice(0, profileStartIndex)
            ];
            setStartIndex(0);
          } else {
            setStartIndex(profileStartIndex || 0);
          }
          
          setVideos(videosToShow);
        } else {
          // Normal home page - fetch all videos
          setCurrentProfileId(null);
          
          const response = await api.get("/api/food");
          const allVideos = response.data.foodItems || [];
          
          const cleanVideos = allVideos.filter(
            (item) => item.video && item.video.startsWith("https://res.cloudinary.com")
          );

          setVideos(cleanVideos);
          setStartIndex(0);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromProfile, profileId, profileVideos, profileStartIndex]);

  const likeVideo = async (item) => {
    try {
      const res = await api.post("/api/food/like", { foodId: item._id });
      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { 
                ...v, 
                likeCount: res.data.like ? v.likeCount + 1 : Math.max(0, v.likeCount - 1) 
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
    }
  };

  const saveVideo = async (item) => {
    try {
      const res = await api.post("/api/food/save", { foodId: item._id });
      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { 
                ...v, 
                savesCount: res.data.save ? v.savesCount + 1 : Math.max(0, v.savesCount - 1) 
              }
            : v
        )
      );
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    }
  };

  // Reorder videos if startIndex > 0
  const reorderedVideos = startIndex > 0 && videos.length > 0
    ? [...videos.slice(startIndex), ...videos.slice(0, startIndex)]
    : videos;

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'black',
        color: 'white'
      }}>
        Loading videos...
      </div>
    );
  }

  return (
    <ReelFeed
      items={reorderedVideos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available"
      currentProfileId={currentProfileId}
    />
  );
};

export default Home;